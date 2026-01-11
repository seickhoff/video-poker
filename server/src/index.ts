import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  GameRoom,
  Player,
  GameConfig,
  Card,
} from "./types.js";
import { createDeck, shuffleDeck } from "./deck.js";
import { evaluatePokerHand, comparePokerHands } from "./handEvaluator.js";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Single game room for all participants
const gameRoom: GameRoom = {
  hostId: null,
  participants: new Map(),
  gameState: "input",
  players: [],
  winners: [],
  config: {
    deckType: "independent",
    jokerMode: false,
    hiddenCardsCount: 2,
  },
};

function broadcastGameState() {
  io.emit("game-state-update", {
    gameState: gameRoom.gameState,
    players: gameRoom.players,
    winners: gameRoom.winners,
    config: gameRoom.config,
  });
}

function broadcastParticipants() {
  const participants = Array.from(gameRoom.participants.values()).map((p) => ({
    id: p.id,
    name: p.name,
  }));
  io.emit("participants-update", participants);
}

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send role assignment - no one is host initially
  socket.emit("role-assigned", {
    isHost: socket.id === gameRoom.hostId,
    playerId: socket.id,
  });

  // Send host status
  socket.emit("host-status", {
    hasHost: gameRoom.hostId !== null,
  });

  // Send current game state
  socket.emit("game-state-update", {
    gameState: gameRoom.gameState,
    players: gameRoom.players,
    winners: gameRoom.winners,
    config: gameRoom.config,
  });

  socket.on("claim-host", (playerName: string) => {
    console.log(`User ${socket.id} claiming host as: ${playerName}`);

    // Only allow claiming host if no one is currently host
    if (gameRoom.hostId !== null) {
      socket.emit("error", "Someone is already the host");
      return;
    }

    gameRoom.hostId = socket.id;
    console.log(`Host claimed by: ${socket.id}`);

    // Add as participant
    const player: Player = {
      id: socket.id,
      name: playerName,
      cards: [],
      deck: [],
      handEvaluation: null,
    };
    gameRoom.participants.set(socket.id, player);

    // Notify this user they are now host
    socket.emit("role-assigned", {
      isHost: true,
      playerId: socket.id,
    });

    // Broadcast to all that there is now a host
    io.emit("host-status", {
      hasHost: true,
    });

    broadcastParticipants();
  });

  socket.on("release-host", () => {
    console.log(`User ${socket.id} releasing host`);

    if (socket.id !== gameRoom.hostId) {
      socket.emit("error", "You are not the host");
      return;
    }

    // Release host role and reset game
    gameRoom.hostId = null;
    gameRoom.participants.clear();
    gameRoom.players = [];
    gameRoom.gameState = "input";
    gameRoom.winners = [];
    console.log("Host released - game reset");

    // Broadcast to all that there is no host
    io.emit("host-status", {
      hasHost: false,
    });

    // Broadcast game state update to all clients
    broadcastGameState();

    // Tell everyone to reset (go back to name entry)
    io.emit("game-reset");
  });

  socket.on("force-claim-host", () => {
    console.log(
      `User ${socket.id} force claiming host from orphaned/inactive host`
    );

    // Check if user is already a participant
    const participant = gameRoom.participants.get(socket.id);
    if (!participant) {
      socket.emit("error", "You must be a participant to claim host");
      return;
    }

    // Notify old host they've been replaced (if still connected)
    if (gameRoom.hostId) {
      io.to(gameRoom.hostId).emit("role-assigned", {
        isHost: false,
        playerId: gameRoom.hostId,
      });
    }

    // Assign new host
    gameRoom.hostId = socket.id;
    console.log(`Host forcefully claimed by: ${socket.id}`);

    // Notify new host
    socket.emit("role-assigned", {
      isHost: true,
      playerId: socket.id,
    });

    // Broadcast to all that there is a host
    io.emit("host-status", {
      hasHost: true,
    });
  });

  socket.on("join-game", (playerName: string) => {
    console.log(`Player ${socket.id} joining as: ${playerName}`);

    const player: Player = {
      id: socket.id,
      name: playerName,
      cards: [],
      deck: [],
      handEvaluation: null,
    };

    gameRoom.participants.set(socket.id, player);
    broadcastParticipants();
  });

  socket.on("update-config", (config: GameConfig) => {
    // Only host can update config
    if (socket.id !== gameRoom.hostId) {
      socket.emit("error", "Only the host can update game configuration");
      return;
    }

    gameRoom.config = config;
    broadcastGameState();
  });

  socket.on("start-game", async () => {
    // Only host can start game
    if (socket.id !== gameRoom.hostId) {
      socket.emit("error", "Only the host can start the game");
      return;
    }

    const participants = Array.from(gameRoom.participants.values());
    if (participants.length === 0) {
      socket.emit("error", "No participants in the game");
      return;
    }

    let newPlayers: Player[];
    const { deckType, jokerMode } = gameRoom.config;

    if (deckType === "shared") {
      const cardsNeeded = participants.length * 5;
      const cardsPerDeck = jokerMode ? 54 : 52;
      const jokersPerDeck = jokerMode ? 2 : 0;
      const decksNeeded = Math.ceil(cardsNeeded / cardsPerDeck);

      let combinedDeck: Card[] = [];
      for (let i = 0; i < decksNeeded; i++) {
        combinedDeck = combinedDeck.concat(createDeck(jokersPerDeck));
      }

      const shuffledDeck = await shuffleDeck(combinedDeck);

      newPlayers = participants.map((participant, index) => {
        const startIdx = index * 5;
        const cards = shuffledDeck.slice(startIdx, startIdx + 5);
        return {
          ...participant,
          cards,
          deck: [],
          handEvaluation: null,
        };
      });
    } else {
      const jokersPerDeck = jokerMode ? 2 : 0;
      newPlayers = await Promise.all(
        participants.map(async (participant) => {
          const deck = createDeck(jokersPerDeck);
          const shuffledDeck = await shuffleDeck(deck);
          const cards = shuffledDeck.slice(0, 5);
          const remainingDeck = shuffledDeck.slice(5);

          return {
            ...participant,
            cards,
            deck: remainingDeck,
            handEvaluation: null,
          };
        })
      );
    }

    // Sort players alphabetically by name
    gameRoom.players = newPlayers.sort((a, b) => a.name.localeCompare(b.name));
    gameRoom.gameState = "showing";
    gameRoom.winners = [];

    broadcastGameState();
  });

  socket.on("reveal-cards", () => {
    // Only host can reveal cards
    if (socket.id !== gameRoom.hostId) {
      socket.emit("error", "Only the host can reveal cards");
      return;
    }

    // Evaluate each player's hand
    const evaluatedPlayers = gameRoom.players.map((player) => {
      const evaluation = evaluatePokerHand(player.cards);
      return {
        ...player,
        handEvaluation: evaluation,
      };
    });

    // Sort players by hand strength (best to worst)
    const sortedPlayers = [...evaluatedPlayers].sort((a, b) => {
      return comparePokerHands(b.handEvaluation!, a.handEvaluation!);
    });

    gameRoom.players = sortedPlayers;

    // Find the winner(s)
    if (sortedPlayers.length === 0) return;

    const topPlayers: Player[] = [sortedPlayers[0]];

    for (let i = 1; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      const comparison = comparePokerHands(
        player.handEvaluation!,
        topPlayers[0].handEvaluation!
      );

      if (comparison === 0) {
        topPlayers.push(player);
      } else {
        break;
      }
    }

    gameRoom.winners = topPlayers;
    gameRoom.gameState = "revealed";

    broadcastGameState();
  });

  socket.on("start-tiebreaker", async () => {
    // Only host can start tiebreaker
    if (socket.id !== gameRoom.hostId) {
      socket.emit("error", "Only the host can start a tiebreaker");
      return;
    }

    // Create new hands for tied players only
    const newPlayers: Player[] = await Promise.all(
      gameRoom.winners.map(async (player) => {
        const deck = createDeck();
        const shuffledDeck = await shuffleDeck(deck);
        const cards = shuffledDeck.slice(0, 5);
        const remainingDeck = shuffledDeck.slice(5);

        return {
          ...player,
          cards,
          deck: remainingDeck,
          handEvaluation: null,
        };
      })
    );

    gameRoom.players = newPlayers;
    gameRoom.gameState = "showing";
    gameRoom.winners = [];

    broadcastGameState();
  });

  socket.on("new-game", () => {
    // Only host can start new game
    if (socket.id !== gameRoom.hostId) {
      socket.emit("error", "Only the host can start a new game");
      return;
    }

    gameRoom.players = [];
    gameRoom.gameState = "input";
    gameRoom.winners = [];

    broadcastGameState();
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove from participants
    gameRoom.participants.delete(socket.id);
    broadcastParticipants();

    // If host disconnected, assign new host
    if (socket.id === gameRoom.hostId) {
      const remainingParticipants = Array.from(gameRoom.participants.keys());
      if (remainingParticipants.length > 0) {
        gameRoom.hostId = remainingParticipants[0];
        console.log(`New host assigned: ${gameRoom.hostId}`);
        io.to(gameRoom.hostId).emit("role-assigned", {
          isHost: true,
          playerId: gameRoom.hostId,
        });
      } else {
        gameRoom.hostId = null;
        // Reset game state when all players leave
        gameRoom.players = [];
        gameRoom.gameState = "input";
        gameRoom.winners = [];
      }
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", participants: gameRoom.participants.size });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(
    `Accepting connections from: ${process.env.CLIENT_URL || "http://localhost:5173"}`
  );
});

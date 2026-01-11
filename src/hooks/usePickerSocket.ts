import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Card } from "../types/game";
import { PokerHandEvaluation } from "../utils/pickerHandEvaluator";

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  deck: Card[];
  handEvaluation: PokerHandEvaluation | null;
}

export type GameState = "input" | "showing" | "revealed" | "tiebreaker";
export type DeckType = "independent" | "shared";
export type HiddenCardsCount = 1 | 2;

export interface GameConfig {
  deckType: DeckType;
  jokerMode: boolean;
  hiddenCardsCount: HiddenCardsCount;
}

interface UsePickerSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isHost: boolean;
  hasHost: boolean;
  playerId: string | null;
  gameState: GameState;
  players: Player[];
  winners: Player[];
  config: GameConfig;
  participants: Array<{ id: string; name: string }>;
  claimHost: (playerName: string) => void;
  releaseHost: () => void;
  forceClaimHost: () => void;
  joinGame: (playerName: string) => void;
  updateConfig: (config: GameConfig) => void;
  startGame: () => void;
  revealCards: () => void;
  startTiebreaker: () => void;
  newGame: () => void;
  error: string | null;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export function usePickerSocket(): UsePickerSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [hasHost, setHasHost] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("input");
  const [players, setPlayers] = useState<Player[]>([]);
  const [winners, setWinners] = useState<Player[]>([]);
  const [config, setConfig] = useState<GameConfig>({
    deckType: "independent",
    jokerMode: false,
    hiddenCardsCount: 2,
  });
  const [participants, setParticipants] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("role-assigned", (data) => {
      console.log("Role assigned:", data);
      setIsHost(data.isHost);
      setPlayerId(data.playerId);
    });

    newSocket.on("host-status", (data) => {
      console.log("Host status:", data);
      setHasHost(data.hasHost);
    });

    newSocket.on("game-state-update", (data) => {
      console.log("Game state update:", data);
      setGameState(data.gameState);
      setPlayers(data.players);
      setWinners(data.winners);
      setConfig(data.config);
    });

    newSocket.on("participants-update", (data) => {
      console.log("Participants update:", data);
      setParticipants(data);
    });

    newSocket.on("game-reset", () => {
      console.log("Game reset - returning to name entry");
      // Reset all state
      setIsHost(false);
      setHasHost(false);
      setGameState("input");
      setPlayers([]);
      setWinners([]);
      setParticipants([]);
      hasJoinedRef.current = false;
      // Trigger re-render by updating a state that forces component reset
      window.location.reload();
    });

    newSocket.on("error", (message) => {
      console.error("Server error:", message);
      setError(message);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const claimHost = useCallback(
    (playerName: string) => {
      if (socket) {
        console.log("Claiming host as:", playerName);
        socket.emit("claim-host", playerName);
        hasJoinedRef.current = true;
      }
    },
    [socket]
  );

  const releaseHost = useCallback(() => {
    if (socket) {
      console.log("Releasing host");
      socket.emit("release-host");
    }
  }, [socket]);

  const forceClaimHost = useCallback(() => {
    if (socket) {
      console.log("Force claiming host");
      socket.emit("force-claim-host");
    }
  }, [socket]);

  const joinGame = useCallback(
    (playerName: string) => {
      if (socket) {
        console.log("Joining game as:", playerName);
        socket.emit("join-game", playerName);
        hasJoinedRef.current = true;
      }
    },
    [socket]
  );

  const updateConfig = useCallback(
    (newConfig: GameConfig) => {
      if (socket && isHost) {
        socket.emit("update-config", newConfig);
      }
    },
    [socket, isHost]
  );

  const startGame = useCallback(() => {
    if (socket && isHost) {
      socket.emit("start-game");
    }
  }, [socket, isHost]);

  const revealCards = useCallback(() => {
    if (socket && isHost) {
      socket.emit("reveal-cards");
    }
  }, [socket, isHost]);

  const startTiebreaker = useCallback(() => {
    if (socket && isHost) {
      socket.emit("start-tiebreaker");
    }
  }, [socket, isHost]);

  const newGame = useCallback(() => {
    if (socket && isHost) {
      socket.emit("new-game");
    }
  }, [socket, isHost]);

  return {
    socket,
    isConnected,
    isHost,
    hasHost,
    playerId,
    gameState,
    players,
    winners,
    config,
    participants,
    claimHost,
    releaseHost,
    forceClaimHost,
    joinGame,
    updateConfig,
    startGame,
    revealCards,
    startTiebreaker,
    newGame,
    error,
  };
}

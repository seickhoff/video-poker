import type { PokerHandEvaluation } from "./handEvaluator.js";

export type Card = string;

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

export interface GameRoom {
  hostId: string | null;
  participants: Map<string, Player>;
  gameState: GameState;
  players: Player[];
  winners: Player[];
  config: GameConfig;
}

// Client to Server Events
export interface ClientToServerEvents {
  "claim-host": (playerName: string) => void;
  "release-host": () => void;
  "force-claim-host": () => void;
  "join-game": (playerName: string) => void;
  "update-config": (config: GameConfig) => void;
  "start-game": () => void;
  "reveal-cards": () => void;
  "start-tiebreaker": () => void;
  "new-game": () => void;
  disconnect: () => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  "role-assigned": (data: { isHost: boolean; playerId: string }) => void;
  "host-status": (data: { hasHost: boolean }) => void;
  "game-state-update": (data: {
    gameState: GameState;
    players: Player[];
    winners: Player[];
    config: GameConfig;
  }) => void;
  "participants-update": (
    participants: Array<{ id: string; name: string }>
  ) => void;
  "game-reset": () => void;
  error: (message: string) => void;
}

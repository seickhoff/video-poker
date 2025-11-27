import { createContext } from "react";
import { Card, GameType, GameSequence, HandType } from "../types/game";

export interface VideoPokerState {
  gameType: GameType | null;
  credits: number;
  sequence: GameSequence;
  hand: Card[];
  deck: Card[];
  wager: number;
  heldCards: boolean[];
  currentHand: HandType;
  payout: number;
  originalCredits: number;
  doubleDownHand: Card[];
  selectedCardIndex: number;

  startNewGame: (gameType: GameType, initialCredits?: number) => void;
  setBet: (wager: number) => void;
  dealCards: () => void;
  toggleHoldCard: (index: number) => void;
  drawCards: () => void;
  startDoubleDown: () => void;
  selectDoubleDownCard: (index: number) => void;
  returnToMenu: () => void;
  continueGame: () => void;
}

export const VideoPokerContext = createContext<VideoPokerState | undefined>(
  undefined
);

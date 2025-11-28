export type Suit = "h" | "d" | "c" | "s" | "j";
export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";
export type Card = `${Rank}${Suit}` | "O1" | "O2";

export type GameType =
  | "Jacks or Better"
  | "Aces and Faces"
  | "Bonus Poker"
  | "Double Bonus"
  | "Double Double Bonus"
  | "Triple Double Bonus"
  | "Deuces Wild"
  | "Joker Wild"
  | "Double Joker Poker";

export type GameSequence = 0 | 1 | 2 | "d" | "e";

export type HandType =
  | "Royal Flush"
  | "Straight Flush"
  | "Four of a Kind"
  | "Full House"
  | "Flush"
  | "Straight"
  | "Three of a Kind"
  | "Two Pair"
  | "Jacks or Better"
  | "Kings or Better"
  | "Five of a Kind"
  | "Wild Royal Flush"
  | "Four Deuces"
  | "Four Aces"
  | "Four Aces w/ Kicker"
  | "4 Aces w/ 2,3,4"
  | "4 Aces"
  | "Four 2s-4s"
  | "Four 2s-4s w/ Kicker"
  | "4 2s-4s w/ A,2,3,4"
  | "4 2s-4s"
  | "Four 5s-Kings"
  | "4 5s-Ks w/ A,2,3,4"
  | "4 5s-Ks"
  | "Four 2-4"
  | "Four 5-K"
  | "Four Jacks, Queens, or Kings"
  | "";

export interface GameState {
  gameType: GameType;
  credits: number;
  sequence: GameSequence;
  hand: Card[];
  deck: Card[];
  wager: number;
  heldCards: boolean[];
  currentHand: HandType;
  payout: number;
  originalCredits: number;
  doubleDownHand?: Card[];
}

export interface HandEvaluation {
  handType: HandType;
  payout: number;
}

export interface PayoutTableEntry {
  hand: HandType;
  payouts: [number, number, number, number, number];
}

export interface GameConfig {
  name: GameType;
  jokers: number;
  payoutTable: PayoutTableEntry[];
  description: string;
}

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
  | "Double Joker Poker"
  | "Pick-a-Pair Poker";

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
  | "Nines or Better"
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

// Enums for convenient reference (optional usage)
export const Suit = {
  Hearts: "h" as Suit,
  Diamonds: "d" as Suit,
  Clubs: "c" as Suit,
  Spades: "s" as Suit,
  Joker: "j" as Suit,
} as const;

export const Rank = {
  Ace: "A" as Rank,
  Two: "2" as Rank,
  Three: "3" as Rank,
  Four: "4" as Rank,
  Five: "5" as Rank,
  Six: "6" as Rank,
  Seven: "7" as Rank,
  Eight: "8" as Rank,
  Nine: "9" as Rank,
  Ten: "10" as Rank,
  Jack: "J" as Rank,
  Queen: "Q" as Rank,
  King: "K" as Rank,
} as const;

export const GameType = {
  JacksOrBetter: "Jacks or Better" as GameType,
  AcesAndFaces: "Aces and Faces" as GameType,
  BonusPoker: "Bonus Poker" as GameType,
  DoubleBonus: "Double Bonus" as GameType,
  DoubleDoubleBonus: "Double Double Bonus" as GameType,
  TripleDoubleBonus: "Triple Double Bonus" as GameType,
  DeucesWild: "Deuces Wild" as GameType,
  JokerWild: "Joker Wild" as GameType,
  DoubleJokerPoker: "Double Joker Poker" as GameType,
  PickAPairPoker: "Pick-a-Pair Poker" as GameType,
} as const;

export const GameSequence = {
  Betting: 0 as GameSequence,
  FirstDeal: 1 as GameSequence,
  Results: 2 as GameSequence,
  DoubleDown: "d" as GameSequence,
  DoubleDownEnd: "e" as GameSequence,
} as const;

export const HandType = {
  RoyalFlush: "Royal Flush" as HandType,
  StraightFlush: "Straight Flush" as HandType,
  FourOfAKind: "Four of a Kind" as HandType,
  FullHouse: "Full House" as HandType,
  Flush: "Flush" as HandType,
  Straight: "Straight" as HandType,
  ThreeOfAKind: "Three of a Kind" as HandType,
  TwoPair: "Two Pair" as HandType,
  JacksOrBetter: "Jacks or Better" as HandType,
  KingsOrBetter: "Kings or Better" as HandType,
  NinesOrBetter: "Nines or Better" as HandType,
  FiveOfAKind: "Five of a Kind" as HandType,
  WildRoyalFlush: "Wild Royal Flush" as HandType,
  FourDeuces: "Four Deuces" as HandType,
  FourAces: "Four Aces" as HandType,
  FourAcesWithKicker: "Four Aces w/ Kicker" as HandType,
  FourAcesWith234: "4 Aces w/ 2,3,4" as HandType,
  FourAcesAlt: "4 Aces" as HandType,
  Four2s4s: "Four 2s-4s" as HandType,
  Four2s4sWithKicker: "Four 2s-4s w/ Kicker" as HandType,
  Four2s4sWithA234: "4 2s-4s w/ A,2,3,4" as HandType,
  Four2s4sAlt: "4 2s-4s" as HandType,
  Four5sKings: "Four 5s-Kings" as HandType,
  Four5sKsWithA234: "4 5s-Ks w/ A,2,3,4" as HandType,
  Four5sKsAlt: "4 5s-Ks" as HandType,
  Four24: "Four 2-4" as HandType,
  Four5K: "Four 5-K" as HandType,
  FourJQK: "Four Jacks, Queens, or Kings" as HandType,
  None: "" as HandType,
} as const;

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

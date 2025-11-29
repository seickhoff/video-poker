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

export enum GameType {
  JacksOrBetter = "Jacks or Better",
  AcesAndFaces = "Aces and Faces",
  BonusPoker = "Bonus Poker",
  DoubleBonus = "Double Bonus",
  DoubleDoubleBonus = "Double Double Bonus",
  TripleDoubleBonus = "Triple Double Bonus",
  DeucesWild = "Deuces Wild",
  JokerWild = "Joker Wild",
  DoubleJokerPoker = "Double Joker Poker",
  PickAPairPoker = "Pick-a-Pair Poker",
}

export type GameSequence = 0 | 1 | 2 | "d" | "e";

export enum HandType {
  RoyalFlush = "ROYAL FLUSH",
  StraightFlush = "STRAIGHT FLUSH",
  FourOfAKind = "FOUR OF A KIND",
  FullHouse = "FULL HOUSE",
  Flush = "FLUSH",
  Straight = "STRAIGHT",
  ThreeOfAKind = "THREE OF A KIND",
  TwoPair = "TWO PAIR",
  JacksOrBetter = "JACKS OR BETTER",
  KingsOrBetter = "KINGS OR BETTER",
  NinesOrBetter = "NINES OR BETTER",
  FiveOfAKind = "FIVE OF A KIND",
  WildRoyalFlush = "WILD ROYAL FLUSH",
  FourDeuces = "FOUR DEUCES",
  FourAces = "FOUR ACES",
  FourAcesWith234 = "FOUR ACES W/ 2,3,4",
  Four2s4s = "FOUR 2s-4s",
  Four2s4sWithA234 = "4 2s-4s W/ A,2,3,4",
  Four5sKings = "FOUR 5s-KINGS",
  FourJQK = "FOUR JACKS, QUEENS, or KINGS",
  None = "",
}

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

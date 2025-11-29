import { HandType } from "../types/game";
import { HandAnalysis } from "./handEvaluator";

export interface HandRule {
  handType: HandType;
  condition: (analysis: HandAnalysis) => boolean;
}

// Common hand rules used across most/all game types
export const COMMON_HAND_RULES: HandRule[] = [
  {
    handType: "Royal Flush",
    condition: (a) =>
      a.isRoyal && a.isFlush && a.isStraight && a.isNaturalRoyal,
  },
  {
    handType: "Straight Flush",
    condition: (a) => a.isStraight && a.isFlush,
  },
  {
    handType: "Four of a Kind",
    condition: (a) => a.isFourKind,
  },
  {
    handType: "Full House",
    condition: (a) => a.isFullHouse,
  },
  {
    handType: "Flush",
    condition: (a) => a.isFlush,
  },
  {
    handType: "Straight",
    condition: (a) => a.isStraight,
  },
  {
    handType: "Three of a Kind",
    condition: (a) => a.isThreeKind,
  },
  {
    handType: "Two Pair",
    condition: (a) => a.isTwoPair,
  },
];

// Jacks or Better specific rules
export const JACKS_OR_BETTER_RULES: HandRule[] = [
  ...COMMON_HAND_RULES,
  {
    handType: "Jacks or Better",
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Aces and Faces specific rules (adds Four Aces and Four JQK before standard Four of a Kind)
export const ACES_AND_FACES_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // Royal Flush
  {
    handType: "Four Aces",
    condition: (a) => a.isFourKind && a.fourKindRank === "A",
  },
  COMMON_HAND_RULES[1], // Straight Flush
  {
    handType: "Four Jacks, Queens, or Kings",
    condition: (a) =>
      a.isFourKind && ["K", "Q", "J"].includes(a.fourKindRank || ""),
  },
  {
    handType: "Four of a Kind",
    condition: (a) => a.isFourKind, // Catch-all for other four of a kinds
  },
  ...COMMON_HAND_RULES.slice(3), // Full House onwards
  {
    handType: "Jacks or Better",
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Bonus Poker specific rules
export const BONUS_POKER_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // Royal Flush
  COMMON_HAND_RULES[1], // Straight Flush
  {
    handType: "Four Aces",
    condition: (a) => a.isFourKind && a.fourKindRank === "A",
  },
  {
    handType: "Four 2-4",
    condition: (a) =>
      a.isFourKind && ["2", "3", "4"].includes(a.fourKindRank || ""),
  },
  {
    handType: "Four 5-K",
    condition: (a) => a.isFourKind, // Catch-all
  },
  ...COMMON_HAND_RULES.slice(3), // Full House onwards
  {
    handType: "Jacks or Better",
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Wild card game rules
export const JOKER_WILD_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // Royal Flush
  {
    handType: "Five of a Kind",
    condition: (a) => a.isFiveKind,
  },
  {
    handType: "Wild Royal Flush",
    condition: (a) =>
      a.isRoyal && a.isFlush && a.isStraight && !a.isNaturalRoyal,
  },
  ...COMMON_HAND_RULES.slice(1, 7), // Straight Flush through Three of a Kind
  {
    handType: "Two Pair",
    condition: (a) => a.isTwoPair,
  },
  {
    handType: "Kings or Better",
    condition: (a) => a.isPair && a.isKingsOrBetter,
  },
];

// Pick-a-Pair Poker specific rules
export const PICK_A_PAIR_RULES: HandRule[] = [
  ...COMMON_HAND_RULES,
  {
    handType: "Nines or Better",
    condition: (a) => a.isPair && a.isNinesOrBetter,
  },
];

// Deuces Wild rules
export const DEUCES_WILD_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // Royal Flush
  {
    handType: "Four Deuces",
    condition: (a) => a.isFourDeuces,
  },
  {
    handType: "Wild Royal Flush",
    condition: (a) =>
      a.isRoyal && a.isFlush && a.isStraight && !a.isNaturalRoyal,
  },
  {
    handType: "Five of a Kind",
    condition: (a) => a.isFiveKind,
  },
  ...COMMON_HAND_RULES.slice(1), // Straight Flush onwards
];

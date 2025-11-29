import { HandType } from "../types/game";
import { HandAnalysis } from "./handEvaluator";

export interface HandRule {
  handType: HandType;
  condition: (analysis: HandAnalysis) => boolean;
}

// Common hand rules used across most/all game types
export const COMMON_HAND_RULES: HandRule[] = [
  {
    handType: HandType.RoyalFlush,
    condition: (a) =>
      a.isRoyal && a.isFlush && a.isStraight && a.isNaturalRoyal,
  },
  {
    handType: HandType.StraightFlush,
    condition: (a) => a.isStraight && a.isFlush,
  },
  {
    handType: HandType.FourOfAKind,
    condition: (a) => a.isFourKind,
  },
  {
    handType: HandType.FullHouse,
    condition: (a) => a.isFullHouse,
  },
  {
    handType: HandType.Flush,
    condition: (a) => a.isFlush,
  },
  {
    handType: HandType.Straight,
    condition: (a) => a.isStraight,
  },
  {
    handType: HandType.ThreeOfAKind,
    condition: (a) => a.isThreeKind,
  },
  {
    handType: HandType.TwoPair,
    condition: (a) => a.isTwoPair,
  },
];

// JACKS OR BETTER specific rules
export const JACKS_OR_BETTER_RULES: HandRule[] = [
  ...COMMON_HAND_RULES,
  {
    handType: HandType.JacksOrBetter,
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Aces and Faces specific rules (adds FOUR ACES and Four JQK before standard FOUR OF A KIND)
export const ACES_AND_FACES_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // ROYAL FLUSH
  {
    handType: HandType.FourAces,
    condition: (a) => a.isFourKind && a.fourKindRank === "A",
  },
  COMMON_HAND_RULES[1], // STRAIGHT FLUSH
  {
    handType: HandType.FourJQK,
    condition: (a) =>
      a.isFourKind && ["K", "Q", "J"].includes(a.fourKindRank || ""),
  },
  {
    handType: HandType.FourOfAKind,
    condition: (a) => a.isFourKind, // Catch-all for other four of a kinds
  },
  ...COMMON_HAND_RULES.slice(3), // FULL HOUSE onwards
  {
    handType: HandType.JacksOrBetter,
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Bonus Poker specific rules
export const BONUS_POKER_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // ROYAL FLUSH
  COMMON_HAND_RULES[1], // STRAIGHT FLUSH
  {
    handType: HandType.FourAces,
    condition: (a) => a.isFourKind && a.fourKindRank === "A",
  },
  {
    handType: HandType.Four2s4s,
    condition: (a) =>
      a.isFourKind && ["2", "3", "4"].includes(a.fourKindRank || ""),
  },
  {
    handType: HandType.Four5sKings,
    condition: (a) => a.isFourKind, // Catch-all
  },
  ...COMMON_HAND_RULES.slice(3), // FULL HOUSE onwards
  {
    handType: HandType.JacksOrBetter,
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Wild card game rules
export const JOKER_WILD_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // ROYAL FLUSH
  {
    handType: HandType.FiveOfAKind,
    condition: (a) => a.isFiveKind,
  },
  {
    handType: HandType.WildRoyalFlush,
    condition: (a) =>
      a.isRoyal && a.isFlush && a.isStraight && !a.isNaturalRoyal,
  },
  ...COMMON_HAND_RULES.slice(1, 7), // STRAIGHT FLUSH through THREE OF A KIND
  {
    handType: HandType.TwoPair,
    condition: (a) => a.isTwoPair,
  },
  {
    handType: HandType.KingsOrBetter,
    condition: (a) => a.isPair && a.isKingsOrBetter,
  },
];

// Pick-a-Pair Poker specific rules
export const PICK_A_PAIR_RULES: HandRule[] = [
  ...COMMON_HAND_RULES,
  {
    handType: HandType.NinesOrBetter,
    condition: (a) => a.isPair && a.isNinesOrBetter,
  },
];

// Deuces Wild rules
export const DEUCES_WILD_RULES: HandRule[] = [
  COMMON_HAND_RULES[0], // ROYAL FLUSH
  {
    handType: HandType.FourDeuces,
    condition: (a) => a.isFourDeuces,
  },
  {
    handType: HandType.WildRoyalFlush,
    condition: (a) =>
      a.isRoyal && a.isFlush && a.isStraight && !a.isNaturalRoyal,
  },
  {
    handType: HandType.FiveOfAKind,
    condition: (a) => a.isFiveKind,
  },
  ...COMMON_HAND_RULES.slice(1), // STRAIGHT FLUSH onwards
];

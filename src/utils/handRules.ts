import { HandType } from "../types/game";
import { HandAnalysis } from "./handEvaluator";

export interface HandRule {
  handType: HandType;
  condition: (analysis: HandAnalysis) => boolean;
}

// Helper function to find a rule by HandType
const findRule = (rules: HandRule[], handType: HandType): HandRule => {
  const rule = rules.find((r) => r.handType === handType);
  if (!rule) {
    throw new Error(`Rule not found for HandType: ${handType}`);
  }
  return rule;
};

// Helper function to filter rules by HandTypes
const getRulesByTypes = (
  rules: HandRule[],
  handTypes: HandType[]
): HandRule[] => {
  return handTypes.map((ht) => findRule(rules, ht));
};

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
  findRule(COMMON_HAND_RULES, HandType.RoyalFlush),
  {
    handType: HandType.FourAces,
    condition: (a) => a.isFourKind && a.fourKindRank === "A",
  },
  findRule(COMMON_HAND_RULES, HandType.StraightFlush),
  {
    handType: HandType.FourJQK,
    condition: (a) =>
      a.isFourKind && ["K", "Q", "J"].includes(a.fourKindRank || ""),
  },
  {
    handType: HandType.FourOfAKind,
    condition: (a) => a.isFourKind, // Catch-all for other four of a kinds
  },
  ...getRulesByTypes(COMMON_HAND_RULES, [
    HandType.FullHouse,
    HandType.Flush,
    HandType.Straight,
    HandType.ThreeOfAKind,
    HandType.TwoPair,
  ]),
  {
    handType: HandType.JacksOrBetter,
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Bonus Poker specific rules
export const BONUS_POKER_RULES: HandRule[] = [
  findRule(COMMON_HAND_RULES, HandType.RoyalFlush),
  findRule(COMMON_HAND_RULES, HandType.StraightFlush),
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
  ...getRulesByTypes(COMMON_HAND_RULES, [
    HandType.FullHouse,
    HandType.Flush,
    HandType.Straight,
    HandType.ThreeOfAKind,
    HandType.TwoPair,
  ]),
  {
    handType: HandType.JacksOrBetter,
    condition: (a) => a.isPair && a.isJacksOrBetter,
  },
];

// Wild card game rules
export const JOKER_WILD_RULES: HandRule[] = [
  findRule(COMMON_HAND_RULES, HandType.RoyalFlush),
  {
    handType: HandType.FiveOfAKind,
    condition: (a) => a.isFiveKind,
  },
  {
    handType: HandType.WildRoyalFlush,
    condition: (a) =>
      a.isRoyal && a.isFlush && a.isStraight && !a.isNaturalRoyal,
  },
  ...getRulesByTypes(COMMON_HAND_RULES, [
    HandType.StraightFlush,
    HandType.FourOfAKind,
    HandType.FullHouse,
    HandType.Flush,
    HandType.Straight,
    HandType.ThreeOfAKind,
  ]),
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
  findRule(COMMON_HAND_RULES, HandType.RoyalFlush),
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
  ...getRulesByTypes(COMMON_HAND_RULES, [
    HandType.StraightFlush,
    HandType.FourOfAKind,
    HandType.FullHouse,
    HandType.Flush,
    HandType.Straight,
    HandType.ThreeOfAKind,
    HandType.TwoPair,
  ]),
];

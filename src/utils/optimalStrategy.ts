import { Card, GameType } from "../types/game";
import { evaluateHand } from "./handEvaluator";

export interface HoldRecommendation {
  holdPattern: boolean[];
  expectedValue: number;
  description: string;
}

export interface StrategyResult {
  recommendations: HoldRecommendation[];
  bestHold: boolean[];
  bestExpectedValue: number;
  currentHandEV: number;
}

/**
 * Generate all 32 possible hold patterns for 5 cards
 */
function generateHoldPatterns(): boolean[][] {
  const patterns: boolean[][] = [];
  for (let i = 0; i < 32; i++) {
    const pattern: boolean[] = [];
    for (let j = 0; j < 5; j++) {
      pattern.push((i & (1 << j)) !== 0);
    }
    patterns.push(pattern);
  }
  return patterns;
}

/**
 * Generate all combinations of k items from an array
 */
function combinations<T>(array: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (array.length === 0) return [];

  const result: T[][] = [];
  const first = array[0];
  const rest = array.slice(1);

  // Combinations that include the first element
  for (const combo of combinations(rest, k - 1)) {
    result.push([first, ...combo]);
  }

  // Combinations that don't include the first element
  for (const combo of combinations(rest, k)) {
    result.push(combo);
  }

  return result;
}

/**
 * Calculate the expected value for a given hold pattern
 * Uses exact calculation by iterating through all possible draws
 */
function calculateExpectedValue(
  hand: Card[],
  deck: Card[],
  holdPattern: boolean[],
  gameType: GameType,
  wager: number
): number {
  const heldCards = hand.filter((_, i) => holdPattern[i]);
  const numToReplace = 5 - heldCards.length;

  // If holding all 5, just evaluate the current hand
  if (numToReplace === 0) {
    const { payout } = evaluateHand(hand, gameType, wager);
    return payout;
  }

  // Get all possible replacement combinations from the deck
  const replacementCombos = combinations(deck, numToReplace);
  let totalPayout = 0;

  for (const replacements of replacementCombos) {
    // Build the resulting hand
    const resultHand: Card[] = [];
    let replaceIndex = 0;

    for (let i = 0; i < 5; i++) {
      if (holdPattern[i]) {
        resultHand.push(hand[i]);
      } else {
        resultHand.push(replacements[replaceIndex++]);
      }
    }

    const { payout } = evaluateHand(resultHand, gameType, wager);
    totalPayout += payout;
  }

  // Expected value = average payout across all possible draws
  return totalPayout / replacementCombos.length;
}

/**
 * Create a human-readable description of the hold pattern
 */
function describeHoldPattern(hand: Card[], holdPattern: boolean[]): string {
  const heldCards = hand.filter((_, i) => holdPattern[i]);
  const numHeld = heldCards.length;

  if (numHeld === 0) {
    return "Discard all";
  }

  if (numHeld === 5) {
    return "Hold all";
  }

  // Format held cards nicely
  const cardNames = heldCards.map((card) => formatCard(card));
  return `Hold ${cardNames.join(", ")}`;
}

/**
 * Format a card for display (e.g., "Ah" -> "A♥")
 */
function formatCard(card: Card): string {
  if (card === "O1" || card === "O2") return "Joker";

  const rank = card.slice(0, -1);
  const suit = card.slice(-1);

  const suitSymbols: Record<string, string> = {
    h: "♥",
    d: "♦",
    c: "♣",
    s: "♠",
  };

  return `${rank}${suitSymbols[suit] || suit}`;
}

/**
 * Calculate the optimal strategy for a given hand
 * Returns all 32 hold patterns ranked by expected value
 */
export function calculateOptimalStrategy(
  hand: Card[],
  deck: Card[],
  gameType: GameType,
  wager: number
): StrategyResult {
  const holdPatterns = generateHoldPatterns();
  const recommendations: HoldRecommendation[] = [];

  for (const pattern of holdPatterns) {
    const ev = calculateExpectedValue(hand, deck, pattern, gameType, wager);
    recommendations.push({
      holdPattern: pattern,
      expectedValue: ev,
      description: describeHoldPattern(hand, pattern),
    });
  }

  // Sort by expected value (highest first)
  recommendations.sort((a, b) => b.expectedValue - a.expectedValue);

  // Current hand EV (holding all 5)
  const currentHandEV = recommendations.find((r) =>
    r.holdPattern.every((h) => h)
  )!.expectedValue;

  return {
    recommendations,
    bestHold: recommendations[0].holdPattern,
    bestExpectedValue: recommendations[0].expectedValue,
    currentHandEV,
  };
}

/**
 * Get a simplified recommendation for the UI
 * Returns the optimal hold pattern and a summary
 */
export function getOptimalHold(
  hand: Card[],
  deck: Card[],
  gameType: GameType,
  wager: number
): {
  optimalHold: boolean[];
  expectedValue: number;
  description: string;
  improvement: number;
} {
  const result = calculateOptimalStrategy(hand, deck, gameType, wager);
  const best = result.recommendations[0];

  // Calculate improvement over holding all cards
  const holdAllEV = result.currentHandEV;
  const improvement = best.expectedValue - holdAllEV;

  return {
    optimalHold: best.holdPattern,
    expectedValue: best.expectedValue,
    description: best.description,
    improvement,
  };
}

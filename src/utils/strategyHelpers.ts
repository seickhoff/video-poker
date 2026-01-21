/**
 * Shared helper functions for video poker strategy calculations
 */

import { Card } from "../types/game";

export interface StrategyResult {
  holdPattern: boolean[];
  description: string;
  rule: string;
}

export interface HandAnalysisResult {
  rankCounts: Map<string, number>;
  suitCounts: Map<string, number>;
  pairs: string[];
  trips: string[];
  quads: string[];
  hasFlush: boolean;
  hasStraight: boolean;
  isRoyal: boolean;
  royalCards: number[];
  flushDrawCards: number[];
  openEndedCards: number[];
  insideCards: number[];
  highCards: number[];
  deucesIndices: number[];
  jokerIndices: number[];
  nonWildCards: Card[];
  nonWildIndices: number[];
}

// Helper to get card rank
export function getRank(card: Card): string {
  if (card === "O1" || card === "O2") return "O";
  return card.slice(0, -1);
}

// Helper to get card suit
export function getSuit(card: Card): string {
  if (card === "O1" || card === "O2") return "";
  return card.slice(-1);
}

// Helper to get card value (A=14, K=13, Q=12, J=11, etc.)
export function getValue(card: Card): number {
  const rank = getRank(card);
  const values: Record<string, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    "10": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
  };
  return values[rank] || 0;
}

// Check if card is a high card (J, Q, K, A)
export function isHighCard(card: Card): boolean {
  const v = getValue(card);
  return v >= 11;
}

// Check if card is a high card for Tens or Better (10, J, Q, K, A)
export function isTenOrHigher(card: Card): boolean {
  const v = getValue(card);
  return v >= 10;
}

// Check if card is Kings or Better (K, A)
export function isKingOrAce(card: Card): boolean {
  const v = getValue(card);
  return v >= 13;
}

// Count cards by rank
export function countRanks(hand: Card[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const card of hand) {
    const rank = getRank(card);
    counts.set(rank, (counts.get(rank) || 0) + 1);
  }
  return counts;
}

// Count cards by suit
export function countSuits(hand: Card[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const card of hand) {
    const suit = getSuit(card);
    if (suit) counts.set(suit, (counts.get(suit) || 0) + 1);
  }
  return counts;
}

// Get indices of cards with specific rank
export function getIndicesOfRank(hand: Card[], rank: string): number[] {
  return hand
    .map((c, i) => (getRank(c) === rank ? i : -1))
    .filter((i) => i >= 0);
}

// Get indices of cards with specific suit
export function getIndicesOfSuit(hand: Card[], suit: string): number[] {
  return hand
    .map((c, i) => (getSuit(c) === suit ? i : -1))
    .filter((i) => i >= 0);
}

// Check for flush (5 cards same suit, accounting for wilds)
export function isFlush(hand: Card[], wildCount: number = 0): boolean {
  const suits = countSuits(hand);
  const maxSuited = Math.max(...suits.values(), 0);
  return maxSuited + wildCount >= 5;
}

// Check for straight (5 consecutive values, accounting for wilds)
export function isStraight(hand: Card[], wildCount: number = 0): boolean {
  const nonWild = hand.filter((c) => getRank(c) !== "2" && getRank(c) !== "O");
  const values = nonWild.map(getValue).sort((a, b) => a - b);
  const unique = [...new Set(values)];

  if (unique.length + wildCount < 5) return false;

  // Check various straight possibilities
  for (let high = 14; high >= 5; high--) {
    const low = high - 4;
    let needed = 0;
    const covered = new Set<number>();

    for (const v of unique) {
      if (v >= low && v <= high) covered.add(v);
      // Ace can be low
      if (low === 1 && v === 14) covered.add(1);
    }

    needed = 5 - covered.size;
    if (needed <= wildCount) return true;
  }

  return false;
}

// Check for royal flush cards (10, J, Q, K, A of same suit)
export function getRoyalCards(hand: Card[]): number[] {
  const royalRanks = ["10", "J", "Q", "K", "A"];
  const suitCounts = countSuits(hand);

  for (const [suit, count] of suitCounts) {
    if (count >= 3) {
      const indices = hand
        .map((c, i) => {
          return getSuit(c) === suit && royalRanks.includes(getRank(c))
            ? i
            : -1;
        })
        .filter((i) => i >= 0);

      if (indices.length >= 3) return indices;
    }
  }
  return [];
}

// Get flush draw cards (4 cards of same suit)
export function getFlushDrawCards(hand: Card[]): number[] {
  const suitCounts = countSuits(hand);
  for (const [suit, count] of suitCounts) {
    if (count === 4) {
      return getIndicesOfSuit(hand, suit);
    }
  }
  return [];
}

// Get 3 to flush cards
export function getThreeToFlush(hand: Card[]): number[] {
  const suitCounts = countSuits(hand);
  for (const [suit, count] of suitCounts) {
    if (count === 3) {
      return getIndicesOfSuit(hand, suit);
    }
  }
  return [];
}

// Get open-ended straight draw (4 consecutive, can complete on either end)
export function getOpenEndedStraightDraw(hand: Card[]): number[] {
  const cards = hand.map((c, i) => ({ value: getValue(c), index: i }));
  cards.sort((a, b) => a.value - b.value);

  for (let i = 0; i <= 1; i++) {
    const slice = cards.slice(i, i + 4);
    const values = slice.map((c) => c.value);
    const unique = [...new Set(values)];

    if (unique.length === 4) {
      const min = Math.min(...unique);
      const max = Math.max(...unique);

      if (max - min === 3) {
        if (min > 2 && max < 14) {
          return slice.map((c) => c.index);
        }
        if (min === 2 && max === 5) {
          return slice.map((c) => c.index);
        }
      }
    }
  }

  return [];
}

// Get inside straight draw (4 to a straight with one gap)
export function getInsideStraightDraw(hand: Card[]): number[] {
  const cards = hand.map((c, i) => ({ value: getValue(c), index: i }));

  for (let high = 14; high >= 5; high--) {
    const low = high - 4;

    const matching: typeof cards = [];
    for (const card of cards) {
      let v = card.value;
      if (low === 1 && v === 14) v = 1;
      if (v >= low && v <= high) {
        matching.push(card);
      }
    }

    const uniqueMatching = [...new Set(matching.map((c) => c.value))];
    if (uniqueMatching.length === 4 && matching.length === 4) {
      return matching.map((c) => c.index);
    }
  }

  return [];
}

// Get high cards (J, Q, K, A)
export function getHighCardIndices(hand: Card[]): number[] {
  return hand.map((c, i) => (isHighCard(c) ? i : -1)).filter((i) => i >= 0);
}

// Get tens or higher indices
export function getTenOrHigherIndices(hand: Card[]): number[] {
  return hand.map((c, i) => (isTenOrHigher(c) ? i : -1)).filter((i) => i >= 0);
}

// Get kings or aces indices
export function getKingOrAceIndices(hand: Card[]): number[] {
  return hand.map((c, i) => (isKingOrAce(c) ? i : -1)).filter((i) => i >= 0);
}

// Create hold pattern from indices
export function indicesToPattern(indices: number[]): boolean[] {
  const pattern = [false, false, false, false, false];
  for (const i of indices) {
    if (i >= 0 && i < 5) pattern[i] = true;
  }
  return pattern;
}

// Format cards for description
export function formatCards(hand: Card[], indices: number[]): string {
  const suitSymbols: Record<string, string> = {
    h: "♥",
    d: "♦",
    c: "♣",
    s: "♠",
  };
  return indices
    .map((i) => {
      if (hand[i] === "O1" || hand[i] === "O2") return "Joker";
      const rank = getRank(hand[i]);
      const suit = getSuit(hand[i]);
      return `${rank}${suitSymbols[suit] || suit}`;
    })
    .join(", ");
}

// Get indices of deuces (2s) for Deuces Wild
export function getDeucesIndices(hand: Card[]): number[] {
  return hand
    .map((c, i) => (getRank(c) === "2" ? i : -1))
    .filter((i) => i >= 0);
}

// Get indices of jokers
export function getJokerIndices(hand: Card[]): number[] {
  return hand
    .map((c, i) => (c === "O1" || c === "O2" ? i : -1))
    .filter((i) => i >= 0);
}

// Analyze a hand and return all useful information
export function analyzeHand(
  hand: Card[],
  treatDeucesAsWild: boolean = false
): HandAnalysisResult {
  const deucesIndices = treatDeucesAsWild ? getDeucesIndices(hand) : [];
  const jokerIndices = getJokerIndices(hand);
  const wildIndices = [...deucesIndices, ...jokerIndices];

  const nonWildIndices = hand
    .map((_, i) => i)
    .filter((i) => !wildIndices.includes(i));
  const nonWildCards = nonWildIndices.map((i) => hand[i]);

  const rankCounts = countRanks(hand);
  const suitCounts = countSuits(hand);

  const pairs: string[] = [];
  const trips: string[] = [];
  const quads: string[] = [];

  for (const [rank, count] of rankCounts) {
    if (rank === "2" && treatDeucesAsWild) continue;
    if (rank === "O") continue;
    if (count === 2) pairs.push(rank);
    if (count === 3) trips.push(rank);
    if (count === 4) quads.push(rank);
  }

  const wildCount = wildIndices.length;
  const hasFlush = isFlush(hand, wildCount);
  const hasStraight = isStraight(hand, wildCount);

  const isRoyal =
    hasFlush &&
    hasStraight &&
    nonWildCards.every((c) => ["10", "J", "Q", "K", "A"].includes(getRank(c)));

  return {
    rankCounts,
    suitCounts,
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards: getRoyalCards(hand),
    flushDrawCards: getFlushDrawCards(hand),
    openEndedCards: getOpenEndedStraightDraw(hand),
    insideCards: getInsideStraightDraw(hand),
    highCards: getHighCardIndices(hand),
    deucesIndices,
    jokerIndices,
    nonWildCards,
    nonWildIndices,
  };
}

// Check if quad rank matches specific ranks
export function isQuadRank(rank: string, targetRanks: string[]): boolean {
  return targetRanks.includes(rank);
}

// Get kicker for four of a kind
export function getKicker(hand: Card[], quadRank: string): string | null {
  for (const card of hand) {
    const r = getRank(card);
    if (r !== quadRank && r !== "O") return r;
  }
  return null;
}

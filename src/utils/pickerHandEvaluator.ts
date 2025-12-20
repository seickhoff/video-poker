import { Card } from "../types/game";
import { getCardValue, getCardRank, getCardSuit } from "./deck";

export type PokerHandCategory =
  | "Five of a Kind"
  | "Straight Flush"
  | "Four of a Kind"
  | "Full House"
  | "Flush"
  | "Straight"
  | "Three of a Kind"
  | "Two Pair"
  | "One Pair"
  | "High Card";

export interface PokerHandEvaluation {
  category: PokerHandCategory;
  displayName: string;
  rankValues: number[]; // For tie-breaking
}

function isJoker(card: Card): boolean {
  return card === "O1" || card === "O2";
}

interface HandAnalysis {
  ranks: string[];
  suits: string[];
  values: number[];
  rankCounts: Map<string, number>;
  isFlush: boolean;
  isStraight: boolean;
  straightHighCard: number;
}

function analyzePokerHand(hand: Card[]): HandAnalysis {
  const ranks = hand.map(getCardRank);
  const suits = hand.map(getCardSuit);
  const values = hand.map(getCardValue);

  // Count rank occurrences
  const rankCounts = new Map<string, number>();
  ranks.forEach((rank) => {
    rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1);
  });

  // Check for flush
  const isFlush = suits.every((suit) => suit === suits[0]);

  // Check for straight
  const sortedValues = [...values].sort((a, b) => b - a);
  let isStraight = false;
  let straightHighCard = 0;

  // Check regular straight
  let isConsecutive = true;
  for (let i = 0; i < sortedValues.length - 1; i++) {
    if (sortedValues[i] - sortedValues[i + 1] !== 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive) {
    isStraight = true;
    straightHighCard = sortedValues[0];
  }

  // Check for Ace-low straight (A-2-3-4-5)
  if (
    !isStraight &&
    sortedValues[0] === 14 && // Ace
    sortedValues[1] === 5 &&
    sortedValues[2] === 4 &&
    sortedValues[3] === 3 &&
    sortedValues[4] === 2
  ) {
    isStraight = true;
    straightHighCard = 5; // Ace-low straight has high card of 5
  }

  return {
    ranks,
    suits,
    values,
    rankCounts,
    isFlush,
    isStraight,
    straightHighCard,
  };
}

function getHighCardValue(rank: string): number {
  return getCardValue(`${rank}h` as Card);
}

function evaluateBestHandWithJokers(
  regularCards: Card[],
  jokerCount: number
): PokerHandEvaluation {
  // Strategy: use jokers optimally
  // 1. Check for 5 jokers (Royal Flush - highest possible hand)
  // 2. Check for five of a kind (4 of same rank + 1 joker, or 3 of same + 2 jokers, etc.)
  // 3. Check for straight flush possibilities
  // 4. Check for four of a kind
  // 5. Check for full house
  // 6. etc.

  // Special case: 5 jokers = Five of a Kind (highest possible hand)
  if (jokerCount === 5) {
    return {
      category: "Five of a Kind",
      displayName: "Five of a Kind (Jokers)",
      rankValues: [15], // Highest possible rank value (higher than Aces)
    };
  }

  const analysis = analyzePokerHand(regularCards);
  const countEntries = Array.from(analysis.rankCounts.entries()).sort(
    (a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return getHighCardValue(b[0]) - getHighCardValue(a[0]);
    }
  );

  const counts = countEntries.map((e) => e[1]);
  const ranksOrdered = countEntries.map((e) => e[0]);

  // Five of a Kind (4 matching + 1 joker, or 3 matching + 2 jokers)
  if (
    (counts[0] === 4 && jokerCount >= 1) ||
    (counts[0] === 3 && jokerCount >= 2) ||
    (counts[0] === 2 && jokerCount >= 3) ||
    (counts[0] === 1 && jokerCount >= 4)
  ) {
    const rank = ranksOrdered[0];
    return {
      category: "Five of a Kind",
      displayName: `Five of a Kind (${rank}s)`,
      rankValues: [getHighCardValue(rank)],
    };
  }

  // Straight Flush - check if jokers can complete it
  const canMakeStraightFlush = checkStraightFlushWithJokers(
    regularCards,
    jokerCount
  );
  if (canMakeStraightFlush) {
    return canMakeStraightFlush;
  }

  // Four of a Kind (3 matching + 1 joker, or 2 matching + 2 jokers, or 1 + 3 jokers)
  if (
    (counts[0] === 3 && jokerCount >= 1) ||
    (counts[0] === 2 && jokerCount >= 2) ||
    (counts[0] === 1 && jokerCount >= 3)
  ) {
    const rank = ranksOrdered[0];
    const kickerRank = ranksOrdered[1] || "A";
    return {
      category: "Four of a Kind",
      displayName: `Four of a Kind (${rank}s)`,
      rankValues: [getHighCardValue(rank), getHighCardValue(kickerRank)],
    };
  }

  // Full House (pair + triple, use jokers to make this)
  if (counts[0] === 2 && counts[1] === 2 && jokerCount >= 1) {
    const tripRank = ranksOrdered[0];
    const pairRank = ranksOrdered[1];
    return {
      category: "Full House",
      displayName: `Full House (${tripRank}s over ${pairRank}s)`,
      rankValues: [getHighCardValue(tripRank), getHighCardValue(pairRank)],
    };
  }
  if (counts[0] === 2 && counts[1] === 1 && jokerCount >= 2) {
    const tripRank = ranksOrdered[0];
    const pairRank = ranksOrdered[1];
    return {
      category: "Full House",
      displayName: `Full House (${tripRank}s over ${pairRank}s)`,
      rankValues: [getHighCardValue(tripRank), getHighCardValue(pairRank)],
    };
  }

  // Flush - jokers can always match any suit
  const flushResult = checkFlushWithJokers(regularCards, jokerCount);
  if (flushResult) {
    return flushResult;
  }

  // Straight - check if jokers can complete it
  const straightResult = checkStraightWithJokers(regularCards, jokerCount);
  if (straightResult) {
    return straightResult;
  }

  // Three of a Kind (pair + 1 joker, or 1 card + 2 jokers)
  if (
    (counts[0] === 2 && jokerCount >= 1) ||
    (counts[0] === 1 && jokerCount >= 2)
  ) {
    const tripRank = ranksOrdered[0];
    const kickers = ranksOrdered.slice(1).slice(0, 2);
    return {
      category: "Three of a Kind",
      displayName: `Three of a Kind (${tripRank}s) ${kickers.join("-")}`,
      rankValues: [
        getHighCardValue(tripRank),
        ...kickers.map(getHighCardValue),
      ],
    };
  }

  // Two Pair (one pair + 1 joker makes two pair)
  if (counts[0] === 2 && jokerCount >= 1) {
    const highPair = ranksOrdered[0];
    const lowPairRank = ranksOrdered[1] || "A";
    const kicker = ranksOrdered[2] || ranksOrdered[1] || "K";
    return {
      category: "Two Pair",
      displayName: `Two Pair (${highPair}s and ${lowPairRank}s) ${kicker}`,
      rankValues: [
        getHighCardValue(highPair),
        getHighCardValue(lowPairRank),
        getHighCardValue(kicker),
      ],
    };
  }

  // One Pair (1 joker guarantees at least a pair)
  if (jokerCount >= 1) {
    const pairRank = ranksOrdered[0];
    const kickers = ranksOrdered.slice(1).slice(0, 3);
    return {
      category: "One Pair",
      displayName: `One Pair (${pairRank}s) ${kickers.join("-")}`,
      rankValues: [
        getHighCardValue(pairRank),
        ...kickers.map(getHighCardValue),
      ],
    };
  }

  // Shouldn't reach here, but return high card as fallback
  const sortedValues = [...analysis.values].sort((a, b) => b - a);
  const sortedRanks = sortedValues.map((val) => {
    return analysis.ranks[analysis.values.indexOf(val)];
  });
  return {
    category: "High Card",
    displayName: `High Card (${sortedRanks.join("-")})`,
    rankValues: sortedValues,
  };
}

function checkStraightFlushWithJokers(
  regularCards: Card[],
  jokerCount: number
): PokerHandEvaluation | null {
  // For simplicity, check if we can make a flush AND a straight
  const flushCheck = checkFlushWithJokers(regularCards, jokerCount);
  const straightCheck = checkStraightWithJokers(regularCards, jokerCount);

  if (flushCheck && straightCheck) {
    // Get the high card value from the straight's rank values
    const highValue = straightCheck.rankValues[0];
    const highRank =
      highValue === 14 ? "A" : highValue === 5 ? "5" : highValue.toString();
    const isRoyalFlush =
      highValue === 14 && regularCards.some((c) => getCardValue(c) === 14);

    return {
      category: "Straight Flush",
      displayName: isRoyalFlush
        ? "Royal Flush"
        : `Straight Flush (${highRank} high)`,
      rankValues: straightCheck.rankValues,
    };
  }
  return null;
}

function checkFlushWithJokers(
  regularCards: Card[],
  jokerCount: number
): PokerHandEvaluation | null {
  if (regularCards.length === 0) return null;

  // Count suits
  const suitCounts = new Map<string, number>();
  regularCards.forEach((card) => {
    const suit = getCardSuit(card);
    suitCounts.set(suit, (suitCounts.get(suit) || 0) + 1);
  });

  const maxSuitCount = Math.max(...Array.from(suitCounts.values()));

  // If we have enough cards of one suit + jokers to make 5
  if (maxSuitCount + jokerCount >= 5) {
    const values = regularCards.map(getCardValue).sort((a, b) => b - a);
    const ranks = values.map((val) => {
      const card = regularCards.find((c) => getCardValue(c) === val);
      return card ? getCardRank(card) : "A";
    });
    return {
      category: "Flush",
      displayName: `Flush (${ranks.join("-")})`,
      rankValues: values,
    };
  }

  return null;
}

function checkStraightWithJokers(
  regularCards: Card[],
  jokerCount: number
): PokerHandEvaluation | null {
  if (regularCards.length === 0) return null;

  const values = regularCards.map(getCardValue).sort((a, b) => b - a);
  const uniqueValues = [...new Set(values)];

  // Try to find a straight that jokers can complete
  // Check all possible 5-card straights
  for (let high = 14; high >= 5; high--) {
    const neededValues = [];
    for (let i = 0; i < 5; i++) {
      let val = high - i;
      // Handle ace-low straight
      if (high === 5 && val === 1) val = 14;
      neededValues.push(val);
    }

    const missing = neededValues.filter(
      (v) => !uniqueValues.includes(v)
    ).length;

    if (missing <= jokerCount) {
      const highRank = high === 14 ? "A" : high === 5 ? "5" : high.toString();
      return {
        category: "Straight",
        displayName: `Straight (${highRank} high)`,
        rankValues: [high],
      };
    }
  }

  return null;
}

export function evaluatePokerHand(hand: Card[]): PokerHandEvaluation {
  // Count jokers and separate them from regular cards
  const jokers = hand.filter(isJoker);
  const regularCards = hand.filter((card) => !isJoker(card));
  const jokerCount = jokers.length;

  // If no jokers, use normal evaluation
  if (jokerCount === 0) {
    return evaluatePokerHandNoWild(hand);
  }

  // With jokers, find the best possible hand
  return evaluateBestHandWithJokers(regularCards, jokerCount);
}

function evaluatePokerHandNoWild(hand: Card[]): PokerHandEvaluation {
  const analysis = analyzePokerHand(hand);

  // Get counts sorted by frequency, then by rank value
  const countEntries = Array.from(analysis.rankCounts.entries()).sort(
    (a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // Sort by count descending
      return getHighCardValue(b[0]) - getHighCardValue(a[0]); // Then by rank descending
    }
  );

  const counts = countEntries.map((e) => e[1]);
  const ranksOrdered = countEntries.map((e) => e[0]);

  // Straight Flush (including Royal Flush)
  if (analysis.isStraight && analysis.isFlush) {
    const displayName =
      analysis.straightHighCard === 14
        ? "Royal Flush"
        : `Straight Flush (${ranksOrdered[0]} high)`;
    return {
      category: "Straight Flush",
      displayName,
      rankValues: [analysis.straightHighCard],
    };
  }

  // Four of a Kind
  if (counts[0] === 4) {
    const quadRank = ranksOrdered[0];
    const kicker = ranksOrdered[1];
    return {
      category: "Four of a Kind",
      displayName: `Four of a Kind (${quadRank}s)`,
      rankValues: [getHighCardValue(quadRank), getHighCardValue(kicker)],
    };
  }

  // Full House
  if (counts[0] === 3 && counts[1] === 2) {
    const tripRank = ranksOrdered[0];
    const pairRank = ranksOrdered[1];
    return {
      category: "Full House",
      displayName: `Full House (${tripRank}s over ${pairRank}s)`,
      rankValues: [getHighCardValue(tripRank), getHighCardValue(pairRank)],
    };
  }

  // Flush
  if (analysis.isFlush) {
    const sortedValues = [...analysis.values].sort((a, b) => b - a);
    const sortedRanks = sortedValues.map((val) => {
      return analysis.ranks[analysis.values.indexOf(val)];
    });
    return {
      category: "Flush",
      displayName: `Flush (${sortedRanks.join("-")})`,
      rankValues: sortedValues,
    };
  }

  // Straight
  if (analysis.isStraight) {
    const highRank =
      analysis.straightHighCard === 5
        ? "5"
        : analysis.ranks[analysis.values.indexOf(analysis.straightHighCard)];
    return {
      category: "Straight",
      displayName: `Straight (${highRank} high)`,
      rankValues: [analysis.straightHighCard],
    };
  }

  // Three of a Kind
  if (counts[0] === 3) {
    const tripRank = ranksOrdered[0];
    const kickerRanks = ranksOrdered.slice(1);
    const kickers = kickerRanks.map(getHighCardValue);
    return {
      category: "Three of a Kind",
      displayName: `Three of a Kind (${tripRank}s) ${kickerRanks.join("-")}`,
      rankValues: [getHighCardValue(tripRank), ...kickers],
    };
  }

  // Two Pair
  if (counts[0] === 2 && counts[1] === 2) {
    const highPair = ranksOrdered[0];
    const lowPair = ranksOrdered[1];
    const kicker = ranksOrdered[2];
    return {
      category: "Two Pair",
      displayName: `Two Pair (${highPair}s and ${lowPair}s) ${kicker}`,
      rankValues: [
        getHighCardValue(highPair),
        getHighCardValue(lowPair),
        getHighCardValue(kicker),
      ],
    };
  }

  // One Pair
  if (counts[0] === 2) {
    const pairRank = ranksOrdered[0];
    const kickerRanks = ranksOrdered.slice(1);
    const kickers = kickerRanks.map(getHighCardValue);
    return {
      category: "One Pair",
      displayName: `One Pair (${pairRank}s) ${kickerRanks.join("-")}`,
      rankValues: [getHighCardValue(pairRank), ...kickers],
    };
  }

  // High Card
  const sortedValues = [...analysis.values].sort((a, b) => b - a);
  const sortedRanks = sortedValues.map((val) => {
    return analysis.ranks[analysis.values.indexOf(val)];
  });
  return {
    category: "High Card",
    displayName: `High Card (${sortedRanks.join("-")})`,
    rankValues: sortedValues,
  };
}

export function comparePokerHands(
  hand1: PokerHandEvaluation,
  hand2: PokerHandEvaluation
): number {
  const categoryRanking: PokerHandCategory[] = [
    "High Card",
    "One Pair",
    "Two Pair",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush",
    "Five of a Kind",
  ];

  const rank1 = categoryRanking.indexOf(hand1.category);
  const rank2 = categoryRanking.indexOf(hand2.category);

  if (rank1 !== rank2) {
    return rank1 - rank2; // Higher rank wins
  }

  // Same category, compare rank values
  for (
    let i = 0;
    i < Math.max(hand1.rankValues.length, hand2.rankValues.length);
    i++
  ) {
    const val1 = hand1.rankValues[i] || 0;
    const val2 = hand2.rankValues[i] || 0;
    if (val1 !== val2) {
      return val1 - val2;
    }
  }

  return 0; // True tie
}

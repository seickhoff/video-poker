import { Card } from "../types/game";

/**
 * Jacks or Better Optimal Strategy (9/6 Full Pay)
 *
 * This implements the mathematically optimal strategy using pattern-based rules.
 * Rules are ordered by expected value - first matching rule wins.
 *
 * Based on the canonical Jacks or Better strategy chart.
 */

interface StrategyResult {
  holdPattern: boolean[];
  description: string;
  rule: string;
}

// Helper to get card rank
function getRank(card: Card): string {
  if (card === "O1" || card === "O2") return "O";
  return card.slice(0, -1);
}

// Helper to get card suit
function getSuit(card: Card): string {
  if (card === "O1" || card === "O2") return "";
  return card.slice(-1);
}

// Helper to get card value (A=14, K=13, Q=12, J=11, etc.)
function getValue(card: Card): number {
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
function isHighCard(card: Card): boolean {
  const v = getValue(card);
  return v >= 11;
}

// Count cards by rank
function countRanks(hand: Card[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const card of hand) {
    const rank = getRank(card);
    counts.set(rank, (counts.get(rank) || 0) + 1);
  }
  return counts;
}

// Count cards by suit
function countSuits(hand: Card[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const card of hand) {
    const suit = getSuit(card);
    counts.set(suit, (counts.get(suit) || 0) + 1);
  }
  return counts;
}

// Get indices of cards with specific rank
function getIndicesOfRank(hand: Card[], rank: string): number[] {
  return hand
    .map((c, i) => (getRank(c) === rank ? i : -1))
    .filter((i) => i >= 0);
}

// Get indices of cards with specific suit
function getIndicesOfSuit(hand: Card[], suit: string): number[] {
  return hand
    .map((c, i) => (getSuit(c) === suit ? i : -1))
    .filter((i) => i >= 0);
}

// Check for flush (5 cards same suit)
function isFlush(hand: Card[]): boolean {
  const suits = countSuits(hand);
  return [...suits.values()].some((c) => c === 5);
}

// Check for straight (5 consecutive values)
function isStraight(hand: Card[]): boolean {
  const values = hand.map(getValue).sort((a, b) => a - b);
  const unique = [...new Set(values)];
  if (unique.length !== 5) return false;

  // Regular straight
  if (unique[4] - unique[0] === 4) return true;

  // Ace-low straight (A2345)
  if (
    unique[0] === 2 &&
    unique[1] === 3 &&
    unique[2] === 4 &&
    unique[3] === 5 &&
    unique[4] === 14
  )
    return true;

  return false;
}

// Check for royal flush cards (10, J, Q, K, A of same suit)
function getRoyalCards(hand: Card[]): number[] {
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
function getFlushDrawCards(hand: Card[]): number[] {
  const suitCounts = countSuits(hand);
  for (const [suit, count] of suitCounts) {
    if (count === 4) {
      return getIndicesOfSuit(hand, suit);
    }
  }
  return [];
}

// Get open-ended straight draw (4 consecutive, can complete on either end)
function getOpenEndedStraightDraw(hand: Card[]): number[] {
  const cards = hand.map((c, i) => ({ value: getValue(c), index: i }));
  cards.sort((a, b) => a.value - b.value);

  // Look for 4 consecutive cards that aren't at the edges (2-3-4-5 or J-Q-K-A)
  for (let i = 0; i <= 1; i++) {
    const slice = cards.slice(i, i + 4);
    const values = slice.map((c) => c.value);
    const unique = [...new Set(values)];

    if (unique.length === 4) {
      const min = Math.min(...unique);
      const max = Math.max(...unique);

      // Check if consecutive
      if (max - min === 3) {
        // Open-ended means not at edges (not starting at 2 or ending at A)
        if (min > 2 && max < 14) {
          return slice.map((c) => c.index);
        }
        // Also A-2-3-4 is open-ended (can get 5)
        if (min === 2 && max === 5) {
          return slice.map((c) => c.index);
        }
      }
    }
  }

  return [];
}

// Get inside straight draw (4 to a straight with one gap)
function getInsideStraightDraw(hand: Card[]): number[] {
  const cards = hand.map((c, i) => ({ value: getValue(c), index: i }));

  // Check for 4 cards within a 5-card span with one gap
  for (let high = 14; high >= 5; high--) {
    const low = high - 4;

    let matching: typeof cards = [];
    for (const card of cards) {
      let v = card.value;
      // Handle ace low
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
function getHighCardIndices(hand: Card[]): number[] {
  return hand.map((c, i) => (isHighCard(c) ? i : -1)).filter((i) => i >= 0);
}

// Create hold pattern from indices
function indicesToPattern(indices: number[]): boolean[] {
  const pattern = [false, false, false, false, false];
  for (const i of indices) {
    pattern[i] = true;
  }
  return pattern;
}

// Format cards for description
function formatCards(hand: Card[], indices: number[]): string {
  const suitSymbols: Record<string, string> = {
    h: "♥",
    d: "♦",
    c: "♣",
    s: "♠",
  };
  return indices
    .map((i) => {
      const rank = getRank(hand[i]);
      const suit = getSuit(hand[i]);
      return `${rank}${suitSymbols[suit] || suit}`;
    })
    .join(", ");
}

/**
 * Get the optimal play for a Jacks or Better hand using strategy rules
 */
export function getJacksOrBetterStrategy(hand: Card[]): StrategyResult {
  const rankCounts = countRanks(hand);
  const suitCounts = countSuits(hand);

  // Count pairs, trips, quads
  let pairs: string[] = [];
  let trips: string[] = [];
  let quads: string[] = [];

  for (const [rank, count] of rankCounts) {
    if (count === 2) pairs.push(rank);
    if (count === 3) trips.push(rank);
    if (count === 4) quads.push(rank);
  }

  const hasFlush = isFlush(hand);
  const hasStraight = isStraight(hand);
  const royalCards = getRoyalCards(hand);
  const flushDrawCards = getFlushDrawCards(hand);
  const openEndedCards = getOpenEndedStraightDraw(hand);
  const insideCards = getInsideStraightDraw(hand);
  const highCards = getHighCardIndices(hand);

  // Check for royal flush
  const isRoyal =
    hasFlush &&
    hasStraight &&
    hand.every((c) => ["10", "J", "Q", "K", "A"].includes(getRank(c)));

  // ===========================================
  // STRATEGY RULES (in order of expected value)
  // ===========================================

  // 1. Royal Flush - hold all
  if (isRoyal) {
    return {
      holdPattern: [true, true, true, true, true],
      description: "Royal Flush!",
      rule: "royal_flush",
    };
  }

  // 2. Straight Flush - hold all
  if (hasFlush && hasStraight) {
    return {
      holdPattern: [true, true, true, true, true],
      description: "Straight Flush!",
      rule: "straight_flush",
    };
  }

  // 3. Four of a Kind - hold the quads
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    return {
      holdPattern: indicesToPattern(indices),
      description: `Four ${quads[0]}s`,
      rule: "four_of_a_kind",
    };
  }

  // 4. Four to a Royal Flush - hold 4
  if (royalCards.length === 4) {
    return {
      holdPattern: indicesToPattern(royalCards),
      description: `4 to Royal: ${formatCards(hand, royalCards)}`,
      rule: "four_to_royal",
    };
  }

  // 5. Full House - hold all
  if (trips.length === 1 && pairs.length === 1) {
    return {
      holdPattern: [true, true, true, true, true],
      description: "Full House",
      rule: "full_house",
    };
  }

  // 6. Flush - hold all
  if (hasFlush) {
    return {
      holdPattern: [true, true, true, true, true],
      description: "Flush",
      rule: "flush",
    };
  }

  // 7. Straight - hold all
  if (hasStraight) {
    return {
      holdPattern: [true, true, true, true, true],
      description: "Straight",
      rule: "straight",
    };
  }

  // 8. Three of a Kind - hold the trips
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return {
      holdPattern: indicesToPattern(indices),
      description: `Three ${trips[0]}s`,
      rule: "three_of_a_kind",
    };
  }

  // 9. Four to a Straight Flush (open-ended)
  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    const isConsecutive = flushValues[3] - flushValues[0] <= 4;

    if (isConsecutive) {
      return {
        holdPattern: indicesToPattern(flushDrawCards),
        description: `4 to Straight Flush: ${formatCards(hand, flushDrawCards)}`,
        rule: "four_to_straight_flush",
      };
    }
  }

  // 10. Two Pair - hold both pairs
  if (pairs.length === 2) {
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return {
      holdPattern: indicesToPattern(indices),
      description: `Two Pair: ${pairs[0]}s and ${pairs[1]}s`,
      rule: "two_pair",
    };
  }

  // 11. High Pair (Jacks or Better) - hold the pair
  if (pairs.length === 1 && ["J", "Q", "K", "A"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return {
      holdPattern: indicesToPattern(indices),
      description: `Pair of ${pairs[0]}s`,
      rule: "high_pair",
    };
  }

  // 12. Three to a Royal Flush
  if (royalCards.length === 3) {
    return {
      holdPattern: indicesToPattern(royalCards),
      description: `3 to Royal: ${formatCards(hand, royalCards)}`,
      rule: "three_to_royal",
    };
  }

  // 13. Four to a Flush
  if (flushDrawCards.length === 4) {
    return {
      holdPattern: indicesToPattern(flushDrawCards),
      description: `4 to Flush: ${formatCards(hand, flushDrawCards)}`,
      rule: "four_to_flush",
    };
  }

  // 14. Low Pair (2-10) - hold the pair
  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return {
      holdPattern: indicesToPattern(indices),
      description: `Low Pair: ${pairs[0]}s`,
      rule: "low_pair",
    };
  }

  // 15. Four to an Open-Ended Straight
  if (openEndedCards.length === 4) {
    return {
      holdPattern: indicesToPattern(openEndedCards),
      description: `Open Straight Draw: ${formatCards(hand, openEndedCards)}`,
      rule: "four_to_open_straight",
    };
  }

  // 16. Two suited high cards
  for (const [suit, count] of suitCounts) {
    if (count >= 2) {
      const suitedHighCards = hand
        .map((c, i) => ({ card: c, index: i }))
        .filter(({ card }) => getSuit(card) === suit && isHighCard(card));

      if (suitedHighCards.length >= 2) {
        const indices = suitedHighCards.slice(0, 2).map((x) => x.index);
        return {
          holdPattern: indicesToPattern(indices),
          description: `Suited High Cards: ${formatCards(hand, indices)}`,
          rule: "two_suited_high",
        };
      }
    }
  }

  // 17. Three to a Straight Flush (with no gaps or one gap)
  for (const [suit, count] of suitCounts) {
    if (count >= 3) {
      const suitedCards = hand
        .map((c, i) => ({ value: getValue(c), index: i, suit: getSuit(c) }))
        .filter((x) => x.suit === suit)
        .sort((a, b) => a.value - b.value);

      if (suitedCards.length >= 3) {
        // Check if they form a potential straight flush draw
        const values = suitedCards.map((x) => x.value);
        const span = values[values.length - 1] - values[0];

        if (span <= 4) {
          const indices = suitedCards.slice(0, 3).map((x) => x.index);
          return {
            holdPattern: indicesToPattern(indices),
            description: `3 to Straight Flush: ${formatCards(hand, indices)}`,
            rule: "three_to_straight_flush",
          };
        }
      }
    }
  }

  // 18. Four to an Inside Straight with 3+ high cards
  if (insideCards.length === 4) {
    const insideHighCount = insideCards.filter((i) =>
      isHighCard(hand[i])
    ).length;
    if (insideHighCount >= 3) {
      return {
        holdPattern: indicesToPattern(insideCards),
        description: `Inside Straight (high): ${formatCards(hand, insideCards)}`,
        rule: "four_to_inside_straight_high",
      };
    }
  }

  // 19. Unsuited high cards (J, Q, K, A) - hold up to 2
  if (highCards.length >= 2) {
    // Prefer keeping just 2 high cards (QJ better than KQJ due to straight potential)
    // Prefer cards that can make a straight together
    const sortedHigh = highCards.sort(
      (a, b) => getValue(hand[b]) - getValue(hand[a])
    );

    // If we have 3+ high cards, prefer keeping 2 that are closer together
    if (sortedHigh.length >= 3) {
      // Keep the two lowest high cards (better straight potential)
      const keep = sortedHigh.slice(-2);
      return {
        holdPattern: indicesToPattern(keep),
        description: `High Cards: ${formatCards(hand, keep)}`,
        rule: "two_high_cards",
      };
    }

    return {
      holdPattern: indicesToPattern(sortedHigh.slice(0, 2)),
      description: `High Cards: ${formatCards(hand, sortedHigh.slice(0, 2))}`,
      rule: "two_high_cards",
    };
  }

  // 20. Single high card
  if (highCards.length === 1) {
    return {
      holdPattern: indicesToPattern(highCards),
      description: `High Card: ${formatCards(hand, highCards)}`,
      rule: "one_high_card",
    };
  }

  // 21. Four to an Inside Straight (any)
  if (insideCards.length === 4) {
    return {
      holdPattern: indicesToPattern(insideCards),
      description: `Inside Straight: ${formatCards(hand, insideCards)}`,
      rule: "four_to_inside_straight",
    };
  }

  // 22. Three to a Flush with 2 high cards
  for (const [suit, count] of suitCounts) {
    if (count === 3) {
      const suitedIndices = getIndicesOfSuit(hand, suit);
      const suitedHighCount = suitedIndices.filter((i) =>
        isHighCard(hand[i])
      ).length;

      if (suitedHighCount >= 2) {
        return {
          holdPattern: indicesToPattern(suitedIndices),
          description: `3 to Flush (high): ${formatCards(hand, suitedIndices)}`,
          rule: "three_to_flush_high",
        };
      }
    }
  }

  // 23. Discard all - no good holds
  return {
    holdPattern: [false, false, false, false, false],
    description: "Discard all",
    rule: "discard_all",
  };
}

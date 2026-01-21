/**
 * Video Poker Strategy Engine
 *
 * Provides optimal play recommendations for all video poker variants.
 * Uses pattern-based rules for instant calculations.
 */

import { Card, GameType } from "../types/game";
import {
  StrategyResult,
  analyzeHand,
  getRank,
  getSuit,
  getValue,
  isHighCard,
  isTenOrHigher,
  getIndicesOfRank,
  indicesToPattern,
  formatCards,
  getTenOrHigherIndices,
  countSuits,
} from "./strategyHelpers";

/**
 * Main entry point - get optimal strategy for any game type
 */
export function getOptimalStrategy(
  hand: Card[],
  gameType: GameType
): StrategyResult {
  switch (gameType) {
    case GameType.JacksOrBetter:
      return getJacksOrBetterStrategy(hand);

    case GameType.TensOrBetter:
      return getTensOrBetterStrategy(hand);

    case GameType.BonusPoker:
    case GameType.BonusPokerDeluxe:
      return getBonusPokerStrategy(hand);

    case GameType.DoubleBonus:
    case GameType.SuperDoubleBonus:
      return getDoubleBonusStrategy(hand);

    case GameType.DoubleDoubleBonus:
    case GameType.TripleDoubleBonus:
      return getDoubleBonusStrategy(hand);

    case GameType.SuperAcesBonus:
      return getSuperAcesBonusStrategy(hand);

    case GameType.AcesAndFaces:
    case GameType.DoubleAcesAndFaces:
      return getAcesAndFacesStrategy(hand);

    case GameType.AllAmerican:
      return getAllAmericanStrategy(hand);

    case GameType.DeucesWild:
      return getDeucesWildStrategy(hand);

    case GameType.LooseDeuces:
      return getLooseDeucesStrategy(hand);

    case GameType.JokerWild:
      return getJokerWildStrategy(hand);

    case GameType.DoubleJokerPoker:
      return getDoubleJokerStrategy(hand);

    default:
      // Fallback to Jacks or Better strategy
      return getJacksOrBetterStrategy(hand);
  }
}

// =============================================================================
// JACKS OR BETTER STRATEGY
// =============================================================================

function getJacksOrBetterStrategy(hand: Card[]): StrategyResult {
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
    insideCards,
    highCards,
  } = analysis;
  const suitCounts = countSuits(hand);

  // 1. Royal Flush
  if (isRoyal) {
    return result(
      [true, true, true, true, true],
      "Royal Flush!",
      "royal_flush"
    );
  }

  // 2. Straight Flush
  if (hasFlush && hasStraight) {
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );
  }

  // 3. Four of a Kind
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }

  // 4. Four to a Royal Flush
  if (royalCards.length === 4) {
    return result(
      indicesToPattern(royalCards),
      `4 to Royal: ${formatCards(hand, royalCards)}`,
      "four_to_royal"
    );
  }

  // 5. Full House
  if (trips.length === 1 && pairs.length === 1) {
    return result([true, true, true, true, true], "Full House", "full_house");
  }

  // 6. Flush
  if (hasFlush) {
    return result([true, true, true, true, true], "Flush", "flush");
  }

  // 7. Straight
  if (hasStraight) {
    return result([true, true, true, true, true], "Straight", "straight");
  }

  // 8. Three of a Kind
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  // 9. Four to a Straight Flush
  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to Straight Flush: ${formatCards(hand, flushDrawCards)}`,
        "four_to_straight_flush"
      );
    }
  }

  // 10. Two Pair
  if (pairs.length === 2) {
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return result(
      indicesToPattern(indices),
      `Two Pair: ${pairs[0]}s and ${pairs[1]}s`,
      "two_pair"
    );
  }

  // 11. High Pair (Jacks or Better)
  if (pairs.length === 1 && ["J", "Q", "K", "A"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "high_pair"
    );
  }

  // 12. Three to a Royal Flush
  if (royalCards.length === 3) {
    return result(
      indicesToPattern(royalCards),
      `3 to Royal: ${formatCards(hand, royalCards)}`,
      "three_to_royal"
    );
  }

  // 13. Four to a Flush
  if (flushDrawCards.length === 4) {
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush: ${formatCards(hand, flushDrawCards)}`,
      "four_to_flush"
    );
  }

  // 14. Low Pair
  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Low Pair: ${pairs[0]}s`,
      "low_pair"
    );
  }

  // 15. Four to an Open-Ended Straight
  if (openEndedCards.length === 4) {
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight: ${formatCards(hand, openEndedCards)}`,
      "four_to_open_straight"
    );
  }

  // 16. Two suited high cards
  const suitedHigh = getSuitedHighCards(hand, suitCounts);
  if (suitedHigh.length >= 2) {
    const indices = suitedHigh.slice(0, 2);
    return result(
      indicesToPattern(indices),
      `Suited High: ${formatCards(hand, indices)}`,
      "two_suited_high"
    );
  }

  // 17. Three to a Straight Flush
  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3) {
    return result(
      indicesToPattern(threeToSF),
      `3 to SF: ${formatCards(hand, threeToSF)}`,
      "three_to_straight_flush"
    );
  }

  // 18. Inside straight with 3+ high cards
  if (insideCards.length === 4) {
    const insideHighCount = insideCards.filter((i) =>
      isHighCard(hand[i])
    ).length;
    if (insideHighCount >= 3) {
      return result(
        indicesToPattern(insideCards),
        `Inside Straight (high): ${formatCards(hand, insideCards)}`,
        "four_to_inside_high"
      );
    }
  }

  // 19. Unsuited high cards
  if (highCards.length >= 2) {
    const sorted = [...highCards].sort(
      (a, b) => getValue(hand[b]) - getValue(hand[a])
    );
    const keep = sorted.length >= 3 ? sorted.slice(-2) : sorted.slice(0, 2);
    return result(
      indicesToPattern(keep),
      `High Cards: ${formatCards(hand, keep)}`,
      "two_high_cards"
    );
  }

  // 20. Single high card
  if (highCards.length === 1) {
    return result(
      indicesToPattern(highCards),
      `High Card: ${formatCards(hand, highCards)}`,
      "one_high_card"
    );
  }

  // 21. Inside straight (any)
  if (insideCards.length === 4) {
    return result(
      indicesToPattern(insideCards),
      `Inside Straight: ${formatCards(hand, insideCards)}`,
      "four_to_inside"
    );
  }

  // 22. Discard all
  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// TENS OR BETTER STRATEGY
// =============================================================================

function getTensOrBetterStrategy(hand: Card[]): StrategyResult {
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
    insideCards,
  } = analysis;
  const suitCounts = countSuits(hand);
  const tenOrHigher = getTenOrHigherIndices(hand);

  // 1-7. Same as Jacks or Better
  if (isRoyal)
    return result(
      [true, true, true, true, true],
      "Royal Flush!",
      "royal_flush"
    );
  if (hasFlush && hasStraight)
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }
  if (royalCards.length === 4)
    return result(
      indicesToPattern(royalCards),
      `4 to Royal: ${formatCards(hand, royalCards)}`,
      "four_to_royal"
    );
  if (trips.length === 1 && pairs.length === 1)
    return result([true, true, true, true, true], "Full House", "full_house");
  if (hasFlush) return result([true, true, true, true, true], "Flush", "flush");
  if (hasStraight)
    return result([true, true, true, true, true], "Straight", "straight");
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  // Four to Straight Flush
  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to SF: ${formatCards(hand, flushDrawCards)}`,
        "four_to_straight_flush"
      );
    }
  }

  // Two Pair
  if (pairs.length === 2) {
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return result(indicesToPattern(indices), `Two Pair`, "two_pair");
  }

  // High Pair (Tens or Better)
  if (pairs.length === 1 && ["10", "J", "Q", "K", "A"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "high_pair"
    );
  }

  // Three to Royal
  if (royalCards.length === 3) {
    return result(
      indicesToPattern(royalCards),
      `3 to Royal: ${formatCards(hand, royalCards)}`,
      "three_to_royal"
    );
  }

  // Four to Flush
  if (flushDrawCards.length === 4) {
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush`,
      "four_to_flush"
    );
  }

  // Low Pair
  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Low Pair: ${pairs[0]}s`,
      "low_pair"
    );
  }

  // Open-ended straight
  if (openEndedCards.length === 4) {
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight`,
      "four_to_open_straight"
    );
  }

  // Suited 10+ cards
  const suitedTenPlus = getSuitedTenOrHigher(hand, suitCounts);
  if (suitedTenPlus.length >= 2) {
    return result(
      indicesToPattern(suitedTenPlus.slice(0, 2)),
      `Suited 10+: ${formatCards(hand, suitedTenPlus.slice(0, 2))}`,
      "suited_ten_plus"
    );
  }

  // Three to SF
  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3) {
    return result(
      indicesToPattern(threeToSF),
      `3 to SF`,
      "three_to_straight_flush"
    );
  }

  // Unsuited 10+ cards
  if (tenOrHigher.length >= 2) {
    return result(
      indicesToPattern(tenOrHigher.slice(0, 2)),
      `10+ Cards: ${formatCards(hand, tenOrHigher.slice(0, 2))}`,
      "unsuited_ten_plus"
    );
  }

  // Single 10+ card
  if (tenOrHigher.length === 1) {
    return result(
      indicesToPattern(tenOrHigher),
      `10+: ${formatCards(hand, tenOrHigher)}`,
      "single_ten_plus"
    );
  }

  // Inside straight
  if (insideCards.length === 4) {
    return result(
      indicesToPattern(insideCards),
      `Inside Straight`,
      "four_to_inside"
    );
  }

  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// BONUS POKER STRATEGY (prioritizes 4 of a kind Aces)
// =============================================================================

function getBonusPokerStrategy(hand: Card[]): StrategyResult {
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
    insideCards,
    highCards,
  } = analysis;
  const suitCounts = countSuits(hand);

  // Made hands
  if (isRoyal)
    return result(
      [true, true, true, true, true],
      "Royal Flush!",
      "royal_flush"
    );
  if (hasFlush && hasStraight)
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );

  // Four of a Kind (all worth keeping)
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }

  // 4 to Royal
  if (royalCards.length === 4) {
    return result(indicesToPattern(royalCards), `4 to Royal`, "four_to_royal");
  }

  // Full House, Flush, Straight
  if (trips.length === 1 && pairs.length === 1)
    return result([true, true, true, true, true], "Full House", "full_house");
  if (hasFlush) return result([true, true, true, true, true], "Flush", "flush");
  if (hasStraight)
    return result([true, true, true, true, true], "Straight", "straight");

  // Three of a Kind (Aces especially valuable)
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  // 4 to SF
  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to SF`,
        "four_to_straight_flush"
      );
    }
  }

  // Two Pair
  if (pairs.length === 2) {
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return result(indicesToPattern(indices), `Two Pair`, "two_pair");
  }

  // High Pair
  if (pairs.length === 1 && ["J", "Q", "K", "A"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "high_pair"
    );
  }

  // 3 to Royal
  if (royalCards.length === 3) {
    return result(indicesToPattern(royalCards), `3 to Royal`, "three_to_royal");
  }

  // 4 to Flush
  if (flushDrawCards.length === 4) {
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush`,
      "four_to_flush"
    );
  }

  // Low Pair (2-10, but Aces pair more valuable in bonus)
  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "low_pair"
    );
  }

  // Open straight
  if (openEndedCards.length === 4) {
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight`,
      "four_to_open_straight"
    );
  }

  // Continue with standard draws
  const suitedHigh = getSuitedHighCards(hand, suitCounts);
  if (suitedHigh.length >= 2) {
    return result(
      indicesToPattern(suitedHigh.slice(0, 2)),
      `Suited High`,
      "suited_high"
    );
  }

  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3) {
    return result(
      indicesToPattern(threeToSF),
      `3 to SF`,
      "three_to_straight_flush"
    );
  }

  if (highCards.length >= 2) {
    const keep = highCards.slice(0, 2);
    return result(indicesToPattern(keep), `High Cards`, "high_cards");
  }

  if (highCards.length === 1) {
    return result(indicesToPattern(highCards), `High Card`, "one_high_card");
  }

  if (insideCards.length === 4) {
    return result(
      indicesToPattern(insideCards),
      `Inside Straight`,
      "four_to_inside"
    );
  }

  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// DOUBLE BONUS STRATEGY (Aces very valuable, kickers matter)
// =============================================================================

function getDoubleBonusStrategy(hand: Card[]): StrategyResult {
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
    insideCards,
    highCards,
  } = analysis;
  const suitCounts = countSuits(hand);

  // Made hands
  if (isRoyal)
    return result(
      [true, true, true, true, true],
      "Royal Flush!",
      "royal_flush"
    );
  if (hasFlush && hasStraight)
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );

  // Four of a Kind - keep all 5 for kicker bonus potential
  if (quads.length > 0) {
    if (quads[0] === "A") {
      // Four Aces - kicker matters, keep all 5
      return result(
        [true, true, true, true, true],
        `Four Aces + Kicker`,
        "four_aces_with_kicker"
      );
    }
    if (["2", "3", "4"].includes(quads[0])) {
      // Four 2-4 - kicker matters
      return result(
        [true, true, true, true, true],
        `Four ${quads[0]}s + Kicker`,
        "four_low_with_kicker"
      );
    }
    // Other quads - just keep the four
    const indices = getIndicesOfRank(hand, quads[0]);
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }

  // 4 to Royal (very valuable in Double Bonus)
  if (royalCards.length === 4) {
    return result(indicesToPattern(royalCards), `4 to Royal`, "four_to_royal");
  }

  // Three Aces (huge potential for 4 Aces)
  if (trips.length > 0 && trips[0] === "A") {
    const indices = getIndicesOfRank(hand, "A");
    return result(indicesToPattern(indices), `Three Aces`, "three_aces");
  }

  // Full House, Flush, Straight
  if (trips.length === 1 && pairs.length === 1)
    return result([true, true, true, true, true], "Full House", "full_house");
  if (hasFlush) return result([true, true, true, true, true], "Flush", "flush");
  if (hasStraight)
    return result([true, true, true, true, true], "Straight", "straight");

  // Three of a Kind (non-Aces)
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  // 4 to SF
  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to SF`,
        "four_to_straight_flush"
      );
    }
  }

  // Two Pair (but Aces pair has higher priority in DB)
  if (pairs.length === 2) {
    // If one pair is Aces, might want to keep just Aces in some cases
    if (pairs.includes("A")) {
      const aceIndices = getIndicesOfRank(hand, "A");
      return result(
        indicesToPattern(aceIndices),
        `Pair of Aces (from 2 pair)`,
        "pair_aces_from_two_pair"
      );
    }
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return result(indicesToPattern(indices), `Two Pair`, "two_pair");
  }

  // Pair of Aces (very valuable)
  if (pairs.length === 1 && pairs[0] === "A") {
    const indices = getIndicesOfRank(hand, "A");
    return result(indicesToPattern(indices), `Pair of Aces`, "pair_aces");
  }

  // High Pair (J, Q, K)
  if (pairs.length === 1 && ["J", "Q", "K"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "high_pair"
    );
  }

  // 3 to Royal
  if (royalCards.length === 3) {
    return result(indicesToPattern(royalCards), `3 to Royal`, "three_to_royal");
  }

  // 4 to Flush
  if (flushDrawCards.length === 4) {
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush`,
      "four_to_flush"
    );
  }

  // Low Pair
  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "low_pair"
    );
  }

  // Open straight
  if (openEndedCards.length === 4) {
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight`,
      "four_to_open_straight"
    );
  }

  // Standard high card play
  const suitedHigh = getSuitedHighCards(hand, suitCounts);
  if (suitedHigh.length >= 2) {
    return result(
      indicesToPattern(suitedHigh.slice(0, 2)),
      `Suited High`,
      "suited_high"
    );
  }

  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3) {
    return result(
      indicesToPattern(threeToSF),
      `3 to SF`,
      "three_to_straight_flush"
    );
  }

  // Hold Aces even unsuited (very valuable in DB)
  const aceIndices = getIndicesOfRank(hand, "A");
  if (aceIndices.length > 0) {
    return result(indicesToPattern(aceIndices), `Ace(s)`, "hold_aces");
  }

  if (highCards.length >= 2) {
    return result(
      indicesToPattern(highCards.slice(0, 2)),
      `High Cards`,
      "high_cards"
    );
  }

  if (highCards.length === 1) {
    return result(indicesToPattern(highCards), `High Card`, "one_high_card");
  }

  if (insideCards.length === 4) {
    return result(
      indicesToPattern(insideCards),
      `Inside Straight`,
      "four_to_inside"
    );
  }

  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// SUPER ACES BONUS STRATEGY
// =============================================================================

function getSuperAcesBonusStrategy(hand: Card[]): StrategyResult {
  // Very similar to Double Bonus but Aces are even more valuable
  // Four Aces pays 400 coins (vs 160 in standard)
  return getDoubleBonusStrategy(hand);
}

// =============================================================================
// ACES AND FACES STRATEGY
// =============================================================================

function getAcesAndFacesStrategy(hand: Card[]): StrategyResult {
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
    insideCards,
    highCards,
  } = analysis;
  const suitCounts = countSuits(hand);

  // Made hands
  if (isRoyal)
    return result(
      [true, true, true, true, true],
      "Royal Flush!",
      "royal_flush"
    );
  if (hasFlush && hasStraight)
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );

  // Four of a Kind - Aces and Faces (J,Q,K) pay more
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    if (quads[0] === "A") {
      return result(indicesToPattern(indices), `Four Aces!`, "four_aces");
    }
    if (["J", "Q", "K"].includes(quads[0])) {
      return result(
        indicesToPattern(indices),
        `Four ${quads[0]}s (Face)!`,
        "four_faces"
      );
    }
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }

  // 4 to Royal
  if (royalCards.length === 4) {
    return result(indicesToPattern(royalCards), `4 to Royal`, "four_to_royal");
  }

  // Rest similar to Bonus Poker
  if (trips.length === 1 && pairs.length === 1)
    return result([true, true, true, true, true], "Full House", "full_house");
  if (hasFlush) return result([true, true, true, true, true], "Flush", "flush");
  if (hasStraight)
    return result([true, true, true, true, true], "Straight", "straight");

  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to SF`,
        "four_to_straight_flush"
      );
    }
  }

  if (pairs.length === 2) {
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return result(indicesToPattern(indices), `Two Pair`, "two_pair");
  }

  if (pairs.length === 1 && ["J", "Q", "K", "A"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "high_pair"
    );
  }

  if (royalCards.length === 3) {
    return result(indicesToPattern(royalCards), `3 to Royal`, "three_to_royal");
  }

  if (flushDrawCards.length === 4) {
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush`,
      "four_to_flush"
    );
  }

  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "low_pair"
    );
  }

  if (openEndedCards.length === 4) {
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight`,
      "four_to_open_straight"
    );
  }

  const suitedHigh = getSuitedHighCards(hand, suitCounts);
  if (suitedHigh.length >= 2) {
    return result(
      indicesToPattern(suitedHigh.slice(0, 2)),
      `Suited High`,
      "suited_high"
    );
  }

  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3) {
    return result(
      indicesToPattern(threeToSF),
      `3 to SF`,
      "three_to_straight_flush"
    );
  }

  if (highCards.length >= 2) {
    return result(
      indicesToPattern(highCards.slice(0, 2)),
      `High Cards`,
      "high_cards"
    );
  }

  if (highCards.length === 1) {
    return result(indicesToPattern(highCards), `High Card`, "one_high_card");
  }

  if (insideCards.length === 4) {
    return result(
      indicesToPattern(insideCards),
      `Inside Straight`,
      "four_to_inside"
    );
  }

  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// ALL AMERICAN STRATEGY (Flush, Straight, Straight Flush pay more)
// =============================================================================

function getAllAmericanStrategy(hand: Card[]): StrategyResult {
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
    insideCards,
    highCards,
  } = analysis;
  const suitCounts = countSuits(hand);

  // Made hands
  if (isRoyal)
    return result(
      [true, true, true, true, true],
      "Royal Flush!",
      "royal_flush"
    );
  if (hasFlush && hasStraight)
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }

  // 4 to Royal
  if (royalCards.length === 4) {
    return result(indicesToPattern(royalCards), `4 to Royal`, "four_to_royal");
  }

  // Full House
  if (trips.length === 1 && pairs.length === 1) {
    return result([true, true, true, true, true], "Full House", "full_house");
  }

  // Flush and Straight pay same (8x) in All American
  if (hasFlush) return result([true, true, true, true, true], "Flush", "flush");
  if (hasStraight)
    return result([true, true, true, true, true], "Straight", "straight");

  // Three of a Kind
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  // 4 to Straight Flush (very valuable - pays 200)
  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to SF`,
        "four_to_straight_flush"
      );
    }
  }

  // Two Pair
  if (pairs.length === 2) {
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return result(indicesToPattern(indices), `Two Pair`, "two_pair");
  }

  // High Pair
  if (pairs.length === 1 && ["J", "Q", "K", "A"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "high_pair"
    );
  }

  // 3 to Royal
  if (royalCards.length === 3) {
    return result(indicesToPattern(royalCards), `3 to Royal`, "three_to_royal");
  }

  // 4 to Flush (pays 8x, very valuable)
  if (flushDrawCards.length === 4) {
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush`,
      "four_to_flush"
    );
  }

  // 4 to Open Straight (pays 8x, very valuable)
  if (openEndedCards.length === 4) {
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight`,
      "four_to_open_straight"
    );
  }

  // Low Pair
  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "low_pair"
    );
  }

  // 3 to SF
  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3) {
    return result(
      indicesToPattern(threeToSF),
      `3 to SF`,
      "three_to_straight_flush"
    );
  }

  // 4 to Inside Straight (worth more here)
  if (insideCards.length === 4) {
    return result(
      indicesToPattern(insideCards),
      `Inside Straight`,
      "four_to_inside"
    );
  }

  const suitedHigh = getSuitedHighCards(hand, suitCounts);
  if (suitedHigh.length >= 2) {
    return result(
      indicesToPattern(suitedHigh.slice(0, 2)),
      `Suited High`,
      "suited_high"
    );
  }

  if (highCards.length >= 2) {
    return result(
      indicesToPattern(highCards.slice(0, 2)),
      `High Cards`,
      "high_cards"
    );
  }

  if (highCards.length === 1) {
    return result(indicesToPattern(highCards), `High Card`, "one_high_card");
  }

  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// DEUCES WILD STRATEGY
// =============================================================================

function getDeucesWildStrategy(hand: Card[]): StrategyResult {
  const deucesIndices = hand
    .map((c, i) => (getRank(c) === "2" ? i : -1))
    .filter((i) => i >= 0);
  const numDeuces = deucesIndices.length;
  const nonDeuces = hand.filter((c) => getRank(c) !== "2");
  const nonDeucesIndices = hand
    .map((_, i) => i)
    .filter((i) => !deucesIndices.includes(i));

  // Always keep all deuces
  const keepDeuces = indicesToPattern(deucesIndices);

  // With 4 deuces - keep all (guaranteed winning hand)
  if (numDeuces === 4) {
    return result(
      [true, true, true, true, true],
      "Four Deuces!",
      "four_deuces"
    );
  }

  // With 3 deuces
  if (numDeuces === 3) {
    // Check for wild royal
    if (nonDeuces.length === 2) {
      const suits = nonDeuces.map(getSuit);
      const ranks = nonDeuces.map(getRank);
      if (
        suits[0] === suits[1] &&
        ["10", "J", "Q", "K", "A"].includes(ranks[0]) &&
        ["10", "J", "Q", "K", "A"].includes(ranks[1])
      ) {
        return result(
          [true, true, true, true, true],
          "Wild Royal Draw",
          "wild_royal_3_deuces"
        );
      }
    }
    // Just keep the 3 deuces
    return result(keepDeuces, "Three Deuces", "three_deuces");
  }

  // With 2 deuces
  if (numDeuces === 2) {
    // Check for 4 to wild royal
    const nonDeuceSuits = nonDeuces.map(getSuit);
    const royalRanks = ["10", "J", "Q", "K", "A"];

    // Check if non-deuces are same suit and royal ranks
    const suitCounts = new Map<string, number>();
    for (const s of nonDeuceSuits)
      suitCounts.set(s, (suitCounts.get(s) || 0) + 1);

    for (const [suit, count] of suitCounts) {
      if (count >= 2) {
        const royalInSuit = nonDeucesIndices.filter(
          (i) =>
            getSuit(hand[i]) === suit && royalRanks.includes(getRank(hand[i]))
        );
        if (royalInSuit.length >= 2) {
          const combined = [...deucesIndices, ...royalInSuit];
          return result(
            indicesToPattern(combined),
            "4 to Wild Royal",
            "four_to_wild_royal"
          );
        }
      }
    }

    // Check for 4 to SF
    for (const [suit, count] of suitCounts) {
      if (count >= 2) {
        const suitedIndices = nonDeucesIndices.filter(
          (i) => getSuit(hand[i]) === suit
        );
        const values = suitedIndices
          .map((i) => getValue(hand[i]))
          .sort((a, b) => a - b);
        if (values.length >= 2 && values[values.length - 1] - values[0] <= 4) {
          const combined = [...deucesIndices, ...suitedIndices];
          return result(
            indicesToPattern(combined),
            "4 to SF",
            "four_to_sf_2_deuces"
          );
        }
      }
    }

    // Just keep the deuces
    return result(keepDeuces, "Two Deuces", "two_deuces");
  }

  // With 1 deuce
  if (numDeuces === 1) {
    const analysis = analyzeHand(nonDeuces, false);

    // Check for made hands with the deuce
    // 4 to royal
    const royalRanks = ["10", "J", "Q", "K", "A"];
    const suitCounts = countSuits(nonDeuces);

    for (const [suit, count] of suitCounts) {
      if (count >= 3) {
        const royalInSuit = nonDeucesIndices.filter(
          (i) =>
            getSuit(hand[i]) === suit && royalRanks.includes(getRank(hand[i]))
        );
        if (royalInSuit.length >= 3) {
          const combined = [...deucesIndices, ...royalInSuit];
          return result(
            indicesToPattern(combined),
            "4 to Wild Royal",
            "four_to_wild_royal_1_deuce"
          );
        }
      }
    }

    // Check for trips (becomes 4 of a kind)
    if (analysis.trips.length > 0) {
      const tripIndices = getIndicesOfRank(nonDeuces, analysis.trips[0]).map(
        (i) => nonDeucesIndices[i]
      );
      const combined = [...deucesIndices, ...tripIndices];
      return result(
        indicesToPattern(combined),
        `Four ${analysis.trips[0]}s (wild)`,
        "four_kind_wild"
      );
    }

    // Check for 4 to SF
    for (const [suit, count] of suitCounts) {
      if (count >= 3) {
        const suitedIndices = nonDeucesIndices.filter(
          (i) => getSuit(hand[i]) === suit
        );
        const values = suitedIndices
          .map((i) => getValue(hand[i]))
          .sort((a, b) => a - b);
        if (values[values.length - 1] - values[0] <= 4) {
          const combined = [...deucesIndices, ...suitedIndices];
          return result(
            indicesToPattern(combined),
            "4 to SF",
            "four_to_sf_1_deuce"
          );
        }
      }
    }

    // Check for pair (becomes trips)
    if (analysis.pairs.length > 0) {
      const pairIndices = getIndicesOfRank(nonDeuces, analysis.pairs[0]).map(
        (i) => nonDeucesIndices[i]
      );
      const combined = [...deucesIndices, ...pairIndices];
      return result(
        indicesToPattern(combined),
        `Three ${analysis.pairs[0]}s (wild)`,
        "trips_wild"
      );
    }

    // 4 to flush
    for (const [suit, count] of suitCounts) {
      if (count >= 3) {
        const suitedIndices = nonDeucesIndices.filter(
          (i) => getSuit(hand[i]) === suit
        );
        const combined = [...deucesIndices, ...suitedIndices];
        return result(
          indicesToPattern(combined),
          "4 to Flush",
          "four_to_flush_1_deuce"
        );
      }
    }

    // Just keep the deuce
    return result(keepDeuces, "One Deuce", "one_deuce");
  }

  // No deuces - play like standard poker but need 3 of a kind to pay
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
  } = analysis;
  const suitCounts = countSuits(hand);

  if (isRoyal)
    return result(
      [true, true, true, true, true],
      "Natural Royal!",
      "natural_royal"
    );
  if (hasFlush && hasStraight)
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }
  if (trips.length === 1 && pairs.length === 1)
    return result([true, true, true, true, true], "Full House", "full_house");
  if (hasFlush) return result([true, true, true, true, true], "Flush", "flush");
  if (hasStraight)
    return result([true, true, true, true, true], "Straight", "straight");
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  // 4 to royal
  if (royalCards.length === 4) {
    return result(indicesToPattern(royalCards), `4 to Royal`, "four_to_royal");
  }

  // 4 to SF
  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to SF`,
        "four_to_straight_flush"
      );
    }
  }

  // 3 to royal
  if (royalCards.length === 3) {
    return result(indicesToPattern(royalCards), `3 to Royal`, "three_to_royal");
  }

  // Pair (will become trips with deuce draw)
  if (pairs.length >= 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(indicesToPattern(indices), `Pair of ${pairs[0]}s`, "pair");
  }

  // 4 to flush
  if (flushDrawCards.length === 4) {
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush`,
      "four_to_flush"
    );
  }

  // Open straight
  if (openEndedCards.length === 4) {
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight`,
      "four_to_open_straight"
    );
  }

  // 3 to SF
  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3) {
    return result(
      indicesToPattern(threeToSF),
      `3 to SF`,
      "three_to_straight_flush"
    );
  }

  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// LOOSE DEUCES STRATEGY (Similar to Deuces Wild)
// =============================================================================

function getLooseDeucesStrategy(hand: Card[]): StrategyResult {
  // Loose Deuces has higher payouts for wild hands
  return getDeucesWildStrategy(hand);
}

// =============================================================================
// JOKER WILD STRATEGY
// =============================================================================

function getJokerWildStrategy(hand: Card[]): StrategyResult {
  const jokerIndices = hand
    .map((c, i) => (c === "O1" || c === "O2" ? i : -1))
    .filter((i) => i >= 0);
  const hasJoker = jokerIndices.length > 0;
  const nonJokers = hand.filter((c) => c !== "O1" && c !== "O2");
  const nonJokerIndices = hand
    .map((_, i) => i)
    .filter((i) => !jokerIndices.includes(i));

  if (hasJoker) {
    const keepJoker = indicesToPattern(jokerIndices);

    // Analyze non-joker cards
    const analysis = analyzeHand(nonJokers, false);
    const suitCounts = countSuits(nonJokers);

    // Check for trips (becomes 4 of a kind with joker)
    if (analysis.trips.length > 0) {
      const tripIndices = getIndicesOfRank(nonJokers, analysis.trips[0]).map(
        (i) => nonJokerIndices[i]
      );
      const combined = [...jokerIndices, ...tripIndices];
      return result(
        indicesToPattern(combined),
        `Four ${analysis.trips[0]}s (wild)`,
        "four_kind_wild"
      );
    }

    // Check for 4 to royal
    const royalRanks = ["10", "J", "Q", "K", "A"];
    for (const [suit, count] of suitCounts) {
      if (count >= 3) {
        const royalInSuit = nonJokerIndices.filter(
          (i) =>
            getSuit(hand[i]) === suit && royalRanks.includes(getRank(hand[i]))
        );
        if (royalInSuit.length >= 3) {
          const combined = [...jokerIndices, ...royalInSuit];
          return result(
            indicesToPattern(combined),
            "4 to Wild Royal",
            "four_to_wild_royal"
          );
        }
      }
    }

    // 4 to SF
    for (const [suit, count] of suitCounts) {
      if (count >= 3) {
        const suitedIndices = nonJokerIndices.filter(
          (i) => getSuit(hand[i]) === suit
        );
        const values = suitedIndices
          .map((i) => getValue(hand[i]))
          .sort((a, b) => a - b);
        if (values[values.length - 1] - values[0] <= 4) {
          const combined = [...jokerIndices, ...suitedIndices];
          return result(
            indicesToPattern(combined),
            "4 to SF",
            "four_to_sf_joker"
          );
        }
      }
    }

    // Pair becomes trips
    if (analysis.pairs.length > 0) {
      const pairIndices = getIndicesOfRank(nonJokers, analysis.pairs[0]).map(
        (i) => nonJokerIndices[i]
      );
      const combined = [...jokerIndices, ...pairIndices];
      return result(
        indicesToPattern(combined),
        `Three ${analysis.pairs[0]}s (wild)`,
        "trips_wild"
      );
    }

    // 4 to flush
    for (const [suit, count] of suitCounts) {
      if (count >= 3) {
        const suitedIndices = nonJokerIndices.filter(
          (i) => getSuit(hand[i]) === suit
        );
        const combined = [...jokerIndices, ...suitedIndices];
        return result(
          indicesToPattern(combined),
          "4 to Flush",
          "four_to_flush_joker"
        );
      }
    }

    // Just keep joker
    return result(keepJoker, "Joker", "keep_joker");
  }

  // No joker - need Kings or Better to pay
  const analysis = analyzeHand(hand, false);
  const {
    pairs,
    trips,
    quads,
    hasFlush,
    hasStraight,
    isRoyal,
    royalCards,
    flushDrawCards,
    openEndedCards,
    insideCards,
  } = analysis;
  const suitCounts = countSuits(hand);

  if (isRoyal)
    return result(
      [true, true, true, true, true],
      "Natural Royal!",
      "natural_royal"
    );
  if (hasFlush && hasStraight)
    return result(
      [true, true, true, true, true],
      "Straight Flush!",
      "straight_flush"
    );
  if (quads.length > 0) {
    const indices = getIndicesOfRank(hand, quads[0]);
    return result(
      indicesToPattern(indices),
      `Four ${quads[0]}s`,
      "four_of_a_kind"
    );
  }
  if (trips.length === 1 && pairs.length === 1)
    return result([true, true, true, true, true], "Full House", "full_house");
  if (hasFlush) return result([true, true, true, true, true], "Flush", "flush");
  if (hasStraight)
    return result([true, true, true, true, true], "Straight", "straight");
  if (trips.length > 0) {
    const indices = getIndicesOfRank(hand, trips[0]);
    return result(
      indicesToPattern(indices),
      `Three ${trips[0]}s`,
      "three_of_a_kind"
    );
  }

  if (royalCards.length === 4)
    return result(indicesToPattern(royalCards), `4 to Royal`, "four_to_royal");

  if (flushDrawCards.length === 4) {
    const flushCards = flushDrawCards.map((i) => hand[i]);
    const flushValues = flushCards.map(getValue).sort((a, b) => a - b);
    if (flushValues[3] - flushValues[0] <= 4) {
      return result(
        indicesToPattern(flushDrawCards),
        `4 to SF`,
        "four_to_straight_flush"
      );
    }
  }

  if (pairs.length === 2) {
    const indices = [
      ...getIndicesOfRank(hand, pairs[0]),
      ...getIndicesOfRank(hand, pairs[1]),
    ];
    return result(indicesToPattern(indices), `Two Pair`, "two_pair");
  }

  // Kings or Better pays
  if (pairs.length === 1 && ["K", "A"].includes(pairs[0])) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "high_pair"
    );
  }

  if (royalCards.length === 3)
    return result(indicesToPattern(royalCards), `3 to Royal`, "three_to_royal");
  if (flushDrawCards.length === 4)
    return result(
      indicesToPattern(flushDrawCards),
      `4 to Flush`,
      "four_to_flush"
    );

  // Low pair (doesn't pay but could become trips with joker draw)
  if (pairs.length === 1) {
    const indices = getIndicesOfRank(hand, pairs[0]);
    return result(
      indicesToPattern(indices),
      `Pair of ${pairs[0]}s`,
      "low_pair"
    );
  }

  if (openEndedCards.length === 4)
    return result(
      indicesToPattern(openEndedCards),
      `Open Straight`,
      "open_straight"
    );

  const threeToSF = getThreeToStraightFlush(hand, suitCounts);
  if (threeToSF.length === 3)
    return result(indicesToPattern(threeToSF), `3 to SF`, "three_to_sf");

  // Kings or Aces
  const kingsAces = hand
    .map((c, i) => (["K", "A"].includes(getRank(c)) ? i : -1))
    .filter((i) => i >= 0);
  if (kingsAces.length > 0) {
    return result(
      indicesToPattern(kingsAces),
      `K/A: ${formatCards(hand, kingsAces)}`,
      "kings_aces"
    );
  }

  if (insideCards.length === 4)
    return result(
      indicesToPattern(insideCards),
      `Inside Straight`,
      "inside_straight"
    );

  return result(
    [false, false, false, false, false],
    "Discard all",
    "discard_all"
  );
}

// =============================================================================
// DOUBLE JOKER STRATEGY
// =============================================================================

function getDoubleJokerStrategy(hand: Card[]): StrategyResult {
  const jokerIndices = hand
    .map((c, i) => (c === "O1" || c === "O2" ? i : -1))
    .filter((i) => i >= 0);
  const numJokers = jokerIndices.length;

  if (numJokers === 2) {
    // Two jokers - guaranteed winning hand
    return result([true, true, true, true, true], "Two Jokers!", "two_jokers");
  }

  // Otherwise same as single joker strategy
  return getJokerWildStrategy(hand);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function result(
  holdPattern: boolean[],
  description: string,
  rule: string
): StrategyResult {
  return { holdPattern, description, rule };
}

function getSuitedHighCards(
  hand: Card[],
  suitCounts: Map<string, number>
): number[] {
  for (const [suit, count] of suitCounts) {
    if (count >= 2) {
      const suitedHighCards = hand
        .map((c, i) => ({ card: c, index: i }))
        .filter(({ card }) => getSuit(card) === suit && isHighCard(card));

      if (suitedHighCards.length >= 2) {
        return suitedHighCards.map((x) => x.index);
      }
    }
  }
  return [];
}

function getSuitedTenOrHigher(
  hand: Card[],
  suitCounts: Map<string, number>
): number[] {
  for (const [suit, count] of suitCounts) {
    if (count >= 2) {
      const suitedCards = hand
        .map((c, i) => ({ card: c, index: i }))
        .filter(({ card }) => getSuit(card) === suit && isTenOrHigher(card));

      if (suitedCards.length >= 2) {
        return suitedCards.map((x) => x.index);
      }
    }
  }
  return [];
}

function getThreeToStraightFlush(
  hand: Card[],
  suitCounts: Map<string, number>
): number[] {
  for (const [suit, count] of suitCounts) {
    if (count >= 3) {
      const suitedCards = hand
        .map((c, i) => ({ value: getValue(c), index: i, suit: getSuit(c) }))
        .filter((x) => x.suit === suit)
        .sort((a, b) => a.value - b.value);

      if (suitedCards.length >= 3) {
        const values = suitedCards.map((x) => x.value);
        const span = values[values.length - 1] - values[0];

        if (span <= 4) {
          return suitedCards.slice(0, 3).map((x) => x.index);
        }
      }
    }
  }
  return [];
}

import { Card } from "../types/game";

/**
 * Mock hand utility for testing specific poker hands
 *
 * Usage examples:
 * - mockHand("Ah", "Kh", "Qh", "Jh", "10h") // Royal Flush
 * - mockHand("As", "As", "As", "As", "Kd") // Four Aces
 * - mockHand("9h", "9d", "Qc", "Ks", "Ad") // Pair of 9s
 */
export function mockHand(...cards: Card[]): Card[] {
  if (cards.length !== 5) {
    throw new Error(`mockHand requires exactly 5 cards, got ${cards.length}`);
  }
  return cards;
}

/**
 * Common test hands for quick testing
 */
export const TEST_HANDS = {
  // Premium hands
  royalFlush: mockHand("Ah", "Kh", "Qh", "Jh", "10h"),
  straightFlush: mockHand("9h", "8h", "7h", "6h", "5h"),

  // Four of a kind variations
  fourAces: mockHand("Ah", "Ad", "Ac", "As", "Kh"),
  fourKings: mockHand("Kh", "Kd", "Kc", "Ks", "Ah"),
  fourQueens: mockHand("Qh", "Qd", "Qc", "Qs", "Ah"),
  fourJacks: mockHand("Jh", "Jd", "Jc", "Js", "Ah"),
  four2s: mockHand("2h", "2d", "2c", "2s", "Ah"),
  four3s: mockHand("3h", "3d", "3c", "3s", "Ah"),
  four4s: mockHand("4h", "4d", "4c", "4s", "Ah"),
  four5s: mockHand("5h", "5d", "5c", "5s", "Ah"),

  // Full houses
  fullHouse: mockHand("Ah", "Ad", "Ac", "Kh", "Kd"),

  // Flushes
  flush: mockHand("Ah", "Kh", "9h", "7h", "3h"),

  // Straights
  straight: mockHand("Ah", "Kd", "Qc", "Jh", "10s"),

  // Three of a kind
  threeOfAKind: mockHand("Ah", "Ad", "Ac", "Kh", "Qd"),

  // Two pair
  twoPair: mockHand("Ah", "Ad", "Kh", "Kd", "Qc"),

  // Pairs
  jacksOrBetter: mockHand("Jh", "Jd", "Ah", "Kc", "Qs"),
  kingsOrBetter: mockHand("Kh", "Kd", "Ah", "Qc", "Js"),
  ninesOrBetter: mockHand("9h", "9d", "Ah", "Kc", "Qs"),

  // Losing hands
  highCard: mockHand("Ah", "Kd", "Qc", "Jh", "9s"),
  lowPair: mockHand("8h", "8d", "Ah", "Kc", "Qs"),

  // Wild card hands
  fiveOfAKind: mockHand("Ah", "Ad", "Ac", "As", "O1"), // with joker
  wildRoyalFlush: mockHand("Ah", "Kh", "Qh", "Jh", "O1"), // joker as 10h
  fourDeuces: mockHand("2h", "2d", "2c", "2s", "Ah"),
} as const;

/**
 * Helper to log hand details for debugging
 */
export function debugHand(hand: Card[]): void {
  console.log("Hand:", hand);
  console.log("Cards:", hand.map((c, i) => `${i + 1}: ${c}`).join(", "));
}

/**
 * Mock a Pick-a-Pair Poker hand (4 cards with a gap)
 */
export function mockPickAPairHand(
  card1: Card,
  card2: Card,
  card3: Card,
  card4: Card
): Card[] {
  return [card1, card2, null as any, card3, card4];
}

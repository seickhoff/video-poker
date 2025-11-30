import { Card } from "../types/game";

/**
 * Helper function to create a hand from card strings
 * Makes tests more readable
 */
export function createHand(...cards: Card[]): Card[] {
  if (cards.length !== 5) {
    throw new Error(`Hand must have exactly 5 cards, got ${cards.length}`);
  }
  return cards;
}

import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Joker Wild", () => {
  const gameType = GameType.JokerWild;
  const wager = 1;

  it("should detect five of a kind with joker", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "O1");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FiveOfAKind);
    expect(result.payout).toBe(200);
  });

  it("should detect wild royal flush with joker", () => {
    const hand = createHand("Ah", "Kh", "Qh", "Jh", "O1");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.WildRoyalFlush);
    expect(result.payout).toBe(100);
  });

  it("should detect four of a kind with joker", () => {
    const hand = createHand("Kh", "Kd", "Kc", "O1", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(20);
  });

  it("should detect kings or better (pair of kings)", () => {
    const hand = createHand("Kh", "Kd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.KingsOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should detect kings or better (pair of aces)", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.KingsOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for pair of queens", () => {
    const hand = createHand("Qh", "Qd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });
});

import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Tens or Better", () => {
  const gameType = GameType.TensOrBetter;
  const wager = 1;

  it("should detect royal flush and pay 250", () => {
    const hand = createHand("Ah", "Kh", "Qh", "Jh", "10h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.RoyalFlush);
    expect(result.payout).toBe(250);
  });

  it("should pay 4000 for max bet royal flush", () => {
    const hand = createHand("Ad", "Kd", "Qd", "Jd", "10d");
    const result = evaluateHand(hand, gameType, 5);
    expect(result.handType).toBe(HandType.RoyalFlush);
    expect(result.payout).toBe(4000);
  });

  it("should detect straight flush and pay 50", () => {
    const hand = createHand("Kc", "Qc", "Jc", "10c", "9c");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(50);
  });

  it("should detect four of a kind and pay 25", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(25);
  });

  it("should pay 9 for full house", () => {
    const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(9);
  });

  it("should pay 6 for flush", () => {
    const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
    expect(result.payout).toBe(6);
  });

  it("should pay 4 for straight", () => {
    const hand = createHand("Ah", "Kd", "Qc", "Jh", "10s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(4);
  });

  it("should pay 3 for three of a kind", () => {
    const hand = createHand("Qh", "Qd", "Qc", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.ThreeOfAKind);
    expect(result.payout).toBe(3);
  });

  it("should pay 2 for two pair", () => {
    const hand = createHand("Ah", "Ad", "8c", "8h", "Ks");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TwoPair);
    expect(result.payout).toBe(2);
  });

  it("should pay 1 for pair of tens", () => {
    const hand = createHand("10h", "10d", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of jacks", () => {
    const hand = createHand("Jh", "Jd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of queens", () => {
    const hand = createHand("Qh", "Qd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of kings", () => {
    const hand = createHand("Kh", "Kd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of aces", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for pair of nines", () => {
    const hand = createHand("9h", "9d", "8c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should NOT pay for pair of eights", () => {
    const hand = createHand("8h", "8d", "7c", "6h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should NOT pay for pair of deuces", () => {
    const hand = createHand("2h", "2d", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should multiply payouts by wager", () => {
    const hand = createHand("10h", "10d", "9c", "7h", "3s");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(1);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(2);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(5);
  });

  it("should have same payouts as Jacks or Better except for pair minimum", () => {
    const straightFlush = createHand("9s", "8s", "7s", "6s", "5s");
    const fourKind = createHand("7h", "7d", "7c", "7s", "2h");
    const fullHouse = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const flush = createHand("2c", "5c", "7c", "9c", "Kc");
    const straight = createHand("6h", "7d", "8c", "9h", "10s");

    expect(evaluateHand(straightFlush, gameType, 1).payout).toBe(50);
    expect(evaluateHand(fourKind, gameType, 1).payout).toBe(25);
    expect(evaluateHand(fullHouse, gameType, 1).payout).toBe(9);
    expect(evaluateHand(flush, gameType, 1).payout).toBe(6);
    expect(evaluateHand(straight, gameType, 1).payout).toBe(4);
  });
});

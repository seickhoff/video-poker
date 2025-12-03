import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - All American", () => {
  const gameType = GameType.AllAmerican;
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

  it("should detect straight flush and pay 200 (vs 50 in Jacks or Better)", () => {
    const hand = createHand("Kc", "Qc", "Jc", "10c", "9c");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(200);
  });

  it("should detect wheel straight flush and pay 200", () => {
    const hand = createHand("5h", "4h", "3h", "2h", "Ah");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(200);
  });

  it("should detect four of a kind and pay 35 (vs 25 in Jacks or Better)", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(35);
  });

  it("should detect four 7s and pay 35", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(35);
  });

  it("should pay 8 for full house (vs 9 in Jacks or Better)", () => {
    const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(8);
  });

  it("should pay 8 for flush (vs 6 in Jacks or Better)", () => {
    const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
    expect(result.payout).toBe(8);
  });

  it("should pay 8 for straight (vs 4 in Jacks or Better)", () => {
    const hand = createHand("Ah", "Kd", "Qc", "Jh", "10s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(8);
  });

  it("should pay 8 for wheel straight (A-5)", () => {
    const hand = createHand("5h", "4d", "3c", "2h", "As");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(8);
  });

  it("should verify equal payouts for full house, flush, and straight (all 8-for-1)", () => {
    const fullHouse = createHand("9h", "9d", "9c", "5h", "5d");
    const flush = createHand("2c", "5c", "7c", "9c", "Kc");
    const straight = createHand("6h", "7d", "8c", "9h", "10s");

    const fhResult = evaluateHand(fullHouse, gameType, wager);
    const flResult = evaluateHand(flush, gameType, wager);
    const stResult = evaluateHand(straight, gameType, wager);

    expect(fhResult.payout).toBe(8);
    expect(flResult.payout).toBe(8);
    expect(stResult.payout).toBe(8);
  });

  it("should pay 3 for three of a kind", () => {
    const hand = createHand("Qh", "Qd", "Qc", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.ThreeOfAKind);
    expect(result.payout).toBe(3);
  });

  it("should pay 1 for two pair (vs 2 in Jacks or Better)", () => {
    const hand = createHand("Ah", "Ad", "8c", "8h", "Ks");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TwoPair);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of jacks", () => {
    const hand = createHand("Jh", "Jd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.JacksOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of aces", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.JacksOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for pair of tens", () => {
    const hand = createHand("10h", "10d", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should multiply straight flush payout by wager", () => {
    const hand = createHand("9s", "8s", "7s", "6s", "5s");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(200);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(400);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(1000);
  });

  it("should multiply four of a kind payout by wager", () => {
    const hand = createHand("5h", "5d", "5c", "5s", "2h");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(35);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(70);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(175);
  });
});

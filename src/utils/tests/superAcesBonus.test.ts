import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Super Aces Bonus", () => {
  const gameType = GameType.SuperAcesBonus;
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
    const hand = createHand("9s", "8s", "7s", "6s", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(50);
  });

  it("should pay 80 for four aces (premium)", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAces);
    expect(result.payout).toBe(80);
  });

  it("should pay 30 for four kings (vs 80 for aces)", () => {
    const hand = createHand("Kh", "Kd", "Kc", "Ks", "5h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(30);
  });

  it("should pay 30 for four 2s", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "Ah");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(30);
  });

  it("should pay 30 for four 7s", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(30);
  });

  it("should pay 8 for full house", () => {
    const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(8);
  });

  it("should pay 5 for flush", () => {
    const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
    expect(result.payout).toBe(5);
  });

  it("should pay 4 for straight", () => {
    const hand = createHand("9h", "8d", "7c", "6h", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(4);
  });

  it("should pay 3 for three of a kind", () => {
    const hand = createHand("9h", "9d", "9c", "7h", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.ThreeOfAKind);
    expect(result.payout).toBe(3);
  });

  it("should pay 1 for two pair", () => {
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

  it("should multiply four aces payout by wager", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(80);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(160);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(400);
  });

  it("should have lower non-ace quad payout than Bonus Poker", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "2h");

    const bpResult = evaluateHand(hand, GameType.BonusPoker, 1);
    const sabResult = evaluateHand(hand, gameType, 1);

    expect(bpResult.payout).toBe(25);
    expect(sabResult.payout).toBe(30);
  });
});

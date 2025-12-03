import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Super Double Bonus", () => {
  const gameType = GameType.SuperDoubleBonus;
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

  it("should pay 80 for four aces (tier 1)", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAces);
    expect(result.payout).toBe(80);
  });

  it("should pay 40 for four 2s (tier 2: 2-3-4)", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "Ah");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s3s4s);
    expect(result.payout).toBe(40);
  });

  it("should pay 40 for four 3s (tier 2: 2-3-4)", () => {
    const hand = createHand("3h", "3d", "3c", "3s", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s3s4s);
    expect(result.payout).toBe(40);
  });

  it("should pay 40 for four 4s (tier 2: 2-3-4)", () => {
    const hand = createHand("4h", "4d", "4c", "4s", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s3s4s);
    expect(result.payout).toBe(40);
  });

  it("should pay 25 for four 5s (tier 3: 5-K)", () => {
    const hand = createHand("5h", "5d", "5c", "5s", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four5sKs);
    expect(result.payout).toBe(25);
  });

  it("should pay 25 for four 7s (tier 3: 5-K)", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four5sKs);
    expect(result.payout).toBe(25);
  });

  it("should pay 25 for four kings (tier 3: 5-K)", () => {
    const hand = createHand("Kh", "Kd", "Kc", "Ks", "5h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four5sKs);
    expect(result.payout).toBe(25);
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

  it("should multiply tiered quad payouts by wager", () => {
    const aces = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const twos = createHand("2h", "2d", "2c", "2s", "Kh");
    const fives = createHand("5h", "5d", "5c", "5s", "Kh");

    expect(evaluateHand(aces, gameType, 2).payout).toBe(160);
    expect(evaluateHand(twos, gameType, 2).payout).toBe(80);
    expect(evaluateHand(fives, gameType, 2).payout).toBe(50);
  });
});

import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Aces and Faces", () => {
  const gameType = GameType.AcesAndFaces;
  const wager = 1;

  it("should detect four aces and pay 80", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAces);
    expect(result.payout).toBe(80);
  });

  it("should detect four jacks and pay 40", () => {
    const hand = createHand("Jh", "Jd", "Jc", "Js", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourJQK);
    expect(result.payout).toBe(40);
  });

  it("should detect four queens and pay 40", () => {
    const hand = createHand("Qh", "Qd", "Qc", "Qs", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourJQK);
    expect(result.payout).toBe(40);
  });

  it("should detect four kings and pay 40", () => {
    const hand = createHand("Kh", "Kd", "Kc", "Ks", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourJQK);
    expect(result.payout).toBe(40);
  });

  it("should detect four 7s and pay 25 (standard four of a kind)", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(25);
  });

  it("should pay 8 for full house (vs 9 in Jacks or Better)", () => {
    const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(8);
  });

  it("should pay 5 for flush (vs 6 in Jacks or Better)", () => {
    const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
    expect(result.payout).toBe(5);
  });
});

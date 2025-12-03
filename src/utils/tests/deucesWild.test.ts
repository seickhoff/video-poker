import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Deuces Wild", () => {
  const gameType = GameType.DeucesWild;
  const wager = 1;

  it("should detect four deuces and pay 200", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourDeuces);
    expect(result.payout).toBe(200);
  });

  it("should detect wild royal flush with one deuce", () => {
    const hand = createHand("Ah", "Kh", "Qh", "Jh", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.WildRoyalFlush);
    expect(result.payout).toBe(25);
  });

  it("should detect five of a kind with deuces", () => {
    const hand = createHand("Ah", "Ad", "Ac", "2h", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FiveOfAKind);
    expect(result.payout).toBe(15);
  });

  it("should detect straight flush with deuce", () => {
    const hand = createHand("9h", "8h", "7h", "6h", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(9);
  });

  it("should detect four of a kind with one deuce", () => {
    const hand = createHand("Kh", "Kd", "Kc", "2h", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(5);
  });

  it("should detect three of a kind with no deuces", () => {
    const hand = createHand("9h", "9d", "9c", "7h", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.ThreeOfAKind);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for two pair (not on Deuces Wild table)", () => {
    const hand = createHand("Ah", "Ad", "8c", "8h", "Ks");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should NOT pay for pair (not on Deuces Wild table)", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
  });
});

import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Loose Deuces", () => {
  const gameType = GameType.LooseDeuces;
  const wager = 1;

  it("should detect four deuces and pay 250 (vs 200 in Deuces Wild)", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourDeuces);
    expect(result.payout).toBe(250);
  });

  it("should pay 1250 for max bet four deuces", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "Ah");
    const result = evaluateHand(hand, gameType, 5);
    expect(result.handType).toBe(HandType.FourDeuces);
    expect(result.payout).toBe(1250);
  });

  it("should detect wild royal flush and pay 20 (vs 25 in Deuces Wild)", () => {
    const hand = createHand("Ah", "Kh", "Qh", "Jh", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.WildRoyalFlush);
    expect(result.payout).toBe(20);
  });

  it("should detect five of a kind and pay 12 (vs 15 in Deuces Wild)", () => {
    const hand = createHand("Ah", "Ad", "Ac", "2h", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FiveOfAKind);
    expect(result.payout).toBe(12);
  });

  it("should detect straight flush and pay 10 (vs 9 in Deuces Wild)", () => {
    const hand = createHand("9h", "8h", "7h", "6h", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(10);
  });

  it("should detect four of a kind and pay 3 (vs 5 in Deuces Wild)", () => {
    const hand = createHand("Kh", "Kd", "Kc", "2h", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(3);
  });

  it("should detect four of a kind without deuces and pay 3", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "Ah");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(3);
  });

  it("should detect full house and pay 3", () => {
    const hand = createHand("Kh", "Kd", "Kc", "5h", "5d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(3);
  });

  it("should detect flush and pay 2", () => {
    const hand = createHand("Kd", "Jd", "9d", "7d", "5d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
    expect(result.payout).toBe(2);
  });

  it("should detect straight and pay 2", () => {
    const hand = createHand("9h", "8d", "7c", "6h", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(2);
  });

  it("should detect three of a kind and pay 1", () => {
    const hand = createHand("9h", "9d", "9c", "7h", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.ThreeOfAKind);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for two pair", () => {
    const hand = createHand("Ah", "Ad", "8c", "8h", "Ks");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should NOT pay for pair", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should multiply four deuces payout by wager", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "7h");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(250);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(500);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(1250);
  });

  it("should have lower four-of-a-kind payout than Deuces Wild", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "Ah");

    const dwResult = evaluateHand(hand, GameType.DeucesWild, 1);
    const ldResult = evaluateHand(hand, gameType, 1);

    expect(dwResult.payout).toBe(5);
    expect(ldResult.payout).toBe(3);
  });

  it("should have higher four deuces payout than Deuces Wild", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "Kh");

    const dwResult = evaluateHand(hand, GameType.DeucesWild, 1);
    const ldResult = evaluateHand(hand, gameType, 1);

    expect(dwResult.payout).toBe(200);
    expect(ldResult.payout).toBe(250);
  });
});

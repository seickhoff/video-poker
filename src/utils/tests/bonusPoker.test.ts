import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Bonus Poker", () => {
  const gameType = GameType.BonusPoker;
  const wager = 1;

  it("should detect four aces and pay 80", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAces);
    expect(result.payout).toBe(80);
  });

  it("should detect four 2s and pay 40", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s4s);
    expect(result.payout).toBe(40);
  });

  it("should detect four 3s and pay 40", () => {
    const hand = createHand("3h", "3d", "3c", "3s", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s4s);
    expect(result.payout).toBe(40);
  });

  it("should detect four 4s and pay 40", () => {
    const hand = createHand("4h", "4d", "4c", "4s", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s4s);
    expect(result.payout).toBe(40);
  });

  it("should detect four 5s and pay 25", () => {
    const hand = createHand("5h", "5d", "5c", "5s", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four5sKings);
    expect(result.payout).toBe(25);
  });

  it("should detect four kings and pay 25", () => {
    const hand = createHand("Kh", "Kd", "Kc", "Ks", "7h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four5sKings);
    expect(result.payout).toBe(25);
  });
});

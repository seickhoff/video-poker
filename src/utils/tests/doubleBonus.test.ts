import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Double Bonus", () => {
  const gameType = GameType.DoubleBonus;
  const wager = 1;

  it("should detect four aces with a 2 kicker and pay 400", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAcesWith234);
    expect(result.payout).toBe(400);
  });

  it("should detect four aces with a 3 kicker and pay 400", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "3h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAcesWith234);
    expect(result.payout).toBe(400);
  });

  it("should detect four aces with a 4 kicker and pay 400", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "4h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAcesWith234);
    expect(result.payout).toBe(400);
  });

  it("should detect four aces with a 5 kicker and pay 160", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "5h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourAces);
    expect(result.payout).toBe(160);
  });

  it("should detect four 2s with an ace kicker and pay 80", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "Ah");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s4sWithA234);
    expect(result.payout).toBe(80);
  });

  it("should detect four 2s with a 3 kicker and pay 80", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "3h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s4sWithA234);
    expect(result.payout).toBe(80);
  });

  it("should detect four 2s with a 5 kicker and pay 40", () => {
    const hand = createHand("2h", "2d", "2c", "2s", "5h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Four2s4s);
    expect(result.payout).toBe(40);
  });

  it("should pay 10 for full house (vs 9 in Jacks or Better)", () => {
    const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(10);
  });

  it("should pay 1 for two pair (vs 2 in Jacks or Better)", () => {
    const hand = createHand("Ah", "Ad", "8c", "8h", "Ks");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TwoPair);
    expect(result.payout).toBe(1);
  });
});

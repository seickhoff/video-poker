import { describe, it, expect } from "vitest";
import { evaluateHand } from "./handEvaluator";
import { GameType, HandType } from "../types/game";
import { createHand } from "./testHelpers";

describe("Hand Evaluator - Priority Tests", () => {
  const gameType = GameType.JacksOrBetter;
  const wager = 1;

  it("should prioritize royal flush over straight flush", () => {
    const hand = createHand("Ah", "Kh", "Qh", "Jh", "10h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.RoyalFlush);
  });

  it("should prioritize straight flush over four of a kind", () => {
    const hand = createHand("9c", "8c", "7c", "6c", "5c");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
  });

  it("should prioritize four of a kind over full house", () => {
    const hand = createHand("Jh", "Jd", "Jc", "Js", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
  });

  it("should prioritize full house over flush", () => {
    const hand = createHand("6h", "6d", "6c", "Ah", "Ad");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
  });

  it("should prioritize flush over straight", () => {
    const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
  });
});

describe("Hand Evaluator - Wager Multipliers", () => {
  const gameType = GameType.JacksOrBetter;

  it("should multiply payouts by wager amount", () => {
    const hand = createHand("Qh", "Qd", "Qc", "7h", "3s");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(3);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(6);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(15);
  });

  it("should apply special 4000 payout for max bet royal flush", () => {
    const hand = createHand("Ah", "Kh", "Qh", "Jh", "10h");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(250);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(4000);
  });
});

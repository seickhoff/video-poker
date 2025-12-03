import { describe, it, expect } from "vitest";
import { createHand, evaluateHand, GameType, HandType } from "./testHelpers";

describe("Hand Evaluator - Jacks or Better", () => {
  const gameType = GameType.JacksOrBetter;
  const wager = 1;

  describe("Royal Flush", () => {
    it("should detect a natural royal flush in hearts", () => {
      const hand = createHand("Ah", "Kh", "Qh", "Jh", "10h");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.RoyalFlush);
      expect(result.payout).toBe(250);
    });

    it("should detect a natural royal flush in spades", () => {
      const hand = createHand("As", "Ks", "Qs", "Js", "10s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.RoyalFlush);
    });

    it("should pay 4000 for max bet royal flush", () => {
      const hand = createHand("Ad", "Kd", "Qd", "Jd", "10d");
      const result = evaluateHand(hand, gameType, 5);
      expect(result.handType).toBe(HandType.RoyalFlush);
      expect(result.payout).toBe(4000);
    });
  });

  describe("Straight Flush", () => {
    it("should detect a straight flush (9-K)", () => {
      const hand = createHand("Kc", "Qc", "Jc", "10c", "9c");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.StraightFlush);
      expect(result.payout).toBe(50);
    });

    it("should detect a straight flush (5-9)", () => {
      const hand = createHand("9d", "8d", "7d", "6d", "5d");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.StraightFlush);
    });

    it("should detect a wheel straight flush (A-5)", () => {
      const hand = createHand("5h", "4h", "3h", "2h", "Ah");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.StraightFlush);
    });
  });

  describe("Four of a Kind", () => {
    it("should detect four aces", () => {
      const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.FourOfAKind);
      expect(result.payout).toBe(25);
    });

    it("should detect four 7s", () => {
      const hand = createHand("7h", "7d", "7c", "7s", "2h");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.FourOfAKind);
    });
  });

  describe("Full House", () => {
    it("should detect kings full of threes", () => {
      const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.FullHouse);
      expect(result.payout).toBe(9);
    });

    it("should detect sixes full of aces", () => {
      const hand = createHand("6h", "6d", "6c", "Ah", "Ad");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.FullHouse);
    });
  });

  describe("Flush", () => {
    it("should detect a flush in diamonds", () => {
      const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.Flush);
      expect(result.payout).toBe(6);
    });
  });

  describe("Straight", () => {
    it("should detect a broadway straight (10-A)", () => {
      const hand = createHand("Ah", "Kd", "Qc", "Jh", "10s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.Straight);
      expect(result.payout).toBe(4);
    });

    it("should detect a wheel (A-5)", () => {
      const hand = createHand("5h", "4d", "3c", "2h", "As");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.Straight);
    });

    it("should detect a middle straight (6-10)", () => {
      const hand = createHand("10h", "9d", "8c", "7h", "6s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.Straight);
    });
  });

  describe("Three of a Kind", () => {
    it("should detect three queens", () => {
      const hand = createHand("Qh", "Qd", "Qc", "7h", "3s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.ThreeOfAKind);
      expect(result.payout).toBe(3);
    });
  });

  describe("Two Pair", () => {
    it("should detect aces and eights", () => {
      const hand = createHand("Ah", "Ad", "8c", "8h", "Ks");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.TwoPair);
      expect(result.payout).toBe(2);
    });
  });

  describe("Jacks or Better", () => {
    it("should detect a pair of jacks", () => {
      const hand = createHand("Jh", "Jd", "9c", "7h", "3s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.JacksOrBetter);
      expect(result.payout).toBe(1);
    });

    it("should detect a pair of queens", () => {
      const hand = createHand("Qh", "Qd", "9c", "7h", "3s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.JacksOrBetter);
    });

    it("should detect a pair of kings", () => {
      const hand = createHand("Kh", "Kd", "9c", "7h", "3s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.JacksOrBetter);
    });

    it("should detect a pair of aces", () => {
      const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.JacksOrBetter);
    });

    it("should NOT pay for a pair of tens", () => {
      const hand = createHand("10h", "10d", "9c", "7h", "3s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.None);
      expect(result.payout).toBe(0);
    });

    it("should NOT pay for a pair of nines", () => {
      const hand = createHand("9h", "9d", "8c", "7h", "3s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.None);
    });
  });

  describe("No winning hand", () => {
    it("should return None for high card", () => {
      const hand = createHand("Ah", "Kd", "Jc", "9h", "7s");
      const result = evaluateHand(hand, gameType, wager);
      expect(result.handType).toBe(HandType.None);
      expect(result.payout).toBe(0);
    });
  });
});

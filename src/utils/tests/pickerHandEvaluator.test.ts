import { describe, it, expect } from "vitest";
import { evaluatePokerHand, comparePokerHands } from "../pickerHandEvaluator";
import { Card } from "../../types/game";

describe("pickerHandEvaluator", () => {
  describe("evaluatePokerHand", () => {
    it("should identify Royal Flush", () => {
      const hand: Card[] = ["Ah", "Kh", "Qh", "Jh", "10h"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Straight Flush");
      expect(result.displayName).toBe("Royal Flush");
    });

    it("should identify Straight Flush", () => {
      const hand: Card[] = ["9h", "8h", "7h", "6h", "5h"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Straight Flush");
      expect(result.displayName).toContain("Straight Flush");
    });

    it("should identify Four of a Kind", () => {
      const hand: Card[] = ["Ah", "Ad", "Ac", "As", "Kh"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Four of a Kind");
      expect(result.displayName).toContain("Four of a Kind");
      expect(result.displayName).toContain("A");
    });

    it("should identify Full House", () => {
      const hand: Card[] = ["Kh", "Kd", "Kc", "Qh", "Qs"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Full House");
      expect(result.displayName).toContain("Full House");
    });

    it("should identify Flush", () => {
      const hand: Card[] = ["Kh", "Jh", "9h", "7h", "2h"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Flush");
      expect(result.displayName).toContain("Flush");
    });

    it("should identify Straight", () => {
      const hand: Card[] = ["9h", "8d", "7c", "6h", "5s"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Straight");
      expect(result.displayName).toContain("Straight");
    });

    it("should identify Ace-low Straight", () => {
      const hand: Card[] = ["Ah", "2d", "3c", "4h", "5s"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Straight");
      expect(result.displayName).toContain("5 high");
    });

    it("should identify Three of a Kind", () => {
      const hand: Card[] = ["Kh", "Kd", "Kc", "Qh", "Js"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Three of a Kind");
      expect(result.displayName).toContain("Three of a Kind");
    });

    it("should identify Two Pair", () => {
      const hand: Card[] = ["Kh", "Kd", "Qc", "Qh", "Js"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("Two Pair");
      expect(result.displayName).toContain("Two Pair");
    });

    it("should identify One Pair", () => {
      const hand: Card[] = ["Kh", "Kd", "Qc", "Jh", "9s"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("One Pair");
      expect(result.displayName).toContain("One Pair");
    });

    it("should identify High Card", () => {
      const hand: Card[] = ["Kh", "Qd", "Jc", "9h", "7s"];
      const result = evaluatePokerHand(hand);
      expect(result.category).toBe("High Card");
      expect(result.displayName).toContain("High Card");
    });
  });

  describe("comparePokerHands", () => {
    it("should rank Straight Flush higher than Four of a Kind", () => {
      const straightFlush = evaluatePokerHand(["9h", "8h", "7h", "6h", "5h"]);
      const fourOfAKind = evaluatePokerHand(["Ah", "Ad", "Ac", "As", "Kh"]);
      expect(comparePokerHands(straightFlush, fourOfAKind)).toBeGreaterThan(0);
    });

    it("should rank Four of a Kind higher than Full House", () => {
      const fourOfAKind = evaluatePokerHand(["Ah", "Ad", "Ac", "As", "Kh"]);
      const fullHouse = evaluatePokerHand(["Kh", "Kd", "Kc", "Qh", "Qs"]);
      expect(comparePokerHands(fourOfAKind, fullHouse)).toBeGreaterThan(0);
    });

    it("should compare Four of a Kind by rank", () => {
      const acesQuad = evaluatePokerHand(["Ah", "Ad", "Ac", "As", "Kh"]);
      const kingsQuad = evaluatePokerHand(["Kh", "Kd", "Kc", "Ks", "Qh"]);
      expect(comparePokerHands(acesQuad, kingsQuad)).toBeGreaterThan(0);
    });

    it("should compare pairs by kickers when pair rank is same", () => {
      const pairAcesKingKicker: Card[] = ["Ah", "Ad", "Kc", "Qh", "Js"];
      const pairAcesQueenKicker: Card[] = ["Ac", "As", "Qd", "Jh", "9s"];
      const hand1 = evaluatePokerHand(pairAcesKingKicker);
      const hand2 = evaluatePokerHand(pairAcesQueenKicker);
      expect(comparePokerHands(hand1, hand2)).toBeGreaterThan(0);
    });

    it("should identify true ties", () => {
      const hand1: Card[] = ["Ah", "Kh", "Qh", "Jh", "10h"];
      const hand2: Card[] = ["Ad", "Kd", "Qd", "Jd", "10d"];
      const eval1 = evaluatePokerHand(hand1);
      const eval2 = evaluatePokerHand(hand2);
      expect(comparePokerHands(eval1, eval2)).toBe(0);
    });
  });
});

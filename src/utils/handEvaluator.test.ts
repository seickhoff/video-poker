import { describe, it, expect } from "vitest";
import { evaluateHand } from "./handEvaluator";
import { GameType, HandType } from "../types/game";
import { createHand } from "./testHelpers";

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

describe("Hand Evaluator - Tens or Better", () => {
  const gameType = GameType.TensOrBetter;
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
    const hand = createHand("Kc", "Qc", "Jc", "10c", "9c");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(50);
  });

  it("should detect four of a kind and pay 25", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(25);
  });

  it("should pay 9 for full house", () => {
    const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(9);
  });

  it("should pay 6 for flush", () => {
    const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
    expect(result.payout).toBe(6);
  });

  it("should pay 4 for straight", () => {
    const hand = createHand("Ah", "Kd", "Qc", "Jh", "10s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(4);
  });

  it("should pay 3 for three of a kind", () => {
    const hand = createHand("Qh", "Qd", "Qc", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.ThreeOfAKind);
    expect(result.payout).toBe(3);
  });

  it("should pay 2 for two pair", () => {
    const hand = createHand("Ah", "Ad", "8c", "8h", "Ks");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TwoPair);
    expect(result.payout).toBe(2);
  });

  it("should pay 1 for pair of tens", () => {
    const hand = createHand("10h", "10d", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of jacks", () => {
    const hand = createHand("Jh", "Jd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of queens", () => {
    const hand = createHand("Qh", "Qd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of kings", () => {
    const hand = createHand("Kh", "Kd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should pay 1 for pair of aces", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.TensOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for pair of nines", () => {
    const hand = createHand("9h", "9d", "8c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should NOT pay for pair of eights", () => {
    const hand = createHand("8h", "8d", "7c", "6h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should NOT pay for pair of deuces", () => {
    const hand = createHand("2h", "2d", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should multiply payouts by wager", () => {
    const hand = createHand("10h", "10d", "9c", "7h", "3s");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(1);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(2);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(5);
  });

  it("should have same payouts as Jacks or Better except for pair minimum", () => {
    const straightFlush = createHand("9s", "8s", "7s", "6s", "5s");
    const fourKind = createHand("7h", "7d", "7c", "7s", "2h");
    const fullHouse = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const flush = createHand("2c", "5c", "7c", "9c", "Kc");
    const straight = createHand("6h", "7d", "8c", "9h", "10s");

    expect(evaluateHand(straightFlush, gameType, 1).payout).toBe(50);
    expect(evaluateHand(fourKind, gameType, 1).payout).toBe(25);
    expect(evaluateHand(fullHouse, gameType, 1).payout).toBe(9);
    expect(evaluateHand(flush, gameType, 1).payout).toBe(6);
    expect(evaluateHand(straight, gameType, 1).payout).toBe(4);
  });
});

describe("Hand Evaluator - All American", () => {
  const gameType = GameType.AllAmerican;
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

  it("should detect straight flush and pay 200 (vs 50 in Jacks or Better)", () => {
    const hand = createHand("Kc", "Qc", "Jc", "10c", "9c");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(200);
  });

  it("should detect wheel straight flush and pay 200", () => {
    const hand = createHand("5h", "4h", "3h", "2h", "Ah");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.StraightFlush);
    expect(result.payout).toBe(200);
  });

  it("should detect four of a kind and pay 35 (vs 25 in Jacks or Better)", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "Kh");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(35);
  });

  it("should detect four 7s and pay 35", () => {
    const hand = createHand("7h", "7d", "7c", "7s", "2h");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(35);
  });

  it("should pay 8 for full house (vs 9 in Jacks or Better)", () => {
    const hand = createHand("Kh", "Kd", "Kc", "3h", "3d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FullHouse);
    expect(result.payout).toBe(8);
  });

  it("should pay 8 for flush (vs 6 in Jacks or Better)", () => {
    const hand = createHand("Kd", "Jd", "9d", "5d", "2d");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Flush);
    expect(result.payout).toBe(8);
  });

  it("should pay 8 for straight (vs 4 in Jacks or Better)", () => {
    const hand = createHand("Ah", "Kd", "Qc", "Jh", "10s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(8);
  });

  it("should pay 8 for wheel straight (A-5)", () => {
    const hand = createHand("5h", "4d", "3c", "2h", "As");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.Straight);
    expect(result.payout).toBe(8);
  });

  it("should verify equal payouts for full house, flush, and straight (all 8-for-1)", () => {
    const fullHouse = createHand("9h", "9d", "9c", "5h", "5d");
    const flush = createHand("2c", "5c", "7c", "9c", "Kc");
    const straight = createHand("6h", "7d", "8c", "9h", "10s");

    const fhResult = evaluateHand(fullHouse, gameType, wager);
    const flResult = evaluateHand(flush, gameType, wager);
    const stResult = evaluateHand(straight, gameType, wager);

    expect(fhResult.payout).toBe(8);
    expect(flResult.payout).toBe(8);
    expect(stResult.payout).toBe(8);
  });

  it("should pay 3 for three of a kind", () => {
    const hand = createHand("Qh", "Qd", "Qc", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.ThreeOfAKind);
    expect(result.payout).toBe(3);
  });

  it("should pay 1 for two pair (vs 2 in Jacks or Better)", () => {
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

  it("should pay 1 for pair of aces", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.JacksOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for pair of tens", () => {
    const hand = createHand("10h", "10d", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });

  it("should multiply straight flush payout by wager", () => {
    const hand = createHand("9s", "8s", "7s", "6s", "5s");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(200);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(400);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(1000);
  });

  it("should multiply four of a kind payout by wager", () => {
    const hand = createHand("5h", "5d", "5c", "5s", "2h");

    const result1 = evaluateHand(hand, gameType, 1);
    expect(result1.payout).toBe(35);

    const result2 = evaluateHand(hand, gameType, 2);
    expect(result2.payout).toBe(70);

    const result5 = evaluateHand(hand, gameType, 5);
    expect(result5.payout).toBe(175);
  });
});

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

describe("Hand Evaluator - Joker Wild", () => {
  const gameType = GameType.JokerWild;
  const wager = 1;

  it("should detect five of a kind with joker", () => {
    const hand = createHand("Ah", "Ad", "Ac", "As", "O1");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FiveOfAKind);
    expect(result.payout).toBe(200);
  });

  it("should detect wild royal flush with joker", () => {
    const hand = createHand("Ah", "Kh", "Qh", "Jh", "O1");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.WildRoyalFlush);
    expect(result.payout).toBe(100);
  });

  it("should detect four of a kind with joker", () => {
    const hand = createHand("Kh", "Kd", "Kc", "O1", "5s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.FourOfAKind);
    expect(result.payout).toBe(20);
  });

  it("should detect kings or better (pair of kings)", () => {
    const hand = createHand("Kh", "Kd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.KingsOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should detect kings or better (pair of aces)", () => {
    const hand = createHand("Ah", "Ad", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.KingsOrBetter);
    expect(result.payout).toBe(1);
  });

  it("should NOT pay for pair of queens", () => {
    const hand = createHand("Qh", "Qd", "9c", "7h", "3s");
    const result = evaluateHand(hand, gameType, wager);
    expect(result.handType).toBe(HandType.None);
    expect(result.payout).toBe(0);
  });
});

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

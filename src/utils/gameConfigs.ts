import { GameConfig, GameType, HandType } from "../types/game";

export const gameConfigs = {
  [GameType.JacksOrBetter]: {
    name: GameType.JacksOrBetter,
    jokers: 0,
    description:
      "The original Video Poker game that pays even money on a high pair (Jacks or better). Long-term payout: 99.54%",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.StraightFlush, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.FourOfAKind, payouts: [25, 50, 75, 100, 125] },
      { hand: HandType.FullHouse, payouts: [9, 18, 27, 36, 45] },
      { hand: HandType.Flush, payouts: [6, 12, 18, 24, 30] },
      { hand: HandType.Straight, payouts: [4, 8, 12, 16, 20] },
      { hand: HandType.ThreeOfAKind, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.TwoPair, payouts: [2, 4, 6, 8, 10] },
      { hand: HandType.JacksOrBetter, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.AcesAndFaces]: {
    name: GameType.AcesAndFaces,
    jokers: 0,
    description:
      "A Jacks or Better variation with higher payouts for certain Four-of-a-Kinds. Long-term payout: 99.85%",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.FourAces, payouts: [80, 160, 240, 320, 400] },
      { hand: HandType.StraightFlush, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.FourJQK, payouts: [40, 80, 120, 160, 200] },
      { hand: HandType.FourOfAKind, payouts: [25, 50, 75, 100, 125] },
      { hand: HandType.FullHouse, payouts: [8, 16, 24, 32, 40] },
      { hand: HandType.Flush, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.Straight, payouts: [4, 8, 12, 16, 20] },
      { hand: HandType.ThreeOfAKind, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.TwoPair, payouts: [2, 4, 6, 8, 10] },
      { hand: HandType.JacksOrBetter, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.BonusPoker]: {
    name: GameType.BonusPoker,
    jokers: 0,
    description:
      "Jacks or Better with bonus payouts for 4-of-a-kind hands. Full-pay return: 99.17%",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.StraightFlush, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.FourAces, payouts: [80, 160, 240, 320, 400] },
      { hand: HandType.Four24, payouts: [40, 80, 120, 160, 200] },
      { hand: HandType.Four5K, payouts: [25, 50, 75, 100, 125] },
      { hand: HandType.FullHouse, payouts: [8, 16, 24, 32, 40] },
      { hand: HandType.Flush, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.Straight, payouts: [4, 8, 12, 16, 20] },
      { hand: HandType.ThreeOfAKind, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.TwoPair, payouts: [2, 4, 6, 8, 10] },
      { hand: HandType.JacksOrBetter, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.DoubleBonus]: {
    name: GameType.DoubleBonus,
    jokers: 0,
    description:
      "Classic Double Bonus Poker with enhanced 4-of-a-kind payouts and kicker rules. Full-pay version (10/7) returns 100.17%.",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.StraightFlush, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.FourAcesWith234, payouts: [400, 800, 1200, 1600, 2000] },
      { hand: HandType.FourAcesAlt, payouts: [160, 320, 480, 640, 800] },
      { hand: HandType.Four2s4sWithA234, payouts: [80, 160, 240, 320, 400] },
      { hand: HandType.Four2s4sAlt, payouts: [40, 80, 120, 160, 200] },
      { hand: HandType.Four5sKsAlt, payouts: [25, 50, 75, 100, 125] },
      { hand: HandType.FullHouse, payouts: [10, 20, 30, 40, 50] },
      { hand: HandType.Flush, payouts: [7, 14, 21, 28, 35] },
      { hand: HandType.Straight, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.ThreeOfAKind, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.TwoPair, payouts: [1, 2, 3, 4, 5] },
      { hand: HandType.JacksOrBetter, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.DoubleDoubleBonus]: {
    name: GameType.DoubleDoubleBonus,
    jokers: 0,
    description:
      "Bonus Poker variant with large kicker-based payouts for 4 Aces, 2-4s, and 5-Ks. Long-term payout: 98.98% (9/6).",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.StraightFlush, payouts: [50, 100, 150, 200, 250] },
      {
        hand: HandType.FourAcesWithKicker,
        payouts: [400, 800, 1200, 1600, 2000],
      },
      { hand: HandType.FourAces, payouts: [160, 320, 480, 640, 800] },
      { hand: HandType.Four2s4sWithKicker, payouts: [80, 160, 240, 320, 400] },
      { hand: HandType.Four2s4s, payouts: [40, 80, 120, 160, 200] },
      { hand: HandType.Four5sKings, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.FullHouse, payouts: [9, 18, 27, 36, 45] },
      { hand: HandType.Flush, payouts: [6, 12, 18, 24, 30] },
      { hand: HandType.Straight, payouts: [4, 8, 12, 16, 20] },
      { hand: HandType.ThreeOfAKind, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.TwoPair, payouts: [1, 2, 3, 4, 5] },
      { hand: HandType.JacksOrBetter, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.TripleDoubleBonus]: {
    name: GameType.TripleDoubleBonus,
    jokers: 0,
    description:
      "High-volatility variant with huge 4-of-a-kind bonuses. Full-pay 9/7 returns 99.58%.",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.StraightFlush, payouts: [50, 100, 150, 200, 250] },
      {
        hand: HandType.FourAcesWith234,
        payouts: [800, 1600, 2400, 3200, 4000],
      },
      { hand: HandType.FourAcesAlt, payouts: [160, 320, 480, 640, 800] },
      {
        hand: HandType.Four2s4sWithA234,
        payouts: [400, 800, 1200, 1600, 2000],
      },
      { hand: HandType.Four2s4sAlt, payouts: [80, 160, 240, 320, 400] },
      { hand: HandType.Four5sKsWithA234, payouts: [250, 500, 750, 1000, 1250] },
      { hand: HandType.Four5sKsAlt, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.FullHouse, payouts: [9, 18, 27, 36, 45] },
      { hand: HandType.Flush, payouts: [7, 14, 21, 28, 35] },
      { hand: HandType.Straight, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.ThreeOfAKind, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.TwoPair, payouts: [1, 2, 3, 4, 5] },
      { hand: HandType.JacksOrBetter, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.JokerWild]: {
    name: GameType.JokerWild,
    jokers: 1,
    description:
      "Uses a 53-card deck with one wild Joker. Long-term payout: 100.6%",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.FiveOfAKind, payouts: [200, 400, 600, 800, 1000] },
      { hand: HandType.WildRoyalFlush, payouts: [100, 200, 300, 400, 500] },
      { hand: HandType.StraightFlush, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.FourOfAKind, payouts: [20, 40, 60, 80, 100] },
      { hand: HandType.FullHouse, payouts: [7, 14, 21, 28, 35] },
      { hand: HandType.Flush, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.Straight, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.ThreeOfAKind, payouts: [2, 4, 6, 8, 10] },
      { hand: HandType.TwoPair, payouts: [1, 2, 3, 4, 5] },
      { hand: HandType.KingsOrBetter, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.DoubleJokerPoker]: {
    name: GameType.DoubleJokerPoker,
    jokers: 2,
    description:
      "Uses a 54-card deck with two wild Jokers. Long-term payout: 99.96%",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.WildRoyalFlush, payouts: [100, 200, 300, 400, 500] },
      { hand: HandType.FiveOfAKind, payouts: [50, 100, 150, 200, 250] },
      { hand: HandType.StraightFlush, payouts: [25, 50, 75, 100, 125] },
      { hand: HandType.FourOfAKind, payouts: [8, 16, 24, 32, 40] },
      { hand: HandType.FullHouse, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.Flush, payouts: [4, 8, 12, 16, 20] },
      { hand: HandType.Straight, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.ThreeOfAKind, payouts: [2, 4, 6, 8, 10] },
      { hand: HandType.TwoPair, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  [GameType.DeucesWild]: {
    name: GameType.DeucesWild,
    jokers: 0,
    description:
      "All four 2s are wild cards. Long-term payout: 100.76% - one of the few games where the player has an advantage!",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [250, 500, 750, 1000, 4000] },
      { hand: HandType.FourDeuces, payouts: [200, 400, 600, 800, 1000] },
      { hand: HandType.WildRoyalFlush, payouts: [25, 50, 75, 100, 125] },
      { hand: HandType.FiveOfAKind, payouts: [15, 30, 45, 60, 75] },
      { hand: HandType.StraightFlush, payouts: [9, 18, 27, 36, 45] },
      { hand: HandType.FourOfAKind, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.FullHouse, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.Flush, payouts: [2, 4, 6, 8, 10] },
      { hand: HandType.Straight, payouts: [2, 4, 6, 8, 10] },
      { hand: HandType.ThreeOfAKind, payouts: [1, 2, 3, 4, 5] },
    ],
  },
  // Pick-a-Pair Poker uses special game mechanics implemented in VideoPokerProvider:
  // - Initial deal: 4 cards with 1-card gap in display
  // - First 2 cards are automatically kept
  // - Player chooses between card 3 OR card 4 (using hold toggle)
  // - After selection, 2 more cards are dealt to complete the 5-card hand
  [GameType.PickAPairPoker]: {
    name: GameType.PickAPairPoker,
    jokers: 0,
    description:
      "A 2+1 variant of video poker. Keep the first 2 cards, choose between the 3rd or 4th card, then complete a 5-card hand.",
    payoutTable: [
      { hand: HandType.RoyalFlush, payouts: [200, 400, 600, 800, 10000] },
      { hand: HandType.StraightFlush, payouts: [200, 400, 600, 800, 1000] },
      { hand: HandType.FourOfAKind, payouts: [100, 200, 300, 400, 500] },
      { hand: HandType.FullHouse, payouts: [18, 36, 54, 72, 90] },
      { hand: HandType.Flush, payouts: [15, 30, 45, 60, 75] },
      { hand: HandType.Straight, payouts: [11, 22, 33, 44, 55] },
      { hand: HandType.ThreeOfAKind, payouts: [5, 10, 15, 20, 25] },
      { hand: HandType.TwoPair, payouts: [3, 6, 9, 12, 15] },
      { hand: HandType.NinesOrBetter, payouts: [2, 4, 6, 8, 10] },
    ],
  },
} as Record<GameType, GameConfig>;

export function getGameConfig(gameType: GameType): GameConfig {
  return gameConfigs[gameType];
}

export function getJokerCount(gameType: GameType): number {
  return gameConfigs[gameType].jokers;
}

import { GameConfig, GameType } from "../types/game";

export const gameConfigs: Record<GameType, GameConfig> = {
  "Jacks or Better": {
    name: "Jacks or Better",
    jokers: 0,
    description:
      "The original Video Poker game that pays even money on a high pair (Jacks or better). Long-term payout: 99.54%",
    payoutTable: [
      { hand: "Royal Flush", payouts: [250, 500, 750, 1000, 4000] },
      { hand: "Straight Flush", payouts: [50, 100, 150, 200, 250] },
      { hand: "Four of a Kind", payouts: [25, 50, 75, 100, 125] },
      { hand: "Full House", payouts: [9, 18, 27, 36, 45] },
      { hand: "Flush", payouts: [6, 12, 18, 24, 30] },
      { hand: "Straight", payouts: [4, 8, 12, 16, 20] },
      { hand: "Three of a Kind", payouts: [3, 6, 9, 12, 15] },
      { hand: "Two Pair", payouts: [2, 4, 6, 8, 10] },
      { hand: "Jacks or Better", payouts: [1, 2, 3, 4, 5] },
    ],
  },
  "Aces and Faces": {
    name: "Aces and Faces",
    jokers: 0,
    description:
      "A Jacks or Better variation with higher payouts for certain Four-of-a-Kinds. Long-term payout: 99.85%",
    payoutTable: [
      { hand: "Royal Flush", payouts: [250, 500, 750, 1000, 4000] },
      { hand: "Four Aces", payouts: [80, 160, 240, 320, 400] },
      { hand: "Straight Flush", payouts: [50, 100, 150, 200, 250] },
      {
        hand: "Four Jacks, Queens, or Kings",
        payouts: [40, 80, 120, 160, 200],
      },
      { hand: "Four of a Kind", payouts: [25, 50, 75, 100, 125] },
      { hand: "Full House", payouts: [8, 16, 24, 32, 40] },
      { hand: "Flush", payouts: [5, 10, 15, 20, 25] },
      { hand: "Straight", payouts: [4, 8, 12, 16, 20] },
      { hand: "Three of a Kind", payouts: [3, 6, 9, 12, 15] },
      { hand: "Two Pair", payouts: [2, 4, 6, 8, 10] },
      { hand: "Jacks or Better", payouts: [1, 2, 3, 4, 5] },
    ],
  },
  "Joker Wild": {
    name: "Joker Wild",
    jokers: 1,
    description:
      "Uses a 53-card deck with one wild Joker. Long-term payout: 100.6%",
    payoutTable: [
      { hand: "Royal Flush", payouts: [250, 500, 750, 1000, 4000] },
      { hand: "Five of a Kind", payouts: [200, 400, 600, 800, 1000] },
      { hand: "Wild Royal Flush", payouts: [100, 200, 300, 400, 500] },
      { hand: "Straight Flush", payouts: [50, 100, 150, 200, 250] },
      { hand: "Four of a Kind", payouts: [20, 40, 60, 80, 100] },
      { hand: "Full House", payouts: [7, 14, 21, 28, 35] },
      { hand: "Flush", payouts: [5, 10, 15, 20, 25] },
      { hand: "Straight", payouts: [3, 6, 9, 12, 15] },
      { hand: "Three of a Kind", payouts: [2, 4, 6, 8, 10] },
      { hand: "Two Pair", payouts: [1, 2, 3, 4, 5] },
      { hand: "Kings or Better", payouts: [1, 2, 3, 4, 5] },
    ],
  },
  "Double Joker Poker": {
    name: "Double Joker Poker",
    jokers: 2,
    description:
      "Uses a 54-card deck with two wild Jokers. Long-term payout: 99.96%",
    payoutTable: [
      { hand: "Royal Flush", payouts: [250, 500, 750, 1000, 4000] },
      { hand: "Wild Royal Flush", payouts: [100, 200, 300, 400, 500] },
      { hand: "Five of a Kind", payouts: [50, 100, 150, 200, 250] },
      { hand: "Straight Flush", payouts: [25, 50, 75, 100, 125] },
      { hand: "Four of a Kind", payouts: [8, 16, 24, 32, 40] },
      { hand: "Full House", payouts: [5, 10, 15, 20, 25] },
      { hand: "Flush", payouts: [4, 8, 12, 16, 20] },
      { hand: "Straight", payouts: [3, 6, 9, 12, 15] },
      { hand: "Three of a Kind", payouts: [2, 4, 6, 8, 10] },
      { hand: "Two Pair", payouts: [1, 2, 3, 4, 5] },
    ],
  },
  "Deuces Wild": {
    name: "Deuces Wild",
    jokers: 0,
    description:
      "All four 2s are wild cards. Long-term payout: 100.76% - one of the few games where the player has an advantage!",
    payoutTable: [
      { hand: "Royal Flush", payouts: [250, 500, 750, 1000, 4000] },
      { hand: "Four Deuces", payouts: [200, 400, 600, 800, 1000] },
      { hand: "Wild Royal Flush", payouts: [25, 50, 75, 100, 125] },
      { hand: "Five of a Kind", payouts: [15, 30, 45, 60, 75] },
      { hand: "Straight Flush", payouts: [9, 18, 27, 36, 45] },
      { hand: "Four of a Kind", payouts: [5, 10, 15, 20, 25] },
      { hand: "Full House", payouts: [3, 6, 9, 12, 15] },
      { hand: "Flush", payouts: [2, 4, 6, 8, 10] },
      { hand: "Straight", payouts: [2, 4, 6, 8, 10] },
      { hand: "Three of a Kind", payouts: [1, 2, 3, 4, 5] },
    ],
  },
};

export function getGameConfig(gameType: GameType): GameConfig {
  return gameConfigs[gameType];
}

export function getJokerCount(gameType: GameType): number {
  return gameConfigs[gameType].jokers;
}

import { Card, GameType, HandEvaluation, HandType } from "../types/game";
import { getCardValue, getCardRank, getCardSuit } from "./deck";
import { getGameConfig } from "./gameConfigs";

interface HandAnalysis {
  isFlush: boolean;
  isStraight: boolean;
  isRoyal: boolean;
  isNaturalRoyal: boolean;
  isPair: boolean;
  isTwoPair: boolean;
  isThreeKind: boolean;
  isFourKind: boolean;
  isFiveKind: boolean;
  isFullHouse: boolean;
  isFourDeuces: boolean;
  isFourAces: boolean;
  isFourFaces: boolean;
  isJacksOrBetter: boolean;
  isKingsOrBetter: boolean;
  isNinesOrBetter: boolean;
  fourKindRank: string | null;
  kickerRank: string | null;
  jokerCount: number;
}

function analyzeHand(hand: Card[], gameType: GameType): HandAnalysis {
  let cards = [...hand];
  let jokerCount = 0;

  if (gameType === "Deuces Wild") {
    cards = cards.map((card) => {
      if (getCardRank(card) === "2") {
        jokerCount++;
        return jokerCount % 2 === 0 ? "O2" : ("O1" as Card);
      }
      return card;
    });
  }

  const nonJokers = cards.filter((c) => !c.startsWith("O"));
  jokerCount = cards.length - nonJokers.length;

  const sortedCards = nonJokers.sort(
    (a, b) => getCardValue(b) - getCardValue(a)
  );

  const ranks = sortedCards.map(getCardRank);
  const suits = sortedCards.map(getCardSuit);
  const values = sortedCards.map(getCardValue);

  const rankCounts: Record<string, number> = {};
  ranks.forEach((rank) => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  });

  const uniqueRanks = Object.keys(rankCounts).length;
  // const maxOfKind = Math.max(...Object.values(rankCounts), 0) + jokerCount;

  const isFlush =
    (suits.length === 5 &&
      suits.every((s) => s === suits[0]) &&
      jokerCount === 0) ||
    (suits.length === 4 &&
      suits.every((s) => s === suits[0]) &&
      jokerCount === 1) ||
    (suits.length === 3 &&
      suits.every((s) => s === suits[0]) &&
      jokerCount === 2);

  const isStraight = checkStraight(values, jokerCount);

  const rankString = ranks.join("");
  const isRoyal =
    /^AKQJ10$/.test(rankString) ||
    /^KQJ10$/.test(rankString) ||
    /^AQJ10$/.test(rankString) ||
    /^AKJ10$/.test(rankString) ||
    /^AKQ10$/.test(rankString) ||
    /^AKQJ$/.test(rankString) ||
    /^AKQ$/.test(rankString) ||
    /^AKJ$/.test(rankString) ||
    /^AK10$/.test(rankString) ||
    /^AQJ$/.test(rankString) ||
    /^AQ10$/.test(rankString) ||
    /^AJ10$/.test(rankString) ||
    /^KQJ$/.test(rankString) ||
    /^KQ10$/.test(rankString) ||
    /^KJ10$/.test(rankString) ||
    /^QJ10$/.test(rankString);

  const isNaturalRoyal = rankString === "AKQJ10";

  let isPair = false;
  let isTwoPair = false;
  let isThreeKind = false;
  let isFourKind = false;
  let isFiveKind = false;
  let isFullHouse = false;
  let isJacksOrBetter = false;
  let isKingsOrBetter = false;
  let isNinesOrBetter = false;
  let isFourAces = false;
  let isFourFaces = false;
  let isFourDeuces = false;
  let fourKindRank: string | null = null;
  let kickerRank: string | null = null;

  for (const rank of Object.keys(rankCounts)) {
    const count = rankCounts[rank] + jokerCount;

    if (count === 2 && uniqueRanks === 4) {
      isPair = true;
      if (["A", "K", "Q", "J"].includes(rank)) isJacksOrBetter = true;
      if (["A", "K"].includes(rank)) isKingsOrBetter = true;
      if (["A", "K", "Q", "J", "10", "9"].includes(rank))
        isNinesOrBetter = true;
    }

    if (count === 2 && uniqueRanks === 3) {
      const pairs = Object.values(rankCounts).filter((c) => c === 2).length;
      if (pairs === 2) isTwoPair = true;
    }

    if (count === 3) {
      isThreeKind = true;
      if (uniqueRanks === 2) isFullHouse = true;
    }

    if (count === 4) {
      isFourKind = true;
      fourKindRank = rank;
      // Find the kicker (the one card that's not part of the quad)
      const kickerRanks = Object.keys(rankCounts).filter((r) => r !== rank);
      kickerRank = kickerRanks.length > 0 ? kickerRanks[0] : null;
      if (rank === "A") isFourAces = true;
      if (["K", "Q", "J"].includes(rank)) isFourFaces = true;
    }

    if (count === 5) {
      isFiveKind = true;
      if (jokerCount === 4 && gameType === "Deuces Wild") {
        isFourDeuces = true;
      }
    }
  }

  return {
    isFlush,
    isStraight,
    isRoyal,
    isNaturalRoyal,
    isPair,
    isTwoPair,
    isThreeKind,
    isFourKind,
    isFiveKind,
    isFullHouse,
    isFourDeuces,
    isFourAces,
    isFourFaces,
    isJacksOrBetter,
    isKingsOrBetter,
    isNinesOrBetter,
    fourKindRank,
    kickerRank,
    jokerCount,
  };
}

function checkStraight(values: number[], jokerCount: number): boolean {
  if (values.length === 0) return jokerCount >= 5;

  const sorted = [...values].sort((a, b) => b - a);
  const low = sorted[sorted.length - 1];

  let pattern = sorted.map((v) => v - low).join("");

  const straightPatterns = [
    "43210",
    "4320",
    "4310",
    "4210",
    "3210",
    "430",
    "420",
    "410",
    "320",
    "310",
    "210",
  ];

  if (straightPatterns.includes(pattern)) return true;

  if (sorted[0] === 14) {
    const aceLowValues = sorted.slice(1).concat([1]);
    const aceLowSorted = aceLowValues.sort((a, b) => b - a);
    const aceLow = aceLowSorted[aceLowSorted.length - 1];
    pattern = aceLowSorted.map((v) => v - aceLow).join("");
    if (straightPatterns.includes(pattern)) return true;
  }

  return false;
}

// Helper function to get payout from game config
function getPayoutFromConfig(
  gameType: GameType,
  handType: HandType,
  wager: number
): number {
  const config = getGameConfig(gameType);
  const payoutEntry = config.payoutTable.find(
    (entry) => entry.hand === handType
  );
  if (!payoutEntry) return 0;
  return payoutEntry.payouts[wager - 1];
}

export function evaluateHand(
  hand: Card[],
  gameType: GameType,
  wager: number
): HandEvaluation {
  const analysis = analyzeHand(hand, gameType);

  let handType: HandType = "";
  let payout = 0;

  switch (gameType) {
    case "Jacks or Better":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 50 * wager;
      } else if (analysis.isFourKind) {
        handType = "Four of a Kind";
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 6 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = "Jacks or Better";
        payout = 1 * wager;
      }
      break;

    case "Aces and Faces":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isFourAces) {
        handType = "Four Aces";
        payout = 80 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 50 * wager;
      } else if (analysis.isFourFaces) {
        handType = "Four Jacks, Queens, or Kings";
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = "Four of a Kind";
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 8 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 5 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = "Jacks or Better";
        payout = 1 * wager;
      }
      break;

    case "Bonus Poker":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 50 * wager;
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = "Four Aces";
        payout = 80 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = "Four 2-4";
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = "Four 5-K";
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 8 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 5 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = "Jacks or Better";
        payout = 1 * wager;
      }
      break;

    case "Double Bonus":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 50 * wager;
      } else if (
        analysis.isFourKind &&
        analysis.fourKindRank === "A" &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = "4 Aces w/ 2,3,4";
        payout = [400, 800, 1200, 1600, 2000][wager - 1];
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = "4 Aces";
        payout = 160 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "") &&
        analysis.kickerRank &&
        ["A", "2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = "4 2s-4s w/ A,2,3,4";
        payout = [80, 160, 240, 320, 400][wager - 1];
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = "4 2s-4s";
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = "4 5s-Ks";
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 10 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 7 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 5 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = "Jacks or Better";
        payout = 1 * wager;
      }
      break;

    case "Double Double Bonus":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 50 * wager;
      } else if (
        analysis.isFourKind &&
        analysis.fourKindRank === "A" &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = "Four Aces w/ Kicker";
        payout = [400, 800, 1200, 1600, 2000][wager - 1];
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = "Four Aces";
        payout = 160 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "") &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = "Four 2s-4s w/ Kicker";
        payout = [80, 160, 240, 320, 400][wager - 1];
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = "Four 2s-4s";
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = "Four 5s-Kings";
        payout = 50 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 6 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = "Jacks or Better";
        payout = 1 * wager;
      }
      break;

    case "Triple Double Bonus":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 50 * wager;
      } else if (
        analysis.isFourKind &&
        analysis.fourKindRank === "A" &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = "4 Aces w/ 2,3,4";
        payout = [800, 1600, 2400, 3200, 4000][wager - 1];
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = "4 Aces";
        payout = 160 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "") &&
        analysis.kickerRank &&
        ["A", "2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = "4 2s-4s w/ A,2,3,4";
        payout = [400, 800, 1200, 1600, 2000][wager - 1];
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = "4 2s-4s";
        payout = 80 * wager;
      } else if (
        analysis.isFourKind &&
        analysis.kickerRank &&
        ["A", "2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = "4 5s-Ks w/ A,2,3,4";
        payout = [250, 500, 750, 1000, 1250][wager - 1];
      } else if (analysis.isFourKind) {
        handType = "4 5s-Ks";
        payout = 50 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 7 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 5 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = "Jacks or Better";
        payout = 1 * wager;
      }
      break;

    case "Joker Wild":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isFiveKind) {
        handType = "Five of a Kind";
        payout = 200 * wager;
      } else if (analysis.isRoyal && analysis.isFlush && analysis.isStraight) {
        handType = "Wild Royal Flush";
        payout = 100 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 50 * wager;
      } else if (analysis.isFourKind) {
        handType = "Four of a Kind";
        payout = 20 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 7 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 5 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 3 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 2 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isKingsOrBetter) {
        handType = "Kings or Better";
        payout = 1 * wager;
      }
      break;

    case "Double Joker Poker":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isRoyal && analysis.isFlush && analysis.isStraight) {
        handType = "Wild Royal Flush";
        payout = 100 * wager;
      } else if (analysis.isFiveKind) {
        handType = "Five of a Kind";
        payout = 50 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 25 * wager;
      } else if (analysis.isFourKind) {
        handType = "Four of a Kind";
        payout = 8 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 5 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 4 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 3 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 2 * wager;
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
        payout = 1 * wager;
      }
      break;

    case "Deuces Wild":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isFourDeuces) {
        handType = "Four Deuces";
        payout = 200 * wager;
      } else if (analysis.isRoyal && analysis.isFlush && analysis.isStraight) {
        handType = "Wild Royal Flush";
        payout = 25 * wager;
      } else if (analysis.isFiveKind) {
        handType = "Five of a Kind";
        payout = 15 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
        payout = 9 * wager;
      } else if (analysis.isFourKind) {
        handType = "Four of a Kind";
        payout = 5 * wager;
      } else if (analysis.isFullHouse) {
        handType = "Full House";
        payout = 3 * wager;
      } else if (analysis.isFlush) {
        handType = "Flush";
        payout = 2 * wager;
      } else if (analysis.isStraight) {
        handType = "Straight";
        payout = 2 * wager;
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
        payout = 1 * wager;
      }
      break;

    case "Pick-a-Pair Poker":
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = "Royal Flush";
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = "Straight Flush";
      } else if (analysis.isFourKind) {
        handType = "Four of a Kind";
      } else if (analysis.isFullHouse) {
        handType = "Full House";
      } else if (analysis.isFlush) {
        handType = "Flush";
      } else if (analysis.isStraight) {
        handType = "Straight";
      } else if (analysis.isThreeKind) {
        handType = "Three of a Kind";
      } else if (analysis.isTwoPair) {
        handType = "Two Pair";
      } else if (analysis.isPair && analysis.isNinesOrBetter) {
        handType = "Nines or Better";
      }

      // Get payout from config
      if (handType) {
        payout = getPayoutFromConfig(gameType, handType, wager);
      }
      break;
  }

  return { handType, payout };
}

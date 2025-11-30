import { Card, GameType, HandEvaluation, HandType } from "../types/game";
import { getCardValue, getCardRank, getCardSuit } from "./deck";
import { getGameConfig } from "./gameConfigs";

export interface HandAnalysis {
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
  isFour2s3s4s: boolean;
  isFour5sKs: boolean;
  isJacksOrBetter: boolean;
  isTensOrBetter: boolean;
  isKingsOrBetter: boolean;
  isNinesOrBetter: boolean;
  fourKindRank: string | null;
  kickerRank: string | null;
  jokerCount: number;
}

function analyzeHand(hand: Card[], gameType: GameType): HandAnalysis {
  let cards = [...hand];
  let jokerCount = 0;

  if (gameType === "Deuces Wild" || gameType === "Loose Deuces") {
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
      jokerCount === 2) ||
    (suits.length === 2 &&
      suits.every((s) => s === suits[0]) &&
      jokerCount === 3) ||
    (suits.length === 1 && jokerCount === 4);

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
  let isTensOrBetter = false;
  let isKingsOrBetter = false;
  let isNinesOrBetter = false;
  let isFourAces = false;
  let isFourFaces = false;
  let isFour2s3s4s = false;
  let isFour5sKs = false;
  let isFourDeuces = false;
  let fourKindRank: string | null = null;
  let kickerRank: string | null = null;

  for (const rank of Object.keys(rankCounts)) {
    const count = rankCounts[rank] + jokerCount;

    if (count === 2 && uniqueRanks === 4) {
      isPair = true;
      if (["A", "K", "Q", "J"].includes(rank)) isJacksOrBetter = true;
      if (["A", "K", "Q", "J", "10"].includes(rank)) isTensOrBetter = true;
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
      if (["2", "3", "4"].includes(rank)) isFour2s3s4s = true;
      if (["5", "6", "7", "8", "9", "10", "J", "Q", "K"].includes(rank))
        isFour5sKs = true;
    }

    if (count === 5) {
      isFiveKind = true;
      if (
        jokerCount === 4 &&
        (gameType === "Deuces Wild" || gameType === "Loose Deuces")
      ) {
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
    isFour2s3s4s,
    isFour5sKs,
    isJacksOrBetter,
    isTensOrBetter,
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

  let handType: HandType = HandType.None;
  let payout = 0;

  switch (gameType) {
    case GameType.JacksOrBetter:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 6 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.TensOrBetter:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 6 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isTensOrBetter) {
        handType = HandType.TensOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.AllAmerican:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 200 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 35 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 8 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 8 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 8 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.AcesAndFaces:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isFourAces) {
        handType = HandType.FourAces;
        payout = 80 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (analysis.isFourFaces) {
        handType = HandType.FourJQK;
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 8 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 5 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.BonusPoker:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = HandType.FourAces;
        payout = 80 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = HandType.Four2s4s;
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.Four5sKings;
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 8 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 5 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.BonusPokerDeluxe:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 80 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 6 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 2 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.DoubleBonus:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (
        analysis.isFourKind &&
        analysis.fourKindRank === "A" &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = HandType.FourAcesWith234;
        payout = [400, 800, 1200, 1600, 2000][wager - 1];
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = HandType.FourAces;
        payout = 160 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "") &&
        analysis.kickerRank &&
        ["A", "2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = HandType.Four2s4sWithA234;
        payout = [80, 160, 240, 320, 400][wager - 1];
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = HandType.Four2s4s;
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.Four5sKings;
        payout = 25 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 10 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 7 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 5 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.DoubleDoubleBonus:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (
        analysis.isFourKind &&
        analysis.fourKindRank === "A" &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = HandType.FourAcesWith234;
        payout = [400, 800, 1200, 1600, 2000][wager - 1];
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = HandType.FourAces;
        payout = 160 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "") &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = HandType.Four2s4sWithA234;
        payout = [80, 160, 240, 320, 400][wager - 1];
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = HandType.Four2s4s;
        payout = 40 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.Four5sKings;
        payout = 50 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 6 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 4 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.TripleDoubleBonus:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (
        analysis.isFourKind &&
        analysis.fourKindRank === "A" &&
        analysis.kickerRank &&
        ["2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = HandType.FourAcesWith234;
        payout = [800, 1600, 2400, 3200, 4000][wager - 1];
      } else if (analysis.isFourKind && analysis.fourKindRank === "A") {
        handType = HandType.FourAces;
        payout = 160 * wager;
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "") &&
        analysis.kickerRank &&
        ["A", "2", "3", "4"].includes(analysis.kickerRank)
      ) {
        handType = HandType.Four2s4sWithA234;
        payout = [400, 800, 1200, 1600, 2000][wager - 1];
      } else if (
        analysis.isFourKind &&
        ["2", "3", "4"].includes(analysis.fourKindRank || "")
      ) {
        handType = HandType.Four2s4s;
        payout = 80 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.Four5sKings;
        payout = 50 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 9 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 7 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 5 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 3 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isJacksOrBetter) {
        handType = HandType.JacksOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.JokerWild:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isFiveKind) {
        handType = HandType.FiveOfAKind;
        payout = 200 * wager;
      } else if (analysis.isRoyal && analysis.isFlush && analysis.isStraight) {
        handType = HandType.WildRoyalFlush;
        payout = 100 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 50 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 20 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 7 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 5 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 3 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 2 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 1 * wager;
      } else if (analysis.isPair && analysis.isKingsOrBetter) {
        handType = HandType.KingsOrBetter;
        payout = 1 * wager;
      }
      break;

    case GameType.DoubleJokerPoker:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isRoyal && analysis.isFlush && analysis.isStraight) {
        handType = HandType.WildRoyalFlush;
        payout = 100 * wager;
      } else if (analysis.isFiveKind) {
        handType = HandType.FiveOfAKind;
        payout = 50 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 25 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 8 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 5 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 4 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 3 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 2 * wager;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
        payout = 1 * wager;
      }
      break;

    case GameType.DeucesWild:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isFourDeuces) {
        handType = HandType.FourDeuces;
        payout = 200 * wager;
      } else if (analysis.isRoyal && analysis.isFlush && analysis.isStraight) {
        handType = HandType.WildRoyalFlush;
        payout = 25 * wager;
      } else if (analysis.isFiveKind) {
        handType = HandType.FiveOfAKind;
        payout = 15 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 9 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 5 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 3 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 2 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 2 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 1 * wager;
      }
      break;

    case GameType.LooseDeuces:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
        payout = wager === 5 ? 4000 : 250 * wager;
      } else if (analysis.isFourDeuces) {
        handType = HandType.FourDeuces;
        payout = 250 * wager;
      } else if (analysis.isRoyal && analysis.isFlush && analysis.isStraight) {
        handType = HandType.WildRoyalFlush;
        payout = 20 * wager;
      } else if (analysis.isFiveKind) {
        handType = HandType.FiveOfAKind;
        payout = 12 * wager;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
        payout = 10 * wager;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
        payout = 3 * wager;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
        payout = 3 * wager;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
        payout = 2 * wager;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
        payout = 2 * wager;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
        payout = 1 * wager;
      }
      break;

    case GameType.PickAPairPoker:
      if (
        analysis.isRoyal &&
        analysis.isFlush &&
        analysis.isStraight &&
        analysis.isNaturalRoyal
      ) {
        handType = HandType.RoyalFlush;
      } else if (analysis.isStraight && analysis.isFlush) {
        handType = HandType.StraightFlush;
      } else if (analysis.isFourKind) {
        handType = HandType.FourOfAKind;
      } else if (analysis.isFullHouse) {
        handType = HandType.FullHouse;
      } else if (analysis.isFlush) {
        handType = HandType.Flush;
      } else if (analysis.isStraight) {
        handType = HandType.Straight;
      } else if (analysis.isThreeKind) {
        handType = HandType.ThreeOfAKind;
      } else if (analysis.isTwoPair) {
        handType = HandType.TwoPair;
      } else if (analysis.isPair && analysis.isNinesOrBetter) {
        handType = HandType.NinesOrBetter;
      }

      // Get payout from config
      if (handType) {
        payout = getPayoutFromConfig(gameType, handType, wager);
      }
      break;
  }

  return { handType, payout };
}

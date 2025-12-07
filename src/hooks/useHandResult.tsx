import { useCallback } from "react";
import { GameType, HandType } from "../types/game";
import { getGameStats, updateGameStats } from "../utils/statistics";

interface HandEvaluation {
  handType: HandType;
  payout: number;
}

/**
 * Custom hook for recording hand results and updating statistics
 * Consolidates the duplicated hand result tracking logic from VideoPokerProvider
 */
export function useHandResult() {
  /**
   * Record a completed hand result
   * Updates both lifetime statistics and returns the evaluation for session tracking
   */
  const recordHandResult = useCallback(
    (
      gameType: GameType,
      evaluation: HandEvaluation,
      wager: number,
      credits: number
    ) => {
      const stats = getGameStats(gameType);

      // Update hand frequency
      const handFreq = { ...stats.handFrequency };
      if (evaluation.handType !== HandType.None) {
        handFreq[evaluation.handType] =
          (handFreq[evaluation.handType] || 0) + 1;
      }

      // Calculate win/loss streaks
      const won = evaluation.payout > 0;
      const newWinStreak = won ? stats.currentWinStreak + 1 : 0;
      const newLossStreak = !won ? stats.currentLossStreak + 1 : 0;

      // Update game statistics
      updateGameStats(gameType, {
        totalHandsPlayed: stats.totalHandsPlayed + 1,
        totalWins: stats.totalWins + (won ? 1 : 0),
        totalLosses: stats.totalLosses + (!won ? 1 : 0),
        totalCreditsWon: stats.totalCreditsWon + evaluation.payout,
        totalCreditsLost: stats.totalCreditsLost + wager,
        biggestHandWin: Math.max(stats.biggestHandWin, evaluation.payout),
        highestCredits: Math.max(
          stats.highestCredits,
          credits + evaluation.payout
        ),
        handFrequency: handFreq,
        currentWinStreak: newWinStreak,
        currentLossStreak: newLossStreak,
        longestWinStreak: Math.max(stats.longestWinStreak, newWinStreak),
        longestLossStreak: Math.max(stats.longestLossStreak, newLossStreak),
      });
    },
    []
  );

  /**
   * Record a double down attempt
   */
  const recordDoubleDownAttempt = useCallback(
    (
      gameType: GameType,
      won: boolean,
      winAmount?: number,
      doubleDownChain?: number,
      originalCredits?: number
    ) => {
      const stats = getGameStats(gameType);
      const updates: Partial<ReturnType<typeof getGameStats>> = {
        totalDoubleDownsAttempted: stats.totalDoubleDownsAttempted + 1,
      };

      if (won && winAmount !== undefined) {
        updates.totalDoubleDownsWon = stats.totalDoubleDownsWon + 1;

        if (doubleDownChain !== undefined) {
          updates.longestDoubleDownChain = Math.max(
            stats.longestDoubleDownChain,
            doubleDownChain
          );
        }

        updates.biggestDoubleDownWin = Math.max(
          stats.biggestDoubleDownWin,
          winAmount
        );

        if (originalCredits !== undefined) {
          updates.highestCredits = Math.max(
            stats.highestCredits,
            originalCredits + winAmount
          );
        }
      }

      updateGameStats(gameType, updates);
    },
    []
  );

  return {
    recordHandResult,
    recordDoubleDownAttempt,
  };
}

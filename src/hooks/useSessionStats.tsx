import { useState, useCallback } from "react";
import { SessionStats } from "../types/statistics";

/**
 * Custom hook for managing session statistics
 * Consolidates session stats updates that were repeated throughout the provider
 */
export function useSessionStats(initialStats: SessionStats) {
  const [sessionStats, setSessionStats] = useState<SessionStats>(initialStats);

  /**
   * Record a completed hand with its result
   */
  const recordHand = useCallback((payout: number, wager: number) => {
    setSessionStats((prev) => ({
      ...prev,
      handsPlayed: prev.handsPlayed + 1,
      netProfit: prev.netProfit + payout - wager,
      biggestWin: Math.max(prev.biggestWin, payout),
    }));
  }, []);

  /**
   * Increment the double down chain counter
   * Returns the new chain value
   */
  const incrementDoubleDownChain = useCallback((): number => {
    let newChain = 0;
    setSessionStats((prev) => {
      newChain = prev.currentDoubleDownChain + 1;
      return {
        ...prev,
        currentDoubleDownChain: newChain,
      };
    });
    return newChain;
  }, []);

  /**
   * Reset the double down chain to 0
   */
  const resetDoubleDownChain = useCallback(() => {
    setSessionStats((prev) => ({
      ...prev,
      currentDoubleDownChain: 0,
    }));
  }, []);

  /**
   * Update the biggest win in the session
   */
  const updateBiggestWin = useCallback((amount: number) => {
    setSessionStats((prev) => ({
      ...prev,
      biggestWin: Math.max(prev.biggestWin, amount),
    }));
  }, []);

  /**
   * Reset session stats to initial values
   */
  const resetSession = useCallback((startingCredits: number) => {
    setSessionStats({
      handsPlayed: 0,
      netProfit: 0,
      biggestWin: 0,
      currentDoubleDownChain: 0,
      startingCredits,
    });
  }, []);

  return {
    sessionStats,
    recordHand,
    incrementDoubleDownChain,
    resetDoubleDownChain,
    updateBiggestWin,
    resetSession,
  };
}

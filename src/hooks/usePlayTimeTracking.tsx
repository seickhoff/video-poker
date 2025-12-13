import { useRef, useEffect, useCallback } from "react";
import { GameType } from "../types/game";
import { getGameStats, updateGameStats } from "../utils/statistics";

/**
 * Custom hook for tracking session play time
 * Automatically records elapsed time when sessions start and end
 */
export function usePlayTimeTracking(gameType: GameType | null) {
  const sessionStartTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0); // Accumulated paused time

  /**
   * Start tracking time for a new session
   */
  const startTracking = useCallback(() => {
    sessionStartTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
  }, []);

  /**
   * Pause the timer (for when stats modal opens, etc.)
   */
  const pauseTracking = useCallback(() => {
    if (sessionStartTimeRef.current !== null) {
      const now = Date.now();
      const elapsed = now - sessionStartTimeRef.current;
      pausedTimeRef.current += elapsed;
      sessionStartTimeRef.current = now; // Reset start time
    }
  }, []);

  /**
   * Resume the timer (for when stats modal closes, etc.)
   */
  const resumeTracking = useCallback(() => {
    if (sessionStartTimeRef.current !== null) {
      sessionStartTimeRef.current = Date.now();
    }
  }, []);

  /**
   * Stop tracking and save elapsed time to statistics
   */
  const stopTracking = useCallback(() => {
    if (gameType && sessionStartTimeRef.current !== null) {
      const sessionEndTime = Date.now();
      const currentSegmentMs = sessionEndTime - sessionStartTimeRef.current;
      const totalSessionMs = pausedTimeRef.current + currentSegmentMs;
      const sessionDurationSeconds = Math.round(totalSessionMs / 1000);

      const stats = getGameStats(gameType);
      updateGameStats(gameType, {
        totalPlayTimeSeconds: stats.totalPlayTimeSeconds + sessionDurationSeconds,
      });

      sessionStartTimeRef.current = null;
      pausedTimeRef.current = 0;
    }
  }, [gameType]);

  // Cleanup: save play time when component unmounts or game changes
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  /**
   * Get current elapsed time in seconds (without saving)
   */
  const getCurrentElapsedSeconds = useCallback((): number => {
    if (sessionStartTimeRef.current === null) {
      return 0;
    }
    const now = Date.now();
    const currentSegmentMs = now - sessionStartTimeRef.current;
    const totalMs = pausedTimeRef.current + currentSegmentMs;
    return Math.round(totalMs / 1000);
  }, []);

  return {
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    getCurrentElapsedSeconds,
  };
}

import { GameType } from "../types/game";
import {
  GameStatistics,
  GameTypeStats,
  createEmptyGameStats,
} from "../types/statistics";

const STORAGE_KEY = "video-poker-statistics";

// Load all statistics from localStorage
export const loadStatistics = (): GameStatistics => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading statistics:", error);
    return {};
  }
};

// Save all statistics to localStorage
export const saveStatistics = (stats: GameStatistics): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving statistics:", error);
  }
};

// Get stats for a specific game type (creates empty if doesn't exist)
export const getGameStats = (
  gameType: GameType,
  allStats?: GameStatistics
): GameTypeStats => {
  const stats = allStats || loadStatistics();
  if (!stats[gameType]) {
    stats[gameType] = createEmptyGameStats();
    saveStatistics(stats);
  }
  return stats[gameType];
};

// Update stats for a specific game type
export const updateGameStats = (
  gameType: GameType,
  updates: Partial<GameTypeStats>
): void => {
  const allStats = loadStatistics();
  const gameStats = getGameStats(gameType, allStats);

  allStats[gameType] = {
    ...gameStats,
    ...updates,
    lastPlayed: new Date().toISOString(),
  };

  saveStatistics(allStats);
};

// Clear all statistics
export const clearAllStatistics = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Clear statistics for a specific game
export const clearGameStatistics = (gameType: GameType): void => {
  const allStats = loadStatistics();
  delete allStats[gameType];
  saveStatistics(allStats);
};

// Calculate derived statistics
export const calculateWinPercentage = (stats: GameTypeStats): number => {
  if (stats.totalHandsPlayed === 0) return 0;
  return (stats.totalWins / stats.totalHandsPlayed) * 100;
};

export const calculateNetProfit = (stats: GameTypeStats): number => {
  return stats.totalCreditsWon - stats.totalCreditsLost;
};

export const calculateDoubleDownSuccessRate = (
  stats: GameTypeStats
): number => {
  if (stats.totalDoubleDownsAttempted === 0) return 0;
  return (stats.totalDoubleDownsWon / stats.totalDoubleDownsAttempted) * 100;
};

// Get top hand types by frequency
export const getTopHands = (
  stats: GameTypeStats,
  limit: number = 5
): Array<{ handType: string; count: number }> => {
  return Object.entries(stats.handFrequency)
    .map(([handType, count]) => ({ handType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Calculate actual long-term payout percentage (RTP)
// RTP = (Total Credits Won from Hands / Total Credits Wagered) × 100
// This is independent of double down wins/losses
export const calculateActualRTP = (stats: GameTypeStats): number => {
  if (stats.totalCreditsLost === 0) return 0;
  return (stats.totalCreditsWon / stats.totalCreditsLost) * 100;
};

// Format date for display
export const formatLastPlayed = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

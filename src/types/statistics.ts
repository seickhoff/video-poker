export interface HandStats {
  [key: string]: number; // HandType as key, count as value
}

export interface GameTypeStats {
  // High scores
  biggestHandWin: number; // Largest win from a single hand (no double down)
  biggestDoubleDownWin: number; // Largest win after double down(s)
  longestDoubleDownChain: number; // Most consecutive successful double downs
  highestCredits: number; // Peak credit balance
  longestWinStreak: number; // Most consecutive winning hands
  longestLossStreak: number; // Most consecutive losing hands

  // Performance metrics
  totalHandsPlayed: number;
  totalWins: number; // Hands that paid out
  totalLosses: number; // Hands that didn't pay
  totalCreditsWon: number;
  totalCreditsLost: number;
  totalDoubleDownsAttempted: number;
  totalDoubleDownsWon: number;
  currentWinStreak: number; // Current consecutive wins (for tracking)
  currentLossStreak: number; // Current consecutive losses (for tracking)

  // Hand frequency
  handFrequency: HandStats;

  // Session tracking
  lastPlayed: string; // ISO timestamp
  sessionsPlayed: number;
  totalPlayTimeSeconds: number; // Total play time in seconds
}

export interface GameStatistics {
  [key: string]: GameTypeStats; // GameType as key
}

export interface SessionStats {
  handsPlayed: number;
  netProfit: number;
  biggestWin: number;
  currentDoubleDownChain: number;
  startingCredits: number;
}

// Initialize empty stats for a game type
export const createEmptyGameStats = (): GameTypeStats => ({
  biggestHandWin: 0,
  biggestDoubleDownWin: 0,
  longestDoubleDownChain: 0,
  highestCredits: 0,
  longestWinStreak: 0,
  longestLossStreak: 0,
  totalHandsPlayed: 0,
  totalWins: 0,
  totalLosses: 0,
  totalCreditsWon: 0,
  totalCreditsLost: 0,
  totalDoubleDownsAttempted: 0,
  totalDoubleDownsWon: 0,
  currentWinStreak: 0,
  currentLossStreak: 0,
  handFrequency: {},
  lastPlayed: new Date().toISOString(),
  sessionsPlayed: 0,
  totalPlayTimeSeconds: 0,
});

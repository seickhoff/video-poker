/**
 * Centralized game configuration parameters
 */

export const GAME_SETTINGS = {
  /**
   * Default number of credits a player starts with when beginning a new game
   */
  DEFAULT_STARTING_CREDITS: 100,

  /**
   * Default bet amount when starting a new game
   */
  DEFAULT_WAGER: 5,

  /**
   * Minimum bet amount allowed
   */
  MIN_BET: 1,

  /**
   * Maximum bet amount allowed
   */
  MAX_BET: 5,

  /**
   * Whether to enable double down feature
   */
  ENABLE_DOUBLE_DOWN: true,

  /**
   * Whether to enable session statistics tracking
   */
  ENABLE_SESSION_STATS: true,

  /**
   * Whether to enable lifetime statistics tracking
   */
  ENABLE_LIFETIME_STATS: true,

  /**
   * Card reveal animation delay in milliseconds (delay between each card)
   */
  CARD_REVEAL_DELAY_MS: 200,
} as const;

/**
 * Type-safe accessor for game settings
 */
export function getGameSetting<K extends keyof typeof GAME_SETTINGS>(
  key: K
): (typeof GAME_SETTINGS)[K] {
  return GAME_SETTINGS[key];
}

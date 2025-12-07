# Game Configuration

This directory contains centralized configuration files for the video poker game.

## gameSettings.ts

Contains all configurable game parameters in one place.

### Available Settings

- **DEFAULT_STARTING_CREDITS**: Number of credits a player starts with (default: 100)
- **DEFAULT_WAGER**: Default bet amount when starting a new game (default: 5)
- **MIN_BET**: Minimum allowed bet (default: 1)
- **MAX_BET**: Maximum allowed bet (default: 5)
- **ENABLE_DOUBLE_DOWN**: Whether double down feature is enabled (default: true)
- **ENABLE_SESSION_STATS**: Whether session statistics tracking is enabled (default: true)
- **ENABLE_LIFETIME_STATS**: Whether lifetime statistics tracking is enabled (default: true)
- **CARD_REVEAL_DELAY_MS**: Delay in milliseconds between each card reveal animation (default: 100)

### Usage

```typescript
import { GAME_SETTINGS } from "./config/gameSettings";

// Direct access
const credits = GAME_SETTINGS.DEFAULT_STARTING_CREDITS;

// Type-safe accessor
import { getGameSetting } from "./config/gameSettings";
const wager = getGameSetting("DEFAULT_WAGER");
```

### Modifying Settings

To change game settings, simply edit the values in `gameSettings.ts`. All parts of the application that reference these settings will automatically use the new values.

For example, to start with 100 credits instead of 10:

```typescript
export const GAME_SETTINGS = {
  DEFAULT_STARTING_CREDITS: 100,
  // ... other settings
} as const;
```

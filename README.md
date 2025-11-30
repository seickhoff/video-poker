# Video Poker

A suite of Video Poker games built with React and TypeScript, originally ported from Perl.

## Features

- **100 starting credits** - Each new game begins with 100 credits
- **Authentic casino gameplay** - Payout tables and game-play accurately emulate casino video poker machines
- **Double-down feature** - Winners can optionally double-down and try to select a higher card
- **Multiple game variations** - Five classic video poker games to choose from

## Technology Stack

- **React** - JavaScript library for building user interfaces
- **React Router** - Declarative routing for React
- **Bootstrap** - A popular CSS framework for responsive design, styled with react-bootstrap
- **TypeScript** - A statically typed superset of JavaScript
- **Prettier** - Code formatter
- **ESLint** - Linter for maintaining code quality
- **Vite** - A fast build tool and development server

## Installation

To get started with this project, follow the steps below:

1. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
   cd video-poker
   ```

2. Install dependencies using npm:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit [http://localhost:5173](http://localhost:5173) in your browser to play

## How to Play

### Game Basics

1. **Select a Game** - Choose from five video poker variations (see game descriptions below)
2. **Place Your Bet** - Each hand costs 1 credit to play
3. **Deal** - You'll receive 5 cards
4. **Hold Cards** - Select which cards to keep by clicking/tapping them
5. **Draw** - Replace unwanted cards with new ones from the deck
6. **Collect Winnings** - Winning hands pay according to the payout table
7. **Double Down (Optional)** - Winners can risk their winnings to try to select a higher card

### Winning Hands

Winning hands vary by game type but typically include:

- **Royal Flush** - A, K, Q, J, 10 of the same suit
- **Straight Flush** - Five consecutive cards of the same suit
- **Four of a Kind** - Four cards of the same rank
- **Full House** - Three of a kind plus a pair
- **Flush** - Five cards of the same suit
- **Straight** - Five consecutive cards
- **Three of a Kind** - Three cards of the same rank
- **Two Pair** - Two different pairs
- **Jacks or Better** - Pair of Jacks, Queens, Kings, or Aces (in Jacks or Better games)

## Available Scripts

After installing dependencies, you can use the following npm commands:

**`npm run dev`**

- Starts the development server with hot-reloading
- Visit http://localhost:5173 in your browser to see the app

**`npm run build`**

- Builds the app for production by compiling TypeScript files and optimizing the project

**`npm run format`**

- Automatically formats all files in the project using Prettier to ensure consistent code style

**`npm run lint`**

- Runs ESLint to check for any code quality issues in your files and ensures adherence to coding standards

**`npm run preview`**

- Serves the production build locally, simulating the production environment for previewing the final build

**`npm test`**

- Runs the test suite in watch mode with Vitest
- Automatically re-runs tests when files change during development

**`npm run test:run`**

- Runs all tests once without watch mode
- Useful for CI/CD pipelines or quick validation

**`npm run test:ui`**

- Opens the Vitest UI in your browser for an interactive testing experience
- Provides visual feedback and detailed test results

## Game Variations

### Jacks or Better

The original Video Poker game that pays even money on a high pair (Jacks or better). Jacks or Better has become the popular standard from which all other variations have grown. The long-term payout for a machine with this pay table is **99.54%** using optimal strategy.

**Minimum Winning Hand:** Pair of Jacks or better

### Aces and Faces

A Jacks or Better variation that has a higher payout for certain Four-of-a-Kinds. This bonus is partially offset by a lower payout for a Full House or Flush. The long-term payback for this machine is **99.85%**, which is slightly better than Jacks or Better.

**Minimum Winning Hand:** Pair of Jacks or better
**Bonus Payouts:** Enhanced payouts for Four Aces and Four Face Cards (K, Q, J)

### Deuces Wild

In Deuces Wild, all four 2s are wild cards. They can represent any card value or suit that is necessary to complete a winning hand. Since it is easier to get good hands, the payout table has been adjusted from a standard Jacks or Better payout table. Also, because there are four wild cards, new winning hands have been added to the payout table: Four Deuces, Wild Royal Flush and Five of a Kind.

Players using optimal strategy on an original full-pay version of Deuces Wild can expect a long term payout of **100.76%**, which is one of the few games in the casino where the player has an advantage over the house.

**Minimum Winning Hand:** Three of a Kind
**Wild Cards:** All four 2s
**Special Hands:** Four Deuces, Wild Royal Flush, Five of a Kind

### Joker Wild

This game uses a 53-card deck that includes one wild Joker. Joker Wild offers a long-term payback of **100.6%**.

**Minimum Winning Hand:** Pair of Kings or better
**Wild Cards:** One Joker
**Note:** Beware of Joker Wild machines with a minimum paying hand of 2 Pair, these machines offer a long term payback of below 99%

### Double Joker Poker

Double Joker poker uses a 54-card deck which includes two wild Jokers. This game offers a long-term payback of **99.96%** using optimal strategy.

**Minimum Winning Hand:** Pair of Kings or better
**Wild Cards:** Two Jokers

## Testing

This project includes comprehensive unit tests for hand evaluation logic to ensure all poker hands are correctly identified and payouts are accurately calculated.

### Running Tests

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run all tests once
npm run test:run

# Open interactive test UI
npm run test:ui
```

### Test Coverage

The test suite includes 66+ tests covering:

- **All game variations** - Jacks or Better, Aces and Faces, Bonus Poker, Double Bonus, Double Double Bonus, Triple Double Bonus, Deuces Wild, Joker Wild, Double Joker Poker, and Pick-a-Pair Poker
- **All hand types** - Royal Flush, Straight Flush, Four of a Kind (with bonus variants), Full House, Flush, Straight, Three of a Kind, Two Pair, and qualifying pairs
- **Wild card handling** - Deuces Wild and Joker variations with proper wild card substitution
- **Payout calculations** - Including wager multipliers and special max-bet bonuses
- **Edge cases** - Hand ranking priorities, wheel straights (A-5), and kicker requirements

Tests are located in `src/utils/handEvaluator.test.ts` and use Vitest for fast, reliable testing.

## Project Structure

Here's an overview of the directory structure:

```
src/
├── components/            # Reusable UI components
├── context/               # Contexts and providers for game state
├── hooks/                 # Custom hooks
├── pages/                 # Page components for each game variation
├── routes/                # Routing components
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions (card logic, hand evaluation, etc.)
│   ├── handEvaluator.ts      # Core hand evaluation logic
│   ├── handEvaluator.test.ts # Comprehensive test suite
│   └── testHelpers.ts        # Testing utilities
└── assets/                # Images, including card graphics
```

## Credits

Originally created in Perl, now reimagined in React/TypeScript for modern web browsers.

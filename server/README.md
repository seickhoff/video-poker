# Poker Picker WebSocket Server

This is the WebSocket server for the multiplayer Poker Picker game.

## Quick Start

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Run in production
npm start
```

## Environment Variables

Create a `.env` file:

```
PORT=3001
CLIENT_URL=http://localhost:5173
```

For production, set `CLIENT_URL` to your Vercel deployment URL.

## Deployment

See [WEBSOCKET_SETUP.md](../WEBSOCKET_SETUP.md) in the parent directory for detailed deployment instructions.

Recommended platforms:

- Railway (easiest, free tier)
- Render (free tier available)
- Your own VPS

## How It Works

The server manages a single game room where:

- First connected client becomes the host
- All clients receive real-time game state updates
- Only the host can trigger game actions (play, reveal, etc.)
- When host disconnects, the next participant becomes host
- Game state is synchronized across all connected clients

## API Events

### Client → Server

- `join-game` - Join the game with a player name
- `update-config` - Update game configuration (host only)
- `start-game` - Start a new round (host only)
- `reveal-cards` - Reveal all cards and determine winner (host only)
- `start-tiebreaker` - Start a tiebreaker round (host only)
- `new-game` - Reset the game (host only)

### Server → Client

- `role-assigned` - Informs client if they are host
- `game-state-update` - Broadcasts current game state
- `participants-update` - List of all participants
- `error` - Error messages

## Tech Stack

- Express.js
- Socket.IO
- TypeScript
- Node.js

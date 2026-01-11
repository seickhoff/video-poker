# Quick Start Guide - WebSocket Poker Picker

## Local Development

### First Time Setup

1. **Install all dependencies**

   ```bash
   # Install frontend dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

2. **Environment files are already created**
   - `.env` (frontend) - Already configured for local development
   - `server/.env` (server) - Already configured for local development

### Running the Application

**You need TWO terminal windows:**

**Terminal 1 - WebSocket Server:**

```bash
cd server
npm run dev
```

You should see:

```
WebSocket server running on port 3001
Accepting connections from: http://localhost:5173
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

You should see:

```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Testing Multiplayer

1. Open `http://localhost:5173/picker` in your browser
2. Enter a name (e.g., "Alice") - You're now the HOST
3. Open a new incognito/private window or different browser
4. Go to `http://localhost:5173/picker` again
5. Enter a different name (e.g., "Bob") - You're now a PARTICIPANT
6. Switch back to the first window and click "PLAY"
7. Both players should see cards dealt simultaneously!

## Production Deployment

### Step 1: Deploy the WebSocket Server

Choose one of these platforms (Railway is recommended):

#### Option A: Railway (Easiest)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. In settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variable:
   - `CLIENT_URL` = Your Vercel URL (e.g., `https://your-app.vercel.app`)
7. Deploy and copy the generated URL (e.g., `https://your-app.up.railway.app`)

#### Option B: Render

1. Go to [Render.com](https://render.com)
2. Create new "Web Service"
3. Connect your repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variable:
   - `CLIENT_URL` = Your Vercel URL
6. Deploy and copy the URL

### Step 2: Update Vercel

1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add new variable:
   - **Name**: `VITE_SOCKET_URL`
   - **Value**: Your server URL from Step 1
4. Redeploy your Vercel app

### Step 3: Test Production

Visit your Vercel URL at `/picker` and test with multiple devices/browsers!

## Troubleshooting

### Server won't start

- Make sure you're in the `server` directory
- Check that port 3001 isn't already in use
- Run `npm install` again

### Frontend can't connect to server

- Verify the server is running (see Terminal 1)
- Check `.env` file has `VITE_SOCKET_URL=http://localhost:3001`
- Restart the frontend dev server

### CORS errors in browser console

- Check `server/.env` has `CLIENT_URL=http://localhost:5173`
- Restart the server after changing environment variables

### No one becomes host

- Clear browser local storage (DevTools → Application → Local Storage → Clear)
- Refresh the page

## File Structure

```
video-poker/
├── server/              # WebSocket server (NEW)
│   ├── src/
│   │   ├── index.ts    # Main server file
│   │   ├── types.ts    # Event types
│   │   ├── deck.ts     # Deck utilities
│   │   └── handEvaluator.ts
│   ├── package.json
│   └── .env            # Server environment
├── src/
│   ├── hooks/
│   │   └── usePickerSocket.ts  # WebSocket hook (NEW)
│   └── pages/
│       └── Picker.tsx  # Updated component (NEW)
├── .env                # Frontend environment
└── package.json
```

## Commands Reference

### Frontend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Server

```bash
cd server
npm run dev          # Start with auto-reload
npm run build        # Compile TypeScript
npm start            # Run production build
```

## Need More Help?

- See [WEBSOCKET_SETUP.md](WEBSOCKET_SETUP.md) for detailed deployment guide
- See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
- See [server/README.md](server/README.md) for server API documentation

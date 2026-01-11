# WebSocket Poker Picker Setup Guide

This guide will help you deploy the WebSocket server for the Poker Picker game.

## Architecture

- **Frontend**: React app hosted on Vercel (existing)
- **Backend**: Node.js WebSocket server (new - needs deployment)

## Local Development

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SOCKET_URL=http://localhost:3001
```

Create a `.env` file in the `server` directory:

```bash
PORT=3001
CLIENT_URL=http://localhost:5173
```

### 3. Run Both Services

In one terminal, run the frontend:

```bash
npm run dev
```

In another terminal, run the WebSocket server:

```bash
cd server
npm run dev
```

The frontend will be at `http://localhost:5173` and the WebSocket server at `http://localhost:3001`.

## Production Deployment

### Option 1: Deploy Server to Railway (Recommended)

Railway offers a generous free tier and is perfect for WebSocket servers.

1. **Sign up at [Railway](https://railway.app/)**

2. **Create a new project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure the deployment**

   - Set the root directory to `server`
   - Railway will automatically detect the Node.js app

4. **Set environment variables in Railway**

   ```
   PORT=3001
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```

5. **Deploy**

   - Railway will automatically deploy your server
   - You'll get a URL like `https://your-app.up.railway.app`

6. **Update Vercel environment variables**
   - Go to your Vercel project settings
   - Add environment variable:
     ```
     VITE_SOCKET_URL=https://your-app.up.railway.app
     ```
   - Redeploy your Vercel app

### Option 2: Deploy Server to Render

Render also offers a free tier for web services.

1. **Sign up at [Render](https://render.com/)**

2. **Create a new Web Service**

   - Connect your GitHub repository
   - Select the repository

3. **Configure the service**

   - Name: `poker-picker-server`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Set environment variables**

   ```
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```

5. **Deploy**

   - Render will build and deploy your server
   - You'll get a URL like `https://poker-picker-server.onrender.com`

6. **Update Vercel**
   - Add environment variable in Vercel:
     ```
     VITE_SOCKET_URL=https://poker-picker-server.onrender.com
     ```
   - Redeploy

### Option 3: Deploy to Your Own Server

If you have a VPS or server:

1. **SSH into your server**

2. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd video-poker/server
   ```

3. **Install dependencies**

   ```bash
   npm install
   npm run build
   ```

4. **Set up environment variables**

   ```bash
   export PORT=3001
   export CLIENT_URL=https://your-vercel-app.vercel.app
   ```

5. **Run with PM2 (process manager)**

   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name poker-picker
   pm2 save
   pm2 startup
   ```

6. **Configure nginx as a reverse proxy** (optional but recommended)

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Update Vercel environment**
   ```
   VITE_SOCKET_URL=https://your-domain.com
   ```

## How It Works

### Game Flow

1. **First visitor becomes the host**

   - The first person to visit the `/picker` page becomes the host
   - The host sees a "HOST" badge and can control all game actions

2. **Other visitors are participants**

   - They enter their name and automatically join the game
   - They see the same game state as the host but cannot control it

3. **Host controls**

   - Only the host can click the game buttons (Play, Reveal, Tie Breaker, New Game)
   - All participants see the game state update in real-time

4. **Game states synchronized**
   - When the host clicks "Play", all participants see their cards dealt
   - When the host clicks "Reveal", all participants see the results
   - Everything is synchronized via WebSocket

### Features

- ✅ Real-time multiplayer synchronization
- ✅ First visitor becomes host
- ✅ Automatic participant joining
- ✅ Host-only controls
- ✅ No manual CSV input needed
- ✅ All players see the same game state
- ✅ Host badge indicator
- ✅ "YOU" indicator for current player's cards
- ✅ Waiting screen for non-host participants

## Troubleshooting

### CORS Issues

If you see CORS errors:

1. Ensure `CLIENT_URL` in server `.env` matches your Vercel URL exactly
2. Restart the server after changing environment variables

### Connection Failed

If the frontend can't connect:

1. Check that `VITE_SOCKET_URL` in frontend `.env` is correct
2. Verify the server is running and accessible
3. Check browser console for specific error messages

### Host Not Assigned

If no one becomes host:

1. Clear browser local storage
2. Refresh the page
3. Check server logs for connection messages

## Development Tips

- The server logs all connections and disconnections
- Use browser DevTools Network tab to monitor WebSocket messages
- Test with multiple browser windows/tabs to simulate multiple players
- The old Picker component is saved as `Picker.old.tsx` if you need to reference it

## Future Enhancements

Potential improvements:

- Password-protected rooms
- Multiple game rooms
- Player reconnection handling
- Spectator mode
- Game history/replay

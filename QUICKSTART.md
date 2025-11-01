# Jutsu Clash - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- Webcam connected
- Two browser windows/tabs (for testing multiplayer)

## Installation & Setup

### 1. Install All Dependencies

Run these commands from the project root:

```bash
# Install and build shared types
cd shared
npm install
npm run build
cd ..

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Start the Development Servers

**Terminal 1 - Start the Server:**
```bash
cd server
npm run dev
```
You should see:
```
🚀 Jutsu Clash server listening on port 4000
📡 WebSocket server ready for connections
```

**Terminal 2 - Start the Client:**
```bash
cd client
npm run dev
```
You should see:
```
VITE ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 3. Open the Application

1. Open your browser to `http://localhost:5173`
2. Allow webcam access when prompted
3. You should see the main menu

## Testing the Application

### Solo Testing - Training Mode

1. Click **"Training Dojo"** from the main menu
2. Position your hands in front of the webcam
3. Try performing different hand signs
4. The system will recognize your gestures and show accuracy

### Multiplayer Testing

To test multiplayer, you need 2 browser instances:

**Browser Window 1:**
1. Open `http://localhost:5173`
2. Click **"Quick Battle"**
3. Wait for "Searching for opponent..."

**Browser Window 2:**
1. Open `http://localhost:5173` in a new window/tab
2. Click **"Quick Battle"**
3. Both players should be matched and enter battle

**In Battle:**
- Perform hand signs in front of your webcam
- Click jutsu buttons to cast abilities
- Watch your HP and Chakra bars
- Try to defeat your opponent!

## Hand Signs Quick Reference

Practice these in Training Mode:

| Gesture | How to Perform |
|---------|----------------|
| **Rat** | Fingers interlocked, both index fingers pointing up |
| **Ox** | Hands open, all fingers extended horizontally |
| **Tiger** | Fingers interlocked in vertical position |
| **Rabbit** | Right fist placed over left palm |
| **Dragon** | Palms together with fingers spread apart |
| **Snake** | Hands clasped with fingers intertwined |
| **Horse** | Form a triangle with thumbs and index fingers |
| **Ram** | Fingers interlocked, middle and ring fingers up |
| **Monkey** | Both palms stacked together |
| **Bird** | Hands linked with fingers pointed upward |
| **Dog** | Right fist on top of left palm |
| **Boar** | Palms together, fingers pointing forward |

## Troubleshooting

### "Camera not detected"
- Check if your webcam is connected
- Allow camera permissions in your browser
- Try refreshing the page

### "Cannot connect to server"
- Make sure the server is running on port 4000
- Check if `http://localhost:4000` shows server info
- Verify `.env` files are configured correctly

### "Gestures not recognized"
- Ensure good lighting conditions
- Keep hands clearly visible in frame
- Try adjusting webcam angle
- Some gestures may need practice to perform correctly

### "Match not found"
- You need 2 players for matchmaking
- Open 2 browser windows to test locally
- Make sure both players click "Quick Battle"

## Next Steps

- Practice all 12 hand signs in Training Mode
- Learn the different jutsu and their hand sign sequences
- Try ranked matches once comfortable with gestures
- Check the full README.md for advanced features

## Tips for Best Experience

1. **Lighting**: Use well-lit room for better gesture recognition
2. **Camera Position**: Place webcam at eye level
3. **Hand Position**: Keep hands centered in frame
4. **Practice**: Some hand signs require practice to form correctly
5. **Timing**: Perform gestures smoothly but deliberately

## Development Commands

```bash
# Rebuild shared types after changes
cd shared && npm run build

# Start server in development mode
cd server && npm run dev

# Start client in development mode
cd client && npm run dev

# Build for production
cd shared && npm run build
cd server && npm run build
cd client && npm run build
```

## Need Help?

- Check the main README.md for detailed documentation
- Review the project structure in project_structure.md
- Open an issue on GitHub
- Check the browser console for error messages

---

**Happy Battling! 🥋**

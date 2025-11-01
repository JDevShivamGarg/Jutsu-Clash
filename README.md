# Jutsu Clash 🥷

**Real-Time Hand Gesture PvP Battle Game**

A web-based multiplayer game inspired by Naruto's hand signs where players use their webcam to perform hand gestures and cast jutsu in real-time battles.

---

## 🎮 Game Concept

- **Hand Gesture Recognition**: Use your webcam to perform 12 unique hand signs (Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Ram, Monkey, Bird, Dog, Boar)
- **Real-Time PvP Battles**: Fight against other players in real-time using Socket.io
- **13 Unique Jutsu**: Cast powerful abilities with different hand sign sequences
- **Combo System**: Build combo meters for increased damage
- **Battle Mechanics**: HP, Chakra, Shields, Stuns, Critical Hits

---

## 💰 Zero-Cost Development

This project is built entirely with **free and open-source technologies**:

- ✅ **MediaPipe Hands** (Free CDN)
- ✅ **React + TypeScript** (Open source)
- ✅ **Socket.io** (Free for development)
- ✅ **Node.js + Express** (Open source)
- ✅ **Free Deployment Options**: Vercel, Netlify, Railway, Render

**No paid services, APIs, or subscriptions required!**

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- Webcam (for gesture recognition)
- Modern browser (Chrome recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/jutsu-clash.git
cd jutsu-clash
```

2. **Install dependencies**
```bash
# Install shared types
cd shared
npm install
npm run build

# Install client dependencies
cd ../client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Start development servers**

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:3000`

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

4. **Open your browser**
- Navigate to `http://localhost:5173`
- Allow webcam permissions
- Start playing!

---

## 🎯 How to Play

### Training Mode
1. Click **"Training Dojo"** from main menu
2. Wait for camera to initialize (10-15 seconds)
3. Practice making hand signs
4. Get real-time feedback on gesture recognition

### Multiplayer Battle
1. Click **"Quick Battle"** from main menu
2. Open another browser window (or ask a friend)
3. Second player clicks **"Quick Battle"**
4. Both players automatically enter battle
5. Perform hand signs to cast jutsu
6. First player to reduce opponent's HP to 0 wins!

---

## 📁 Project Structure

```
Jutsu-Clash/
├── shared/           # Shared TypeScript types
│   └── src/
│       ├── index.ts       # Core types (BattleState, HandSign, etc.)
│       └── jutsu-data.ts  # Jutsu database
│
├── client/           # React frontend
│   └── src/
│       ├── components/    # UI components
│       ├── contexts/      # React contexts (BattleContext)
│       ├── lib/           # Utilities (socket, gestureRecognizer)
│       └── pages/         # Route pages (MainMenu, Battle, Training)
│
└── server/           # Node.js backend
    └── src/
        ├── services/      # Business logic (BattleManager, Matchmaking)
        └── index.ts       # Express + Socket.io server
```

---

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** (Fast build tool)
- **Tailwind CSS** (Styling)
- **Socket.io Client** (Real-time communication)
- **MediaPipe Hands** (Hand tracking & landmarks)
- **React Router** (Navigation)

### Backend
- **Node.js** v18+
- **Express.js** (HTTP server)
- **Socket.io** (WebSocket server)
- **TypeScript** (Type safety)
- **tsx** (TypeScript execution)

### Development
- **Monorepo** structure
- **ES Modules** (modern JavaScript)
- **Shared Types** across client/server
- **Real-time state synchronization**

---

## 🎮 Game Features

### Currently Implemented ✅
- Real-time multiplayer matchmaking
- Hand gesture recognition (basic pattern matching)
- 12 hand signs (zodiac animals)
- 13 jutsu with unique effects
- Battle system (HP, Chakra, damage)
- Combo system
- Training mode
- Socket.io real-time sync

### In Development 🚧
- Custom ML gesture classifier (improved accuracy)
- User authentication (JWT)
- Database (PostgreSQL + Prisma)
- Player progression & stats
- Leaderboards
- Visual effects for jutsu
- Sound effects

---

## 📝 Available Scripts

### Shared Module
```bash
cd shared
npm run build      # Build TypeScript types
npm run watch      # Watch mode
```

### Client
```bash
cd client
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Server
```bash
cd server
npm run dev        # Start dev server (tsx watch)
npm run build      # Build TypeScript
npm start          # Run production build
```

---

## 🎯 Hand Signs Reference

| Hand Sign | Description |
|-----------|-------------|
| **Rat** | Fingers interlocked, index fingers up |
| **Ox** | Fingers horizontal, palms out |
| **Tiger** | Fingers interlocked vertically |
| **Rabbit** | Right fist over left palm |
| **Dragon** | Palms together, fingers spread |
| **Snake** | Hands clasped, fingers intertwined |
| **Horse** | Index fingers and thumbs form triangle |
| **Ram** | Fingers interlocked, ring/middle fingers up |
| **Monkey** | Hands stacked, palms together |
| **Bird** | Hands linked, fingers pointed up |
| **Dog** | Right fist on left palm |
| **Boar** | Palms together, fingers pointed forward |

---

## 🐛 Known Issues

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed issue tracking and roadmap.

**Current Limitations:**
- Gesture recognition uses basic pattern matching (training ML model coming soon)
- Camera takes 10-15s to load on first visit (models cached after)
- No database yet (in-memory state only)
- Single server instance (no horizontal scaling yet)

---

## 🤝 Contributing

This is a personal learning project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for learning and personal use.

---

## 🔗 Links

- **Documentation**: See [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Issues**: Track known issues and future plans in PROJECT_STATUS.md
- **Tech Stack**: React, TypeScript, Socket.io, MediaPipe, Node.js

---

## 🎯 Learning Goals

This project demonstrates:
- Real-time multiplayer architecture
- WebSocket communication
- Computer vision in the browser
- TypeScript full-stack development
- Monorepo project structure
- Game state management
- Zero-cost deployment strategies

---

**Made with ❤️ using free and open-source technologies**

No paid APIs • No subscriptions • No hidden costs

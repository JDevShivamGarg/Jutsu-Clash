# Jutsu Clash - Real-Time Hand Gesture PvP Battle Game

A web-based multiplayer PvP combat game that uses computer vision to recognize hand gestures (inspired by Naruto's hand signs) as the primary game mechanic. Players perform real-world hand gestures via webcam to cast jutsu (techniques) and battle opponents in real-time.

## Features

- **Real-time Hand Gesture Recognition** using MediaPipe Hands
- **Multiplayer PvP Battles** with matchmaking system
- **12 Hand Signs** from the Naruto zodiac system
- **Multiple Jutsu** with different effects (attack, defense, heal, utility)
- **Training Dojo** to practice hand signs
- **Real-time Battle System** with HP, Chakra, and combo mechanics
- **Responsive UI** built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time communication
- **MediaPipe Hands** for gesture recognition
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Socket.io** for real-time multiplayer
- **TypeScript** for type safety
- **Monorepo structure** with shared types

### Shared
- Centralized TypeScript types and interfaces
- Jutsu database with all abilities

## Project Structure

```
jutsu-clash/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Libraries (socket, gesture recognition)
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/          # Node.js backend
│   ├── src/
│   │   ├── services/      # Battle & matchmaking logic
│   │   ├── controllers/   # API controllers
│   │   └── utils/         # Utility functions
│   └── package.json
├── shared/          # Shared TypeScript types
│   └── src/
│       ├── index.ts       # Type definitions
│       └── jutsu-data.ts  # Jutsu database
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **Webcam** for gesture recognition

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jutsu-clash.git
   cd jutsu-clash
   ```

2. **Install dependencies**

   Install shared module dependencies:
   ```bash
   cd shared
   npm install
   npm run build
   cd ..
   ```

   Install server dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

   Install client dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:4000`

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Open the application**
   - Navigate to `http://localhost:5173` in your browser
   - Allow webcam access when prompted
   - Click "Training Dojo" to practice hand signs
   - Click "Quick Battle" to find a match (requires 2 players)

## How to Play

### Training Mode
1. Click "Training Dojo" from the main menu
2. Practice each of the 12 hand signs
3. The system will recognize your gestures and track accuracy

### Battle Mode
1. Click "Quick Battle" or "Ranked Match"
2. Wait for matchmaking (requires another player)
3. Once matched, perform hand signs to build gesture sequences
4. Click jutsu buttons to cast abilities when you have enough chakra
5. Reduce opponent's HP to zero to win

### Hand Signs (12 Zodiac Signs)

| Sign | Name | Description |
|------|------|-------------|
| 🐀 | Rat | Fingers interlocked, index fingers up |
| 🐂 | Ox | Fingers horizontal, palms out |
| 🐅 | Tiger | Fingers interlocked vertically |
| 🐇 | Rabbit | Right fist over left palm |
| 🐉 | Dragon | Palms together, fingers spread |
| 🐍 | Snake | Hands clasped, fingers intertwined |
| 🐴 | Horse | Index fingers and thumbs form triangle |
| 🐏 | Ram | Fingers interlocked, ring/middle fingers up |
| 🐵 | Monkey | Hands stacked, palms together |
| 🐦 | Bird | Hands linked, fingers pointed up |
| 🐕 | Dog | Right fist on left palm |
| 🐗 | Boar | Palms together, fingers pointed forward |

### Basic Jutsu

| Jutsu | Hand Signs | Effect | Chakra Cost |
|-------|-----------|--------|-------------|
| Fireball | Tiger → Horse → Tiger | 15 damage | 20 |
| Water Wall | Tiger → Bird → Ox | 20 shield | 15 |
| Clone | Ram → Snake → Tiger | Dodge next attack | 25 |
| Lightning Strike | Rabbit → Dog → Monkey | 10 fast damage | 18 |
| Earth Shield | Snake → Ox → Dog → Snake | 30 shield | 30 |

### Advanced Jutsu

| Jutsu | Hand Signs | Effect | Chakra Cost |
|-------|-----------|--------|-------------|
| Rasengan | Ram (hold) | 40 damage | 35 |
| Chidori | Ox → Rabbit → Monkey | 25 damage, pierce shields | 40 |
| Shadow Possession | Rat (hold 2s) | Stun 2 seconds | 45 |
| Healing | Tiger → Ram (hold) | Restore 20 HP | 30 |
| Substitution | Ram → Boar → Ox → Dog → Snake | Teleport dodge + counter | 50 |

## Game Mechanics

### Battle Stats
- **HP (Health Points)**: 100 (default)
- **Chakra**: 100 (regenerates 10/second)
- **Combo Meter**: Increases with successful hits (max 3x)

### Battle Rules
- **Match Duration**: 3 minutes
- **Victory Condition**: Reduce opponent's HP to 0 or have more HP when time expires
- **Gesture Window**: 2 seconds per hand sign
- **Critical Hits**: Perfect timing = 1.5x damage

## Development

### Building for Production

**Build shared module:**
```bash
cd shared
npm run build
```

**Build server:**
```bash
cd server
npm run build
npm start
```

**Build client:**
```bash
cd client
npm run build
npm run preview
```

### Environment Variables

**Client (.env)**
```
VITE_SERVER_URL=http://localhost:4000
```

**Server (.env)**
```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Roadmap

### Phase 1: MVP ✅
- [x] Basic hand tracking implementation
- [x] 12 hand signs recognition
- [x] Core battle system
- [x] Real-time multiplayer
- [x] Matchmaking system
- [x] Training mode

### Phase 2: Core Features (In Progress)
- [ ] Database integration (Prisma + PostgreSQL)
- [ ] User authentication (JWT)
- [ ] User profiles and progression
- [ ] ELO ranking system
- [ ] Leaderboards

### Phase 3: Polish
- [ ] Advanced jutsu combinations
- [ ] Ranked competitive mode
- [ ] Spectator mode
- [ ] Replay system
- [ ] Visual effects and animations
- [ ] Sound effects and music

### Phase 4: Launch
- [ ] Beta testing program
- [ ] Performance optimization
- [ ] Anti-cheat implementation
- [ ] Mobile responsive design
- [ ] Marketing website

## Known Issues

- Gesture recognition accuracy depends on lighting conditions
- Some hand signs may be difficult to distinguish
- Webcam quality affects recognition performance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- Inspired by Naruto's hand sign system
- Built with MediaPipe by Google
- Socket.io for real-time communication

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ by the Jutsu Clash team**

import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { ServerEvent, ClientEvent } from '@jutsu-clash/shared';
import type { MatchmakingRequest, GesturePayload, JutsuCastPayload } from '@jutsu-clash/shared';
import { BattleManager } from './services/BattleManager.js';
import { MatchmakingQueue, createMockPlayerBattleState } from './services/MatchmakingQueue.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Jutsu Clash Server',
    version: '1.0.0',
    status: 'running',
  });
});

// API routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Initialize services
const battleManager = new BattleManager();
const matchmakingQueue = new MatchmakingQueue();

// Handle match found
matchmakingQueue.setOnMatchFound((player1, player2) => {
  const p1State = createMockPlayerBattleState(player1.socketId, 'Player 1', player1.request.elo);
  const p2State = createMockPlayerBattleState(player2.socketId, 'Player 2', player2.request.elo);

  const battle = battleManager.createBattle(p1State, p2State);

  // Notify both players
  io.to(player1.socketId).emit(ServerEvent.MATCH_FOUND, {
    battleId: battle.battleId,
    opponent: p2State,
  });

  io.to(player2.socketId).emit(ServerEvent.MATCH_FOUND, {
    battleId: battle.battleId,
    opponent: p1State,
  });

  // Start battle after 3 seconds
  setTimeout(() => {
    io.to(player1.socketId).emit(ServerEvent.BATTLE_START, battle);
    io.to(player2.socketId).emit(ServerEvent.BATTLE_START, battle);
  }, 3000);
});

// Socket.io connection handling
io.on('connection', (socket: Socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Matchmaking events
  socket.on(ClientEvent.JOIN_MATCHMAKING, (request: MatchmakingRequest) => {
    console.log(`Player ${socket.id} joining matchmaking:`, request);
    request.userId = socket.id;
    matchmakingQueue.joinQueue(socket.id, request);
    socket.emit(ServerEvent.MATCHMAKING_JOINED);
  });

  socket.on(ClientEvent.LEAVE_MATCHMAKING, () => {
    console.log(`Player ${socket.id} leaving matchmaking`);
    matchmakingQueue.leaveQueue(socket.id);
    socket.emit(ServerEvent.MATCHMAKING_LEFT);
  });

  // Battle events
  socket.on(ClientEvent.BATTLE_READY, () => {
    console.log(`Player ${socket.id} is ready for battle`);
  });

  socket.on(ClientEvent.PERFORM_GESTURE, (payload: GesturePayload) => {
    const battle = battleManager.processGesture(payload);
    if (battle) {
      // Broadcast gesture to both players
      io.to(battle.player1.id).emit(ServerEvent.GESTURE_RECOGNIZED, payload);
      io.to(battle.player2.id).emit(ServerEvent.GESTURE_RECOGNIZED, payload);
    }
  });

  socket.on(ClientEvent.CAST_JUTSU, (payload: JutsuCastPayload) => {
    console.log(`Player ${socket.id} casting jutsu:`, payload);
    const result = battleManager.castJutsu(payload);

    if (result) {
      const battle = battleManager.getBattleByPlayer(socket.id);
      if (battle) {
        // Emit jutsu cast event
        io.to(battle.player1.id).emit(ServerEvent.JUTSU_CAST, payload);
        io.to(battle.player2.id).emit(ServerEvent.JUTSU_CAST, payload);

        // Emit jutsu result
        io.to(battle.player1.id).emit(ServerEvent.JUTSU_HIT, result);
        io.to(battle.player2.id).emit(ServerEvent.JUTSU_HIT, result);

        // Send updated battle state
        io.to(battle.player1.id).emit(ServerEvent.BATTLE_UPDATE, battle);
        io.to(battle.player2.id).emit(ServerEvent.BATTLE_UPDATE, battle);
      }
    }
  });

  socket.on(ClientEvent.CANCEL_SEQUENCE, () => {
    const battle = battleManager.getBattleByPlayer(socket.id);
    if (battle) {
      const player = battle.player1.id === socket.id ? battle.player1 : battle.player2;
      if (player) {
        player.gestureSequence = [];
        player.currentGesture = null;
      }
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);

    // Remove from matchmaking
    matchmakingQueue.leaveQueue(socket.id);

    // Handle battle disconnect
    const battle = battleManager.getBattleByPlayer(socket.id);
    if (battle) {
      const opponentId = battle.player1.id === socket.id ? battle.player2.id : battle.player1.id;

      // Notify opponent
      io.to(opponentId).emit(ServerEvent.PLAYER_DISCONNECTED, {
        playerId: socket.id,
      });

      // End battle
      const endPayload = battleManager.endBattle(battle.battleId, opponentId, 'disconnect');
      if (endPayload) {
        io.to(opponentId).emit(ServerEvent.BATTLE_END, endPayload);
      }
    }
  });
});

// Battle update loop
setInterval(() => {
  // Update all active battles
  const activeBattles = new Set<string>();

  io.sockets.sockets.forEach((socket) => {
    const battle = battleManager.getBattleByPlayer(socket.id);
    if (battle && !activeBattles.has(battle.battleId)) {
      activeBattles.add(battle.battleId);
      const updated = battleManager.updateBattle(battle.battleId);

      if (updated) {
        io.to(battle.player1.id).emit(ServerEvent.BATTLE_UPDATE, updated);
        io.to(battle.player2.id).emit(ServerEvent.BATTLE_UPDATE, updated);
      }
    }
  });
}, 1000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Jutsu Clash server listening on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});

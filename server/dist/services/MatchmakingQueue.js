import { MatchmakingMode } from '@jutsu-clash/shared';
import { v4 as uuidv4 } from 'uuid';
export class MatchmakingQueue {
    queues = new Map();
    playerToMode = new Map();
    constructor() {
        // Initialize queues for each mode
        Object.values(MatchmakingMode).forEach((mode) => {
            this.queues.set(mode, []);
        });
        // Start matchmaking loop
        setInterval(() => this.processQueues(), 2000);
    }
    joinQueue(socketId, request) {
        const queue = this.queues.get(request.mode);
        if (!queue)
            return;
        // Remove if already in queue
        this.leaveQueue(socketId);
        const queuedPlayer = {
            socketId,
            request,
            joinedAt: Date.now(),
        };
        queue.push(queuedPlayer);
        this.playerToMode.set(socketId, request.mode);
        console.log(`Player ${socketId} joined ${request.mode} queue. Queue size: ${queue.length}`);
    }
    leaveQueue(socketId) {
        const mode = this.playerToMode.get(socketId);
        if (!mode)
            return;
        const queue = this.queues.get(mode);
        if (queue) {
            const index = queue.findIndex((p) => p.socketId === socketId);
            if (index !== -1) {
                queue.splice(index, 1);
                console.log(`Player ${socketId} left ${mode} queue. Queue size: ${queue.length}`);
            }
        }
        this.playerToMode.delete(socketId);
    }
    processQueues() {
        this.queues.forEach((queue, mode) => {
            while (queue.length >= 2) {
                const player1 = queue.shift();
                let player2;
                if (mode === MatchmakingMode.RANKED) {
                    // ELO-based matching for ranked
                    player2 = this.findRankedMatch(queue, player1);
                }
                else {
                    // Random matching for quick play
                    player2 = queue.shift();
                }
                if (player2) {
                    // Match found - this will be emitted by the server
                    console.log(`Match found: ${player1.socketId} vs ${player2.socketId}`);
                    // Clean up
                    this.playerToMode.delete(player1.socketId);
                    this.playerToMode.delete(player2.socketId);
                    // Emit match found event (will be handled in main server file)
                    this.emitMatchFound(player1, player2);
                }
                else {
                    // Put player1 back in queue
                    queue.unshift(player1);
                    break;
                }
            }
        });
    }
    findRankedMatch(queue, player) {
        const eloDiff = 50; // Maximum ELO difference
        for (let i = 0; i < queue.length; i++) {
            const opponent = queue[i];
            if (opponent && Math.abs(player.request.elo - opponent.request.elo) <= eloDiff) {
                queue.splice(i, 1);
                return opponent;
            }
        }
        return undefined;
    }
    emitMatchFound(player1, player2) {
        // This will be handled by the server
        // Store match info for the server to retrieve
        this.onMatchFoundCallback?.(player1, player2);
    }
    onMatchFoundCallback;
    setOnMatchFound(callback) {
        this.onMatchFoundCallback = callback;
    }
    getQueueSize(mode) {
        return this.queues.get(mode)?.length || 0;
    }
    isInQueue(socketId) {
        return this.playerToMode.has(socketId);
    }
}
export function createMockPlayerBattleState(socketId, username, elo) {
    return {
        id: socketId,
        username: username || `Player_${socketId.slice(0, 4)}`,
        hp: 100,
        maxHp: 100,
        chakra: 100,
        maxChakra: 100,
        level: 1,
        rank: 'Academy Student',
        elo,
        currentGesture: null,
        gestureSequence: [],
        activeEffects: [],
        isStunned: false,
        isShielded: false,
        shieldAmount: 0,
        comboMeter: 1,
        jutsuCooldowns: new Map(),
    };
}
//# sourceMappingURL=MatchmakingQueue.js.map
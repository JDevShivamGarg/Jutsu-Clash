import { MatchmakingMode } from '@jutsu-clash/shared';
import type { MatchmakingRequest, PlayerBattleState, UID } from '@jutsu-clash/shared';
interface QueuedPlayer {
    socketId: UID;
    request: MatchmakingRequest;
    joinedAt: number;
}
export declare class MatchmakingQueue {
    private queues;
    private playerToMode;
    constructor();
    joinQueue(socketId: UID, request: MatchmakingRequest): void;
    leaveQueue(socketId: UID): void;
    private processQueues;
    private findRankedMatch;
    private emitMatchFound;
    private onMatchFoundCallback?;
    setOnMatchFound(callback: (player1: QueuedPlayer, player2: QueuedPlayer) => void): void;
    getQueueSize(mode: MatchmakingMode): number;
    isInQueue(socketId: UID): boolean;
}
export declare function createMockPlayerBattleState(socketId: UID, username: string, elo: number): PlayerBattleState;
export {};
//# sourceMappingURL=MatchmakingQueue.d.ts.map
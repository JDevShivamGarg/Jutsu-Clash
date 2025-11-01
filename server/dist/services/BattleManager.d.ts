import type { BattleState, PlayerBattleState, GesturePayload, JutsuCastPayload, JutsuResultPayload, BattleEndPayload, UID } from '@jutsu-clash/shared';
export declare class BattleManager {
    private battles;
    private playerToBattle;
    createBattle(player1: PlayerBattleState, player2: PlayerBattleState): BattleState;
    getBattle(battleId: UID): BattleState | undefined;
    getBattleByPlayer(playerId: UID): BattleState | undefined;
    processGesture(payload: GesturePayload): BattleState | null;
    castJutsu(payload: JutsuCastPayload): JutsuResultPayload | null;
    updateBattle(battleId: UID): BattleState | null;
    endBattle(battleId: UID, winnerId: UID | null, reason: 'hp_depleted' | 'timeout' | 'forfeit' | 'disconnect'): BattleEndPayload | null;
    private getPlayerInBattle;
}
//# sourceMappingURL=BattleManager.d.ts.map
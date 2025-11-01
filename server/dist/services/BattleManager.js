import { BattleStatus, BattleResult, HandSign, ServerEvent } from '@jutsu-clash/shared';
import { JUTSU_DATABASE, getJutsuById } from '@jutsu-clash/shared/dist/jutsu-data.js';
import { v4 as uuidv4 } from 'uuid';
export class BattleManager {
    battles = new Map();
    playerToBattle = new Map();
    createBattle(player1, player2) {
        const battleId = uuidv4();
        const battle = {
            battleId,
            player1,
            player2,
            status: BattleStatus.STARTING,
            startTime: Date.now(),
            currentTime: Date.now(),
            duration: 180, // 3 minutes
            winner: null,
        };
        this.battles.set(battleId, battle);
        this.playerToBattle.set(player1.id, battleId);
        this.playerToBattle.set(player2.id, battleId);
        // Start battle after 3 seconds
        setTimeout(() => {
            battle.status = BattleStatus.IN_PROGRESS;
            battle.startTime = Date.now();
            this.battles.set(battleId, battle);
        }, 3000);
        return battle;
    }
    getBattle(battleId) {
        return this.battles.get(battleId);
    }
    getBattleByPlayer(playerId) {
        const battleId = this.playerToBattle.get(playerId);
        return battleId ? this.battles.get(battleId) : undefined;
    }
    processGesture(payload) {
        const battle = this.getBattleByPlayer(payload.playerId);
        if (!battle || battle.status !== BattleStatus.IN_PROGRESS)
            return null;
        const player = this.getPlayerInBattle(battle, payload.playerId);
        if (!player || player.isStunned)
            return null;
        // Add gesture to sequence
        player.gestureSequence.push(payload.gesture);
        player.currentGesture = payload.gesture;
        // Keep only last 10 gestures
        if (player.gestureSequence.length > 10) {
            player.gestureSequence = player.gestureSequence.slice(-10);
        }
        this.battles.set(battle.battleId, battle);
        return battle;
    }
    castJutsu(payload) {
        const battle = this.getBattleByPlayer(payload.playerId);
        if (!battle || battle.status !== BattleStatus.IN_PROGRESS)
            return null;
        const caster = this.getPlayerInBattle(battle, payload.playerId);
        const target = this.getPlayerInBattle(battle, payload.targetId);
        if (!caster || !target || caster.isStunned)
            return null;
        const jutsu = getJutsuById(payload.jutsuId);
        if (!jutsu)
            return null;
        // Check if player has enough chakra
        if (caster.chakra < jutsu.chakraCost)
            return null;
        // Deduct chakra
        caster.chakra -= jutsu.chakraCost;
        // Calculate damage/healing
        let damage = jutsu.damage || 0;
        let healing = jutsu.healing || 0;
        let wasCritical = false;
        let wasBlocked = false;
        // Apply combo multiplier
        if (caster.comboMeter > 1) {
            damage = Math.floor(damage * caster.comboMeter);
            wasCritical = true;
        }
        // Check if target has shield
        if (target.isShielded && damage > 0) {
            const shieldDamage = Math.min(target.shieldAmount, damage);
            target.shieldAmount -= shieldDamage;
            damage -= shieldDamage;
            if (target.shieldAmount <= 0) {
                target.isShielded = false;
                target.shieldAmount = 0;
            }
            if (damage === 0) {
                wasBlocked = true;
            }
        }
        // Apply damage
        if (damage > 0) {
            target.hp = Math.max(0, target.hp - damage);
        }
        // Apply healing
        if (healing > 0) {
            caster.hp = Math.min(caster.maxHp, caster.hp + healing);
        }
        // Apply shield
        if (jutsu.shieldAmount) {
            caster.isShielded = true;
            caster.shieldAmount += jutsu.shieldAmount;
        }
        // Apply stun
        if (jutsu.stunDuration) {
            target.isStunned = true;
            setTimeout(() => {
                target.isStunned = false;
            }, jutsu.stunDuration * 1000);
        }
        // Increment combo
        caster.comboMeter = Math.min(3, caster.comboMeter + 0.2);
        // Clear gesture sequence
        caster.gestureSequence = [];
        caster.currentGesture = null;
        // Check for battle end
        if (target.hp <= 0) {
            this.endBattle(battle.battleId, caster.id, 'hp_depleted');
        }
        this.battles.set(battle.battleId, battle);
        const result = {
            jutsuId: jutsu.id,
            casterId: caster.id,
            targetId: target.id,
            damage,
            healing,
            wasCritical,
            wasBlocked,
            resultingHp: target.hp,
            resultingChakra: target.chakra,
        };
        if (jutsu.shieldAmount !== undefined) {
            result.shieldAmount = jutsu.shieldAmount;
        }
        return result;
    }
    updateBattle(battleId) {
        const battle = this.battles.get(battleId);
        if (!battle || battle.status !== BattleStatus.IN_PROGRESS)
            return null;
        const elapsed = (Date.now() - battle.startTime) / 1000;
        battle.currentTime = Date.now();
        // Regenerate chakra (10 per second)
        battle.player1.chakra = Math.min(battle.player1.maxChakra, battle.player1.chakra + 10);
        battle.player2.chakra = Math.min(battle.player2.maxChakra, battle.player2.chakra + 10);
        // Decay combo meter
        battle.player1.comboMeter = Math.max(1, battle.player1.comboMeter - 0.05);
        battle.player2.comboMeter = Math.max(1, battle.player2.comboMeter - 0.05);
        // Check for timeout
        if (elapsed >= battle.duration) {
            const winner = battle.player1.hp > battle.player2.hp
                ? battle.player1.id
                : battle.player2.hp > battle.player1.hp
                    ? battle.player2.id
                    : null;
            this.endBattle(battleId, winner, 'timeout');
        }
        this.battles.set(battleId, battle);
        return battle;
    }
    endBattle(battleId, winnerId, reason) {
        const battle = this.battles.get(battleId);
        if (!battle)
            return null;
        battle.status = BattleStatus.FINISHED;
        battle.winner = winnerId;
        const player1Result = {
            playerId: battle.player1.id,
            result: winnerId === battle.player1.id
                ? BattleResult.WIN
                : winnerId === null
                    ? BattleResult.DRAW
                    : BattleResult.LOSS,
            finalHp: battle.player1.hp,
            damageDealt: 0, // Would track this in a real implementation
            damageTaken: battle.player1.maxHp - battle.player1.hp,
            jutsuCast: 0,
            experienceGained: winnerId === battle.player1.id ? 100 : 50,
            eloChange: winnerId === battle.player1.id ? 25 : -15,
        };
        const player2Result = {
            playerId: battle.player2.id,
            result: winnerId === battle.player2.id
                ? BattleResult.WIN
                : winnerId === null
                    ? BattleResult.DRAW
                    : BattleResult.LOSS,
            finalHp: battle.player2.hp,
            damageDealt: 0,
            damageTaken: battle.player2.maxHp - battle.player2.hp,
            jutsuCast: 0,
            experienceGained: winnerId === battle.player2.id ? 100 : 50,
            eloChange: winnerId === battle.player2.id ? 25 : -15,
        };
        const payload = {
            battleId,
            winner: winnerId,
            reason,
            player1Result,
            player2Result,
        };
        // Clean up
        setTimeout(() => {
            this.battles.delete(battleId);
            this.playerToBattle.delete(battle.player1.id);
            this.playerToBattle.delete(battle.player2.id);
        }, 10000);
        return payload;
    }
    getPlayerInBattle(battle, playerId) {
        if (battle.player1.id === playerId)
            return battle.player1;
        if (battle.player2.id === playerId)
            return battle.player2;
        return null;
    }
}
//# sourceMappingURL=BattleManager.js.map
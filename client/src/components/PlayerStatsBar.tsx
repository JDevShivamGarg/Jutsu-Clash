import React from 'react';
import type { PlayerBattleState } from '@jutsu-clash/shared';

interface PlayerStatsBarProps {
  player: PlayerBattleState;
  isOpponent?: boolean;
}

export function PlayerStatsBar({ player, isOpponent = false }: PlayerStatsBarProps) {
  const hpPercentage = (player.hp / player.maxHp) * 100;
  const chakraPercentage = (player.chakra / player.maxChakra) * 100;

  const getHpColor = () => {
    if (hpPercentage > 60) return 'bg-green-500';
    if (hpPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`${isOpponent ? 'text-right' : 'text-left'}`}>
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-bold">{player.username}</span>
          <span className="text-gray-400 text-sm">Lvl {player.level}</span>
        </div>

        {/* HP Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>HP</span>
            <span>
              {player.hp}/{player.maxHp}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getHpColor()} transition-all duration-300 ease-out`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Chakra Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Chakra</span>
            <span>
              {player.chakra}/{player.maxChakra}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-chakra-500 transition-all duration-300 ease-out"
              style={{ width: `${chakraPercentage}%` }}
            />
          </div>
        </div>

        {/* Active Effects */}
        {player.activeEffects.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {player.activeEffects.map((effect) => (
              <span
                key={effect.effectId}
                className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
              >
                {effect.type}
              </span>
            ))}
          </div>
        )}

        {/* Status Indicators */}
        <div className="mt-2 flex gap-2">
          {player.isStunned && (
            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Stunned</span>
          )}
          {player.isShielded && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              Shield: {player.shieldAmount}
            </span>
          )}
          {player.comboMeter > 0 && (
            <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
              Combo: x{player.comboMeter.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

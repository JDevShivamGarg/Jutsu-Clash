import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBattle } from '../contexts/BattleContext';
import { MatchmakingMode } from '@jutsu-clash/shared';

export function MainMenu() {
  const navigate = useNavigate();
  const { joinMatchmaking } = useBattle();
  const [isSearching, setIsSearching] = useState(false);

  const handleQuickBattle = () => {
    setIsSearching(true);
    joinMatchmaking(MatchmakingMode.QUICK);
    // Simulate matchmaking for now
    setTimeout(() => {
      navigate('/battle');
    }, 2000);
  };

  const handleRankedMatch = () => {
    setIsSearching(true);
    joinMatchmaking(MatchmakingMode.RANKED);
    setTimeout(() => {
      navigate('/battle');
    }, 2000);
  };

  const handleTraining = () => {
    navigate('/training');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-chakra-500 bg-clip-text text-transparent">
            JUTSU CLASH
          </h1>
          <p className="text-xl text-gray-400">Master the hand signs. Defeat your opponents.</p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <button
            onClick={handleQuickBattle}
            disabled={isSearching}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSearching ? 'Searching for opponent...' : 'Quick Battle'}
          </button>

          <button
            onClick={handleRankedMatch}
            disabled={isSearching}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Ranked Match
          </button>

          <button
            onClick={handleTraining}
            className="w-full bg-chakra-600 hover:bg-chakra-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
          >
            Training Dojo
          </button>

          <button
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
            onClick={() => alert('Jutsu Library coming soon!')}
          >
            Jutsu Library
          </button>

          <button
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
            onClick={() => alert('Settings coming soon!')}
          >
            Settings
          </button>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-2">Player Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Level</div>
                <div className="text-2xl font-bold">1</div>
              </div>
              <div>
                <div className="text-gray-400">Rank</div>
                <div className="text-2xl font-bold">Academy Student</div>
              </div>
              <div>
                <div className="text-gray-400">Wins</div>
                <div className="text-2xl font-bold text-green-500">0</div>
              </div>
              <div>
                <div className="text-gray-400">Losses</div>
                <div className="text-2xl font-bold text-red-500">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

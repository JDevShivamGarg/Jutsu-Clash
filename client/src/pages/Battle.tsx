import React, { useEffect, useRef, useState } from 'react';
import { useBattle } from '../contexts/BattleContext';
import { GestureRecognizer } from '../lib/gestureRecognizer';
import type { GestureResult } from '../lib/gestureRecognizer';
import { PlayerStatsBar } from '../components/PlayerStatsBar';
import { GestureSequence } from '../components/GestureSequence';
import { JUTSU_DATABASE } from '@jutsu-clash/shared/dist/jutsu-data.js';

export function Battle() {
  const { battleState, localPlayer, opponent, currentSequence, performGesture, castJutsu } =
    useBattle();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);

  const [isRecognizerReady, setIsRecognizerReady] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const recognizer = new GestureRecognizer();
    recognizerRef.current = recognizer;

    recognizer
      .initialize(videoRef.current, canvasRef.current, handleGestureDetected)
      .then(() => {
        setIsRecognizerReady(true);
        recognizer.start();
      })
      .catch((error) => {
        console.error('Failed to initialize gesture recognizer:', error);
        alert('Failed to access webcam. Please check permissions.');
      });

    return () => {
      recognizer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!battleState) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - battleState.startTime;
      const remaining = Math.max(0, battleState.duration - Math.floor(elapsed / 1000));
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [battleState]);

  const handleGestureDetected = (result: GestureResult) => {
    if (result.gesture && result.confidence > 0.85) {
      performGesture(result.gesture, result.confidence);
    }
  };

  const handleCastJutsu = (jutsuId: string) => {
    castJutsu(jutsuId);
  };

  const getAvailableJutsu = () => {
    if (!localPlayer) return [];
    return JUTSU_DATABASE.filter((jutsu) => jutsu.unlockLevel <= localPlayer.level);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!battleState || !localPlayer || !opponent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Waiting for battle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Player 1 Stats */}
          <PlayerStatsBar player={localPlayer} />

          {/* Timer */}
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500">{formatTime(timeRemaining)}</div>
            <div className="text-sm text-gray-400">Time Remaining</div>
          </div>

          {/* Player 2 Stats */}
          <PlayerStatsBar player={opponent} isOpponent />
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Local Player Video Feed */}
          <div className="relative">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="hidden"
                width="640"
                height="480"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="w-full h-auto" width="640" height="480" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <GestureSequence sequence={currentSequence} />
            </div>
          </div>

          {/* Opponent Placeholder */}
          <div className="relative">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <div className="text-xl text-gray-400">{opponent.username}</div>
              </div>
            </div>
            {opponent.currentGesture && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gray-800 bg-opacity-90 rounded-lg p-3 text-center">
                  <div className="text-3xl">{opponent.currentGesture}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Jutsu Selection */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-bold mb-3">Available Jutsu</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {getAvailableJutsu().map((jutsu) => {
              const canCast = localPlayer.chakra >= jutsu.chakraCost && !localPlayer.isStunned;
              return (
                <button
                  key={jutsu.id}
                  onClick={() => handleCastJutsu(jutsu.id)}
                  disabled={!canCast}
                  className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                    canCast
                      ? 'bg-primary-600 hover:bg-primary-700 hover:scale-105'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  title={jutsu.description}
                >
                  <div className="font-bold mb-1">{jutsu.name}</div>
                  <div className="text-xs text-chakra-300">{jutsu.chakraCost} Chakra</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {jutsu.handSigns.slice(0, 3).join(' → ')}
                    {jutsu.handSigns.length > 3 && '...'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {!isRecognizerReady && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-6 rounded-lg">
          <div className="text-white text-xl">Initializing camera...</div>
        </div>
      )}
    </div>
  );
}

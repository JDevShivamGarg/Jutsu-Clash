import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GestureRecognizer } from '../lib/gestureRecognizer';
import type { GestureResult } from '../lib/gestureRecognizer';
import { HandSign } from '@jutsu-clash/shared';
import { GestureSequence } from '../components/GestureSequence';

const TRAINING_GESTURES = [
  { sign: HandSign.RAT, name: 'Rat', description: 'Fingers interlocked, index fingers up' },
  { sign: HandSign.OX, name: 'Ox', description: 'Fingers horizontal, palms out' },
  { sign: HandSign.TIGER, name: 'Tiger', description: 'Fingers interlocked vertically' },
  { sign: HandSign.RABBIT, name: 'Rabbit', description: 'Right fist over left palm' },
  { sign: HandSign.DRAGON, name: 'Dragon', description: 'Palms together, fingers spread' },
  { sign: HandSign.SNAKE, name: 'Snake', description: 'Hands clasped, fingers intertwined' },
  { sign: HandSign.HORSE, name: 'Horse', description: 'Index fingers and thumbs form triangle' },
  {
    sign: HandSign.RAM,
    name: 'Ram',
    description: 'Fingers interlocked, ring/middle fingers up',
  },
  { sign: HandSign.MONKEY, name: 'Monkey', description: 'Hands stacked, palms together' },
  { sign: HandSign.BIRD, name: 'Bird', description: 'Hands linked, fingers pointed up' },
  { sign: HandSign.DOG, name: 'Dog', description: 'Right fist on left palm' },
  { sign: HandSign.BOAR, name: 'Boar', description: 'Palms together, fingers pointed forward' },
];

export function Training() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);

  const [currentGestureIndex, setCurrentGestureIndex] = useState(0);
  const [detectedGestures, setDetectedGestures] = useState<HandSign[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isRecognizerReady, setIsRecognizerReady] = useState(false);

  const currentTrainingGesture = TRAINING_GESTURES[currentGestureIndex];

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

  const handleGestureDetected = (result: GestureResult) => {
    if (result.gesture && result.confidence > 0.85) {
      setDetectedGestures((prev) => [...prev.slice(-4), result.gesture!]);

      if (result.gesture === currentTrainingGesture.sign) {
        setSuccessCount((prev) => prev + 1);
        setTotalAttempts((prev) => prev + 1);
        setTimeout(() => {
          setCurrentGestureIndex((prev) => (prev + 1) % TRAINING_GESTURES.length);
        }, 1000);
      }
    }
  };

  const accuracy = totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Training Dojo</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            Back to Menu
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm">Successes</div>
            <div className="text-3xl font-bold text-green-500">{successCount}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm">Attempts</div>
            <div className="text-3xl font-bold">{totalAttempts}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-gray-400 text-sm">Accuracy</div>
            <div className="text-3xl font-bold text-blue-500">{accuracy.toFixed(1)}%</div>
          </div>
        </div>

        {/* Main Training Area */}
        <div className="grid grid-cols-2 gap-6">
          {/* Camera Feed */}
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
            <div className="mt-4">
              <GestureSequence sequence={detectedGestures} maxLength={5} />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary-600 to-chakra-600 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Practice This Sign:</h2>
              <div className="text-4xl font-bold mb-2">{currentTrainingGesture.name}</div>
              <p className="text-lg">{currentTrainingGesture.description}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">All Hand Signs</h3>
              <div className="grid grid-cols-2 gap-2">
                {TRAINING_GESTURES.map((gesture, index) => (
                  <div
                    key={gesture.sign}
                    className={`p-2 rounded ${
                      index === currentGestureIndex
                        ? 'bg-primary-600'
                        : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                    }`}
                    onClick={() => setCurrentGestureIndex(index)}
                  >
                    <div className="font-bold">{gesture.name}</div>
                    <div className="text-xs text-gray-400">{gesture.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!isRecognizerReady && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-6 rounded-lg">
            <div className="text-white text-xl">Initializing camera...</div>
          </div>
        )}
      </div>
    </div>
  );
}

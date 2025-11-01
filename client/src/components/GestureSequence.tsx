import React from 'react';
import { HandSign } from '@jutsu-clash/shared';

interface GestureSequenceProps {
  sequence: HandSign[];
  maxLength?: number;
}

const HAND_SIGN_EMOJI: Record<HandSign, string> = {
  [HandSign.RAT]: '🐀',
  [HandSign.OX]: '🐂',
  [HandSign.TIGER]: '🐅',
  [HandSign.RABBIT]: '🐇',
  [HandSign.DRAGON]: '🐉',
  [HandSign.SNAKE]: '🐍',
  [HandSign.HORSE]: '🐴',
  [HandSign.RAM]: '🐏',
  [HandSign.MONKEY]: '🐵',
  [HandSign.BIRD]: '🐦',
  [HandSign.DOG]: '🐕',
  [HandSign.BOAR]: '🐗',
};

export function GestureSequence({ sequence, maxLength = 10 }: GestureSequenceProps) {
  return (
    <div className="bg-gray-800 bg-opacity-90 rounded-lg p-3 min-h-[60px]">
      <div className="text-xs text-gray-400 mb-1">Hand Sign Sequence</div>
      <div className="flex gap-2 items-center">
        {sequence.length === 0 ? (
          <span className="text-gray-500 text-sm">Perform a hand sign...</span>
        ) : (
          sequence.slice(-maxLength).map((sign, index) => (
            <div
              key={`${sign}-${index}`}
              className="text-3xl animate-bounce-slow"
              title={sign.toUpperCase()}
            >
              {HAND_SIGN_EMOJI[sign]}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

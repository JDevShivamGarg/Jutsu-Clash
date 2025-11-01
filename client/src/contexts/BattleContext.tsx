import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HandSign, BattleStatus, ServerEvent, ClientEvent } from '@jutsu-clash/shared';
import type {
  BattleState,
  PlayerBattleState,
  GesturePayload,
  JutsuCastPayload,
  BattleEndPayload,
} from '@jutsu-clash/shared';
import { socketManager } from '../lib/socket';

interface BattleContextType {
  battleState: BattleState | null;
  localPlayer: PlayerBattleState | null;
  opponent: PlayerBattleState | null;
  currentSequence: HandSign[];
  isInBattle: boolean;
  performGesture: (gesture: HandSign, confidence: number) => void;
  castJutsu: (jutsuId: string) => void;
  cancelSequence: () => void;
  joinMatchmaking: (mode: string) => void;
  leaveMatchmaking: () => void;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export function useBattle() {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error('useBattle must be used within BattleProvider');
  }
  return context;
}

interface BattleProviderProps {
  children: ReactNode;
}

export function BattleProvider({ children }: BattleProviderProps) {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [currentSequence, setCurrentSequence] = useState<HandSign[]>([]);

  const localPlayer =
    battleState && localPlayerId
      ? battleState.player1.id === localPlayerId
        ? battleState.player1
        : battleState.player2
      : null;

  const opponent =
    battleState && localPlayerId
      ? battleState.player1.id === localPlayerId
        ? battleState.player2
        : battleState.player1
      : null;

  const isInBattle = battleState?.status === BattleStatus.IN_PROGRESS;

  useEffect(() => {
    const socket = socketManager.getSocket();
    if (!socket) return;

    // Battle events
    socket.on(ServerEvent.BATTLE_START, (battle: BattleState) => {
      console.log('Battle started:', battle);
      setBattleState(battle);
      setLocalPlayerId(socket.id || null);
    });

    socket.on(ServerEvent.BATTLE_UPDATE, (battle: BattleState) => {
      setBattleState(battle);
    });

    socket.on(ServerEvent.BATTLE_END, (payload: BattleEndPayload) => {
      console.log('Battle ended:', payload);
      setTimeout(() => {
        setBattleState(null);
        setCurrentSequence([]);
      }, 5000);
    });

    socket.on(ServerEvent.GESTURE_RECOGNIZED, (payload: GesturePayload) => {
      console.log('Gesture recognized:', payload);
      if (payload.playerId === socket.id) {
        setCurrentSequence((prev) => [...prev, payload.gesture]);
      }
    });

    socket.on(ServerEvent.JUTSU_CAST, (payload: JutsuCastPayload) => {
      console.log('Jutsu cast:', payload);
      setCurrentSequence([]);
    });

    return () => {
      socket.off(ServerEvent.BATTLE_START);
      socket.off(ServerEvent.BATTLE_UPDATE);
      socket.off(ServerEvent.BATTLE_END);
      socket.off(ServerEvent.GESTURE_RECOGNIZED);
      socket.off(ServerEvent.JUTSU_CAST);
    };
  }, []);

  const performGesture = (gesture: HandSign, confidence: number) => {
    const payload: GesturePayload = {
      playerId: localPlayerId || '',
      gesture,
      confidence,
      timestamp: Date.now(),
    };
    socketManager.emit(ClientEvent.PERFORM_GESTURE, payload);
  };

  const castJutsu = (jutsuId: string) => {
    if (!localPlayer || !opponent) return;

    const payload: JutsuCastPayload = {
      playerId: localPlayer.id,
      jutsuId,
      targetId: opponent.id,
      timestamp: Date.now(),
    };
    socketManager.emit(ClientEvent.CAST_JUTSU, payload);
  };

  const cancelSequence = () => {
    setCurrentSequence([]);
    socketManager.emit(ClientEvent.CANCEL_SEQUENCE);
  };

  const joinMatchmaking = (mode: string) => {
    socketManager.emit(ClientEvent.JOIN_MATCHMAKING, { mode });
  };

  const leaveMatchmaking = () => {
    socketManager.emit(ClientEvent.LEAVE_MATCHMAKING);
  };

  const value: BattleContextType = {
    battleState,
    localPlayer,
    opponent,
    currentSequence,
    isInBattle,
    performGesture,
    castJutsu,
    cancelSequence,
    joinMatchmaking,
    leaveMatchmaking,
  };

  return <BattleContext.Provider value={value}>{children}</BattleContext.Provider>;
}

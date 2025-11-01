// ===== Core Types =====
export type UID = string;
export type Timestamp = number;

// ===== Hand Signs =====
export enum HandSign {
  RAT = 'rat',
  OX = 'ox',
  TIGER = 'tiger',
  RABBIT = 'rabbit',
  DRAGON = 'dragon',
  SNAKE = 'snake',
  HORSE = 'horse',
  RAM = 'ram',
  MONKEY = 'monkey',
  BIRD = 'bird',
  DOG = 'dog',
  BOAR = 'boar',
}

// ===== Jutsu Types =====
export enum JutsuType {
  ATTACK = 'attack',
  DEFENSE = 'defense',
  UTILITY = 'utility',
  HEAL = 'heal',
}

export enum JutsuRarity {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  ULTIMATE = 'ultimate',
}

export interface JutsuDefinition {
  id: string;
  name: string;
  handSigns: HandSign[];
  type: JutsuType;
  rarity: JutsuRarity;
  damage?: number;
  healing?: number;
  shieldAmount?: number;
  stunDuration?: number;
  chakraCost: number;
  cooldown: number; // in seconds
  description: string;
  unlockLevel: number;
  castTime?: number; // in seconds
  effectDuration?: number; // in seconds
}

// ===== Player & Battle State =====
export interface PlayerStats {
  id: UID;
  username: string;
  hp: number;
  maxHp: number;
  chakra: number;
  maxChakra: number;
  level: number;
  rank: string;
  elo: number;
}

export interface PlayerBattleState extends PlayerStats {
  currentGesture: HandSign | null;
  gestureSequence: HandSign[];
  activeEffects: ActiveEffect[];
  isStunned: boolean;
  isShielded: boolean;
  shieldAmount: number;
  comboMeter: number;
  jutsuCooldowns: Map<string, number>;
}

export interface ActiveEffect {
  effectId: string;
  type: 'damage_over_time' | 'heal_over_time' | 'shield' | 'stun' | 'buff' | 'debuff';
  value: number;
  duration: number;
  startTime: Timestamp;
}

// ===== Battle System =====
export enum BattleStatus {
  WAITING = 'waiting',
  STARTING = 'starting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  ABANDONED = 'abandoned',
}

export enum BattleResult {
  WIN = 'win',
  LOSS = 'loss',
  DRAW = 'draw',
}

export interface BattleState {
  battleId: UID;
  player1: PlayerBattleState;
  player2: PlayerBattleState;
  status: BattleStatus;
  startTime: Timestamp;
  currentTime: Timestamp;
  duration: number; // 180 seconds (3 minutes)
  winner: UID | null;
}

export interface BattleAction {
  playerId: UID;
  actionType: 'gesture' | 'jutsu' | 'cancel';
  gesture?: HandSign;
  jutsuId?: string;
  timestamp: Timestamp;
}

// ===== Matchmaking =====
export enum MatchmakingMode {
  QUICK = 'quick',
  RANKED = 'ranked',
  PRIVATE = 'private',
  TOURNAMENT = 'tournament',
}

export interface MatchmakingRequest {
  userId: UID;
  mode: MatchmakingMode;
  region: string;
  elo: number;
  roomCode?: string; // for private matches
}

export interface MatchFound {
  battleId: UID;
  opponent: PlayerStats;
  region: string;
}

// ===== User & Progression =====
export interface User {
  id: UID;
  username: string;
  email: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface UserProfile extends User {
  level: number;
  experience: number;
  rank: PlayerRank;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  totalMatches: number;
  unlockedJutsu: string[];
  settings: UserSettings;
}

export enum PlayerRank {
  ACADEMY_STUDENT = 'academy_student',
  GENIN = 'genin',
  CHUNIN = 'chunin',
  JONIN = 'jonin',
  KAGE = 'kage',
}

export interface UserSettings {
  enableSound: boolean;
  enableMusic: boolean;
  enableParticles: boolean;
  gestureConfidenceThreshold: number; // 0.0 - 1.0
  webcamEnabled: boolean;
}

// ===== Network Events =====
export enum ServerEvent {
  // Connection
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',

  // Matchmaking
  MATCHMAKING_JOINED = 'matchmaking:joined',
  MATCHMAKING_LEFT = 'matchmaking:left',
  MATCH_FOUND = 'match:found',
  MATCH_CANCELLED = 'match:cancelled',

  // Battle
  BATTLE_START = 'battle:start',
  BATTLE_UPDATE = 'battle:update',
  BATTLE_ACTION = 'battle:action',
  BATTLE_END = 'battle:end',
  PLAYER_DISCONNECTED = 'player:disconnected',
  PLAYER_RECONNECTED = 'player:reconnected',

  // Gestures & Jutsu
  GESTURE_RECOGNIZED = 'gesture:recognized',
  JUTSU_CAST = 'jutsu:cast',
  JUTSU_HIT = 'jutsu:hit',
  JUTSU_BLOCKED = 'jutsu:blocked',

  // User
  PROFILE_UPDATE = 'profile:update',
  LEVEL_UP = 'level:up',
  JUTSU_UNLOCKED = 'jutsu:unlocked',
}

export enum ClientEvent {
  // Matchmaking
  JOIN_MATCHMAKING = 'matchmaking:join',
  LEAVE_MATCHMAKING = 'matchmaking:leave',

  // Battle
  BATTLE_READY = 'battle:ready',
  PERFORM_GESTURE = 'battle:gesture',
  CAST_JUTSU = 'battle:cast_jutsu',
  CANCEL_SEQUENCE = 'battle:cancel_sequence',

  // User
  UPDATE_SETTINGS = 'user:update_settings',
  REQUEST_PROFILE = 'user:request_profile',
}

// ===== Socket Payloads =====
export interface GesturePayload {
  playerId: UID;
  gesture: HandSign;
  confidence: number;
  timestamp: Timestamp;
}

export interface JutsuCastPayload {
  playerId: UID;
  jutsuId: string;
  targetId: UID;
  timestamp: Timestamp;
}

export interface JutsuResultPayload {
  jutsuId: string;
  casterId: UID;
  targetId: UID;
  damage?: number;
  healing?: number;
  shieldAmount?: number;
  wasCritical: boolean;
  wasBlocked: boolean;
  resultingHp: number;
  resultingChakra: number;
}

export interface BattleEndPayload {
  battleId: UID;
  winner: UID | null;
  reason: 'hp_depleted' | 'timeout' | 'forfeit' | 'disconnect';
  player1Result: BattlePlayerResult;
  player2Result: BattlePlayerResult;
}

export interface BattlePlayerResult {
  playerId: UID;
  result: BattleResult;
  finalHp: number;
  damageDealt: number;
  damageTaken: number;
  jutsuCast: number;
  experienceGained: number;
  eloChange: number;
}

// ===== Authentication =====
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
}

export interface JWTPayload {
  userId: UID;
  email: string;
  iat: number;
  exp: number;
}

// ===== API Response Types =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: UID;
  username: string;
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
}

// ===== Training Mode =====
export interface TrainingExercise {
  id: string;
  name: string;
  description: string;
  targetGesture: HandSign;
  requiredAccuracy: number;
  requiredSuccesses: number;
  rewardExperience: number;
}

export interface TrainingResult {
  exerciseId: string;
  attempts: number;
  successes: number;
  accuracy: number;
  completed: boolean;
  experienceGained: number;
}

export type UID = string;
export type Timestamp = number;
export declare enum HandSign {
    RAT = "rat",
    OX = "ox",
    TIGER = "tiger",
    RABBIT = "rabbit",
    DRAGON = "dragon",
    SNAKE = "snake",
    HORSE = "horse",
    RAM = "ram",
    MONKEY = "monkey",
    BIRD = "bird",
    DOG = "dog",
    BOAR = "boar"
}
export declare enum JutsuType {
    ATTACK = "attack",
    DEFENSE = "defense",
    UTILITY = "utility",
    HEAL = "heal"
}
export declare enum JutsuRarity {
    BASIC = "basic",
    ADVANCED = "advanced",
    ULTIMATE = "ultimate"
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
    cooldown: number;
    description: string;
    unlockLevel: number;
    castTime?: number;
    effectDuration?: number;
}
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
export declare enum BattleStatus {
    WAITING = "waiting",
    STARTING = "starting",
    IN_PROGRESS = "in_progress",
    FINISHED = "finished",
    ABANDONED = "abandoned"
}
export declare enum BattleResult {
    WIN = "win",
    LOSS = "loss",
    DRAW = "draw"
}
export interface BattleState {
    battleId: UID;
    player1: PlayerBattleState;
    player2: PlayerBattleState;
    status: BattleStatus;
    startTime: Timestamp;
    currentTime: Timestamp;
    duration: number;
    winner: UID | null;
}
export interface BattleAction {
    playerId: UID;
    actionType: 'gesture' | 'jutsu' | 'cancel';
    gesture?: HandSign;
    jutsuId?: string;
    timestamp: Timestamp;
}
export declare enum MatchmakingMode {
    QUICK = "quick",
    RANKED = "ranked",
    PRIVATE = "private",
    TOURNAMENT = "tournament"
}
export interface MatchmakingRequest {
    userId: UID;
    mode: MatchmakingMode;
    region: string;
    elo: number;
    roomCode?: string;
}
export interface MatchFound {
    battleId: UID;
    opponent: PlayerStats;
    region: string;
}
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
export declare enum PlayerRank {
    ACADEMY_STUDENT = "academy_student",
    GENIN = "genin",
    CHUNIN = "chunin",
    JONIN = "jonin",
    KAGE = "kage"
}
export interface UserSettings {
    enableSound: boolean;
    enableMusic: boolean;
    enableParticles: boolean;
    gestureConfidenceThreshold: number;
    webcamEnabled: boolean;
}
export declare enum ServerEvent {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
    ERROR = "error",
    MATCHMAKING_JOINED = "matchmaking:joined",
    MATCHMAKING_LEFT = "matchmaking:left",
    MATCH_FOUND = "match:found",
    MATCH_CANCELLED = "match:cancelled",
    BATTLE_START = "battle:start",
    BATTLE_UPDATE = "battle:update",
    BATTLE_ACTION = "battle:action",
    BATTLE_END = "battle:end",
    PLAYER_DISCONNECTED = "player:disconnected",
    PLAYER_RECONNECTED = "player:reconnected",
    GESTURE_RECOGNIZED = "gesture:recognized",
    JUTSU_CAST = "jutsu:cast",
    JUTSU_HIT = "jutsu:hit",
    JUTSU_BLOCKED = "jutsu:blocked",
    PROFILE_UPDATE = "profile:update",
    LEVEL_UP = "level:up",
    JUTSU_UNLOCKED = "jutsu:unlocked"
}
export declare enum ClientEvent {
    JOIN_MATCHMAKING = "matchmaking:join",
    LEAVE_MATCHMAKING = "matchmaking:leave",
    BATTLE_READY = "battle:ready",
    PERFORM_GESTURE = "battle:gesture",
    CAST_JUTSU = "battle:cast_jutsu",
    CANCEL_SEQUENCE = "battle:cancel_sequence",
    UPDATE_SETTINGS = "user:update_settings",
    REQUEST_PROFILE = "user:request_profile"
}
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
//# sourceMappingURL=index.d.ts.map
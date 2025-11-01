// ===== Hand Signs =====
export var HandSign;
(function (HandSign) {
    HandSign["RAT"] = "rat";
    HandSign["OX"] = "ox";
    HandSign["TIGER"] = "tiger";
    HandSign["RABBIT"] = "rabbit";
    HandSign["DRAGON"] = "dragon";
    HandSign["SNAKE"] = "snake";
    HandSign["HORSE"] = "horse";
    HandSign["RAM"] = "ram";
    HandSign["MONKEY"] = "monkey";
    HandSign["BIRD"] = "bird";
    HandSign["DOG"] = "dog";
    HandSign["BOAR"] = "boar";
})(HandSign || (HandSign = {}));
// ===== Jutsu Types =====
export var JutsuType;
(function (JutsuType) {
    JutsuType["ATTACK"] = "attack";
    JutsuType["DEFENSE"] = "defense";
    JutsuType["UTILITY"] = "utility";
    JutsuType["HEAL"] = "heal";
})(JutsuType || (JutsuType = {}));
export var JutsuRarity;
(function (JutsuRarity) {
    JutsuRarity["BASIC"] = "basic";
    JutsuRarity["ADVANCED"] = "advanced";
    JutsuRarity["ULTIMATE"] = "ultimate";
})(JutsuRarity || (JutsuRarity = {}));
// ===== Battle System =====
export var BattleStatus;
(function (BattleStatus) {
    BattleStatus["WAITING"] = "waiting";
    BattleStatus["STARTING"] = "starting";
    BattleStatus["IN_PROGRESS"] = "in_progress";
    BattleStatus["FINISHED"] = "finished";
    BattleStatus["ABANDONED"] = "abandoned";
})(BattleStatus || (BattleStatus = {}));
export var BattleResult;
(function (BattleResult) {
    BattleResult["WIN"] = "win";
    BattleResult["LOSS"] = "loss";
    BattleResult["DRAW"] = "draw";
})(BattleResult || (BattleResult = {}));
// ===== Matchmaking =====
export var MatchmakingMode;
(function (MatchmakingMode) {
    MatchmakingMode["QUICK"] = "quick";
    MatchmakingMode["RANKED"] = "ranked";
    MatchmakingMode["PRIVATE"] = "private";
    MatchmakingMode["TOURNAMENT"] = "tournament";
})(MatchmakingMode || (MatchmakingMode = {}));
export var PlayerRank;
(function (PlayerRank) {
    PlayerRank["ACADEMY_STUDENT"] = "academy_student";
    PlayerRank["GENIN"] = "genin";
    PlayerRank["CHUNIN"] = "chunin";
    PlayerRank["JONIN"] = "jonin";
    PlayerRank["KAGE"] = "kage";
})(PlayerRank || (PlayerRank = {}));
// ===== Network Events =====
export var ServerEvent;
(function (ServerEvent) {
    // Connection
    ServerEvent["CONNECTED"] = "connected";
    ServerEvent["DISCONNECTED"] = "disconnected";
    ServerEvent["ERROR"] = "error";
    // Matchmaking
    ServerEvent["MATCHMAKING_JOINED"] = "matchmaking:joined";
    ServerEvent["MATCHMAKING_LEFT"] = "matchmaking:left";
    ServerEvent["MATCH_FOUND"] = "match:found";
    ServerEvent["MATCH_CANCELLED"] = "match:cancelled";
    // Battle
    ServerEvent["BATTLE_START"] = "battle:start";
    ServerEvent["BATTLE_UPDATE"] = "battle:update";
    ServerEvent["BATTLE_ACTION"] = "battle:action";
    ServerEvent["BATTLE_END"] = "battle:end";
    ServerEvent["PLAYER_DISCONNECTED"] = "player:disconnected";
    ServerEvent["PLAYER_RECONNECTED"] = "player:reconnected";
    // Gestures & Jutsu
    ServerEvent["GESTURE_RECOGNIZED"] = "gesture:recognized";
    ServerEvent["JUTSU_CAST"] = "jutsu:cast";
    ServerEvent["JUTSU_HIT"] = "jutsu:hit";
    ServerEvent["JUTSU_BLOCKED"] = "jutsu:blocked";
    // User
    ServerEvent["PROFILE_UPDATE"] = "profile:update";
    ServerEvent["LEVEL_UP"] = "level:up";
    ServerEvent["JUTSU_UNLOCKED"] = "jutsu:unlocked";
})(ServerEvent || (ServerEvent = {}));
export var ClientEvent;
(function (ClientEvent) {
    // Matchmaking
    ClientEvent["JOIN_MATCHMAKING"] = "matchmaking:join";
    ClientEvent["LEAVE_MATCHMAKING"] = "matchmaking:leave";
    // Battle
    ClientEvent["BATTLE_READY"] = "battle:ready";
    ClientEvent["PERFORM_GESTURE"] = "battle:gesture";
    ClientEvent["CAST_JUTSU"] = "battle:cast_jutsu";
    ClientEvent["CANCEL_SEQUENCE"] = "battle:cancel_sequence";
    // User
    ClientEvent["UPDATE_SETTINGS"] = "user:update_settings";
    ClientEvent["REQUEST_PROFILE"] = "user:request_profile";
})(ClientEvent || (ClientEvent = {}));
//# sourceMappingURL=index.js.map
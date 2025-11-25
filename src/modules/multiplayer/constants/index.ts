/**
 * Multiplayer module constants
 */

/**
 * MULTIPLAYER_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of MULTIPLAYER_CONFIG.
 */
export const MULTIPLAYER_CONFIG = {
  DEFAULT_SERVER_URL: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001',
  DEFAULT_RECONNECT_ATTEMPTS: 5,
  DEFAULT_RECONNECT_DELAY: 1000,
  DEFAULT_HEARTBEAT_INTERVAL: 30000,
  DEFAULT_PING_INTERVAL: 2000,
  DEFAULT_TIMEOUT: 5000,
} as const

/**
 * ROOM_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ROOM_CONFIG.
 */
export const ROOM_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 8,
  DEFAULT_MAX_PLAYERS: 4,
  PASSWORD_MIN_LENGTH: 4,
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 50,
} as const

/**
 * CHAT_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CHAT_CONFIG.
 */
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_MESSAGES_PER_CHANNEL: 100,
  MAX_USERNAME_LENGTH: 20,
} as const

/**
 * MATCHMAKING_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of MATCHMAKING_CONFIG.
 */
export const MATCHMAKING_CONFIG = {
  MAX_RATING_DIFFERENCE: 200,
  RATING_EXPAND_PER_10S: 50,
  MAX_QUEUE_TIME: 300000, // 5 minutes
  MIN_PLAYERS: 2,
  PREFERRED_PLAYERS: 4,
} as const

/**
 * GAME_MODES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAME_MODES.
 */
export const GAME_MODES = {
  CLASSIC: 'classic',
  TIME_ATTACK: 'time_attack',
  SURVIVAL: 'survival',
  TEAM_BATTLE: 'team_battle',
  RACE: 'race',
} as const

/**
 * DIFFICULTY_LEVELS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DIFFICULTY_LEVELS.
 */
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  EXPERT: 'expert',
} as const

/**
 * REGIONS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of REGIONS.
 */
export const REGIONS = {
  NA_EAST: 'na-east',
  NA_WEST: 'na-west',
  EU_WEST: 'eu-west',
  EU_EAST: 'eu-east',
  ASIA: 'asia',
  OCEANIA: 'oceania',
  SA: 'south-america',
} as const

/**
 * WEBSOCKET_EVENTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WEBSOCKET_EVENTS.
 */
export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  RECONNECT: 'reconnect',
  MESSAGE: 'message',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  GAME_STATE_UPDATE: 'game_state_update',
  CHAT_MESSAGE: 'chat_message',
  ROOM_UPDATE: 'room_update',
  MATCH_FOUND: 'match_found',
  PRESENCE_UPDATE: 'presence_update',
} as const

/**
 * LATENCY_THRESHOLDS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LATENCY_THRESHOLDS.
 */
export const LATENCY_THRESHOLDS = {
  EXCELLENT: 50,
  GOOD: 100,
  FAIR: 200,
  POOR: 200,
} as const

/**
 * SYNC_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SYNC_CONFIG.
 */
export const SYNC_CONFIG = {
  TICK_RATE: 60,
  SNAPSHOT_RATE: 20,
  INTERPOLATION_DELAY: 100,
  MAX_SNAPSHOTS: 100,
} as const

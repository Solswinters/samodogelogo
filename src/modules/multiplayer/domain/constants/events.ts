/**
 * Socket event constants for multiplayer
 */

/**
 * SOCKET_EVENTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SOCKET_EVENTS.
 */
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Room management
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_LIST: 'room:list',
  ROOM_UPDATE: 'room:update',

  // Player actions
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',
  PLAYER_READY: 'player:ready',
  PLAYER_JUMP: 'player:jump',
  PLAYER_POSITION: 'player:position',
  PLAYER_SCORE: 'player:score',
  PLAYER_DEATH: 'player:death',

  // Game state
  GAME_START: 'game:start',
  GAME_END: 'game:end',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',

  // Synchronization
  SYNC_OBSTACLES: 'sync:obstacles',
  SYNC_STATE: 'sync:state',

  // Chat
  CHAT_MESSAGE: 'chat:message',
  CHAT_SYSTEM: 'chat:system',
} as const

/**
 * SOCKET_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SOCKET_CONFIG.
 */
export const SOCKET_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000',
  RECONNECTION: true,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  TIMEOUT: 10000,
} as const

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]

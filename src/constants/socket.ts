// Socket.io event type constants

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',

  // Room events
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ROOM_JOINED: 'room-joined',
  ROOM_FULL: 'room-full',
  ROOM_STATE: 'room-state',

  // Player events
  PLAYER_JOINED: 'player-joined',
  PLAYER_LEFT: 'player-left',
  PLAYER_JUMP: 'player-jump',
  PLAYER_JUMPED: 'player-jumped',
  PLAYER_DIED: 'player-died',
  UPDATE_POSITION: 'update-position',
  POSITION_UPDATED: 'position-updated',
  UPDATE_SCORE: 'update-score',
  SCORE_UPDATED: 'score-updated',

  // Game events
  START_GAME: 'start-game',
  GAME_STARTED: 'game-started',
  GAME_OVER: 'game-over',
  SYNC_OBSTACLES: 'sync-obstacles',
  OBSTACLES_SYNCED: 'obstacles-synced',

  // Error events
  ERROR: 'error',
} as const

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]

// Socket connection states
export const SOCKET_STATES = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
} as const

export type SocketState = (typeof SOCKET_STATES)[keyof typeof SOCKET_STATES]

// Socket error codes
export const SOCKET_ERROR_CODES = {
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  INVALID_DATA: 'INVALID_DATA',
  UNAUTHORIZED: 'UNAUTHORIZED',
  TIMEOUT: 'TIMEOUT',
} as const

export type SocketErrorCode = (typeof SOCKET_ERROR_CODES)[keyof typeof SOCKET_ERROR_CODES]

// Socket configuration constants
export const SOCKET_CONFIG = {
  // Reconnection settings
  RECONNECTION: true,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000, // 1 second
  RECONNECTION_DELAY_MAX: 5000, // 5 seconds
  RANDOMIZATION_FACTOR: 0.5,

  // Timeout settings
  CONNECT_TIMEOUT: 10000, // 10 seconds
  TIMEOUT: 20000, // 20 seconds

  // Transport settings
  TRANSPORTS: ['websocket', 'polling'],

  // Ping/Pong settings
  PING_INTERVAL: 25000, // 25 seconds
  PING_TIMEOUT: 5000, // 5 seconds
} as const

// Event payload size limits (in bytes)
export const SOCKET_LIMITS = {
  MAX_PAYLOAD_SIZE: 10240, // 10KB
  MAX_PLAYERS_PER_ROOM: 4,
  MAX_OBSTACLES: 100,
  MAX_MESSAGE_LENGTH: 500,
} as const

// Rate limiting for socket events
export const SOCKET_RATE_LIMITS = {
  POSITION_UPDATE: {
    MAX_PER_SECOND: 60, // 60fps
    BURST_SIZE: 10,
  },
  SCORE_UPDATE: {
    MAX_PER_SECOND: 10,
    BURST_SIZE: 5,
  },
  JUMP: {
    MAX_PER_SECOND: 5,
    BURST_SIZE: 2,
  },
  OBSTACLES_SYNC: {
    MAX_PER_SECOND: 60,
    BURST_SIZE: 10,
  },
} as const


/**
 * Socket.io event name constants
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
  CONNECT_ERROR: 'connect_error',
  RECONNECT: 'reconnect',

  // Room
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ROOM_JOINED: 'room-joined',
  ROOM_LEFT: 'room-left',
  ROOM_FULL: 'room-full',
  ROOM_STATE: 'room-state',

  // Player
  PLAYER_JOINED: 'player-joined',
  PLAYER_LEFT: 'player-left',
  PLAYER_JUMP: 'player-jump',
  PLAYER_JUMPED: 'player-jumped',
  PLAYER_DIED: 'player-died',

  // Game
  START_GAME: 'start-game',
  GAME_STARTED: 'game-started',
  GAME_OVER: 'game-over',

  // Updates
  UPDATE_POSITION: 'update-position',
  POSITION_UPDATED: 'position-updated',
  UPDATE_SCORE: 'update-score',
  SCORE_UPDATED: 'score-updated',
  SYNC_OBSTACLES: 'sync-obstacles',
  OBSTACLES_SYNCED: 'obstacles-synced',

  // Chat
  SEND_MESSAGE: 'send-message',
  MESSAGE_RECEIVED: 'message-received',
} as const

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]

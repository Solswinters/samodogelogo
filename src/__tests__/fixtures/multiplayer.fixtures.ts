export const mockRoomId = 'test-room-123'

export const mockPlayers = [
  {
    id: 'player-1',
    x: 100,
    y: 260,
    velocityY: 0,
    isJumping: false,
    isGrounded: true,
    score: 100,
    isAlive: true,
    color: '#3B82F6',
  },
  {
    id: 'player-2',
    x: 100,
    y: 260,
    velocityY: 0,
    isJumping: false,
    isGrounded: true,
    score: 150,
    isAlive: true,
    color: '#EF4444',
  },
  {
    id: 'player-3',
    x: 100,
    y: 260,
    velocityY: 0,
    isJumping: false,
    isGrounded: true,
    score: 75,
    isAlive: false,
    color: '#10B981',
  },
]

export const mockRoomState = {
  roomId: mockRoomId,
  players: mockPlayers,
  obstacles: [],
  gameStarted: true,
  gameTime: 10000,
  difficulty: 1.5,
}

export const mockSocketEvents = {
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  START_GAME: 'start-game',
  PLAYER_JUMP: 'player-jump',
  PLAYER_DIED: 'player-died',
  UPDATE_POSITION: 'update-position',
  UPDATE_SCORE: 'update-score',
  SYNC_OBSTACLES: 'sync-obstacles',
  GAME_OVER: 'game-over',
}


/**
 * Multiplayer-specific error classes
 */

import { AppError } from '@/shared/error-handler'

export class ConnectionError extends AppError {
  constructor(message: string) {
    super(message, 'CONNECTION_ERROR', 503)
    this.name = 'ConnectionError'
  }
}

export class RoomFullError extends AppError {
  constructor() {
    super('Room is full', 'ROOM_FULL', 400)
    this.name = 'RoomFullError'
  }
}

export class RoomNotFoundError extends AppError {
  constructor(roomId: string) {
    super(`Room ${roomId} not found`, 'ROOM_NOT_FOUND', 404)
    this.name = 'RoomNotFoundError'
  }
}

export class PlayerNotFoundError extends AppError {
  constructor(playerId: string) {
    super(`Player ${playerId} not found`, 'PLAYER_NOT_FOUND', 404)
    this.name = 'PlayerNotFoundError'
  }
}

export class SyncError extends AppError {
  constructor(message: string) {
    super(message, 'SYNC_ERROR', 500)
    this.name = 'SyncError'
  }
}

export class MatchmakingError extends AppError {
  constructor(message: string) {
    super(message, 'MATCHMAKING_ERROR', 500)
    this.name = 'MatchmakingError'
  }
}

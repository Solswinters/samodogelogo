/**
 * Game-specific error classes
 */

import { AppError } from '@/shared/error-handler'

export class GameInitializationError extends AppError {
  constructor(message: string) {
    super(message, 'GAME_INIT_ERROR', 500)
    this.name = 'GameInitializationError'
  }
}

export class GameStateError extends AppError {
  constructor(message: string) {
    super(message, 'GAME_STATE_ERROR', 400)
    this.name = 'GameStateError'
  }
}

export class GameConfigError extends AppError {
  constructor(message: string) {
    super(message, 'GAME_CONFIG_ERROR', 400)
    this.name = 'GameConfigError'
  }
}

export class CollisionDetectionError extends AppError {
  constructor(message: string) {
    super(message, 'COLLISION_ERROR', 500)
    this.name = 'CollisionDetectionError'
  }
}

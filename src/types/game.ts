// Re-export game types from core
export type { Player, Obstacle, GameState } from '@/core/game/types'

export type GameMode = 'menu' | 'single' | 'multi'
export type GameStatus = 'waiting' | 'playing' | 'ended'

export interface GameOverData {
  score: number
  isWinner: boolean
  finalTime: number
  obstaclesCleared: number
}


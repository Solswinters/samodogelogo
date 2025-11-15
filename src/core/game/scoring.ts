import { GAME_CONFIG } from './config'

export function calculateScore(
  gameTime: number,
  obstaclesCleared: number
): number {
  // Score = time survived (in seconds) * 10 + obstacles cleared * 5
  return Math.floor(gameTime / 100) * 10 + obstaclesCleared * 5
}

export function calculateDifficulty(gameTime: number): number {
  const intervals = Math.floor(
    gameTime / GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL
  )
  return 1 + intervals * GAME_CONFIG.DIFFICULTY_MULTIPLIER
}

export function getGameSpeed(
  baseDifficulty: number,
  difficultyMultiplier: number
): number {
  const speed = GAME_CONFIG.INITIAL_GAME_SPEED * (1 + difficultyMultiplier)
  return Math.min(speed, GAME_CONFIG.MAX_GAME_SPEED)
}

export function calculateReward(score: number, isWinner: boolean): number {
  const baseReward = 10
  const scoreBonus = Math.floor(score / 100)
  const winnerMultiplier = isWinner ? 1.5 : 1

  return Math.floor((baseReward + scoreBonus) * winnerMultiplier)
}


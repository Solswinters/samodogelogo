/**
 * Score calculation utilities
 */

import { SCORING, REWARDS } from '../constants'

/**
 * calculateObstaclePoints utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateObstaclePoints.
 */
export function calculateObstaclePoints(comboMultiplier: number = 1): number {
  return Math.floor(SCORING.POINTS_PER_OBSTACLE * comboMultiplier)
}

/**
 * calculateComboMultiplier utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateComboMultiplier.
 */
export function calculateComboMultiplier(currentMultiplier: number): number {
  return Math.min(
    currentMultiplier + SCORING.COMBO_MULTIPLIER_INCREMENT,
    SCORING.MAX_COMBO_MULTIPLIER
  )
}

/**
 * calculateReward utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateReward.
 */
export function calculateReward(score: number, isWinner: boolean = false): number {
  const baseReward = REWARDS.BASE_REWARD
  const scoreBonus = Math.floor(score / REWARDS.SCORE_BONUS_DIVISOR)
  const totalReward = baseReward + scoreBonus

  if (isWinner) {
    return Math.floor(totalReward * REWARDS.MULTIPLAYER_WINNER_MULTIPLIER)
  }

  return totalReward
}

/**
 * formatScore utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatScore.
 */
export function formatScore(score: number): string {
  return score.toLocaleString()
}

/**
 * isHighScore utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isHighScore.
 */
export function isHighScore(score: number, currentHighScore: number): boolean {
  return score > currentHighScore
}

/**
 * calculatePerformanceRating utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculatePerformanceRating.
 */
export function calculatePerformanceRating(score: number, time: number): string {
  const pointsPerSecond = score / (time / 1000)

  if (pointsPerSecond >= 10) {
    return 'S'
  }
  if (pointsPerSecond >= 7) {
    return 'A'
  }
  if (pointsPerSecond >= 5) {
    return 'B'
  }
  if (pointsPerSecond >= 3) {
    return 'C'
  }
  return 'D'
}

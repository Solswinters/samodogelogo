// Game service - business logic for game operations

import { gameLogger as logger } from '@/middleware/logging'

export interface GameResult {
  playerId: string
  address: string
  score: number
  duration: number
  obstacles: number
  isWinner: boolean
  timestamp: number
}

export interface ScoreValidationResult {
  valid: boolean
  reason?: string
  adjustedScore?: number
}

// Validate game score for anti-cheat
/**
 * validateGameScore utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateGameScore.
 */
export function validateGameScore(result: GameResult): ScoreValidationResult {
  const { score, duration, obstacles } = result

  // Minimum game duration check
  if (duration < 5000) {
    // Less than 5 seconds
    return {
      valid: false,
      reason: 'Game duration too short',
    }
  }

  // Maximum score per second check
  const scorePerSecond = (score / duration) * 1000
  if (scorePerSecond > 50) {
    return {
      valid: false,
      reason: `Score per second too high: ${scorePerSecond.toFixed(2)}`,
    }
  }

  // Obstacles vs duration ratio
  const obstaclesPerSecond = (obstacles / duration) * 1000
  if (obstaclesPerSecond > 5) {
    return {
      valid: false,
      reason: `Obstacles per second too high: ${obstaclesPerSecond.toFixed(2)}`,
    }
  }

  // Check score vs obstacles correlation
  const expectedScore = obstacles * 10 // Rough estimate
  if (score > expectedScore * 2) {
    return {
      valid: false,
      reason: 'Score inconsistent with obstacles passed',
    }
  }

  // All checks passed
  return { valid: true }
}

// Calculate reward amount based on score
/**
 * calculateReward utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateReward.
 */
export function calculateReward(score: number, isWinner: boolean): string {
  // Base reward: 0.001 tokens per 100 score points
  const baseReward = score / 100000

  // Winner bonus: 2x multiplier
  const winnerMultiplier = isWinner ? 2 : 1

  // Calculate final reward
  const reward = baseReward * winnerMultiplier

  // Round to 4 decimal places
  return reward.toFixed(4)
}

// Calculate difficulty based on score
/**
 * calculateDifficulty utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateDifficulty.
 */
export function calculateDifficulty(score: number): number {
  // Difficulty increases every 500 points
  const baseDifficulty = 1
  const difficultyIncrease = Math.floor(score / 500) * 0.1

  return Math.min(baseDifficulty + difficultyIncrease, 3) // Max difficulty: 3x
}

// Calculate game speed multiplier
/**
 * calculateGameSpeed utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateGameSpeed.
 */
export function calculateGameSpeed(score: number, difficulty: number): number {
  const baseSpeed = 1
  const scoreMultiplier = 1 + score / 5000 // Increases 0.1x per 500 points
  const difficultyMultiplier = difficulty

  return Math.min(baseSpeed * scoreMultiplier * difficultyMultiplier, 4) // Max speed: 4x
}

// Record game session
/**
 * recordGameSession utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of recordGameSession.
 */
export function recordGameSession(result: GameResult): {
  success: boolean
  sessionId?: string
  error?: string
} {
  try {
    // Validate score
    const validation = validateGameScore(result)

    if (!validation.valid) {
      logger.warn('Invalid game score detected', {
        playerId: result.playerId,
        score: result.score,
        reason: validation.reason,
      })

      return {
        success: false,
        error: validation.reason,
      }
    }

    // TODO: Save to database
    const sessionId = crypto.randomUUID()

    logger.info('Game session recorded', {
      sessionId,
      playerId: result.playerId,
      score: result.score,
    })

    return {
      success: true,
      sessionId,
    }
  } catch (error) {
    logger.error('Failed to record game session', error as Error, {
      playerId: result.playerId,
    })

    return {
      success: false,
      error: 'Failed to record session',
    }
  }
}

// Get player statistics
/**
 * getPlayerStats utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getPlayerStats.
 */
export function getPlayerStats(playerId: string): {
  totalGames: number
  totalScore: number
  highestScore: number
  averageScore: number
  wins: number
  lastPlayed?: Date
} {
  try {
    // TODO: Fetch from database
    // For now, return mock data
    return {
      totalGames: 0,
      totalScore: 0,
      highestScore: 0,
      averageScore: 0,
      wins: 0,
    }
  } catch (error) {
    logger.error('Failed to get player stats', error as Error, { playerId })
    throw error
  }
}

// Update leaderboard
/**
 * updateLeaderboard utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of updateLeaderboard.
 */
export function updateLeaderboard(
  playerId: string,
  address: string,
  score: number
): { success: boolean; rank?: number } {
  try {
    // TODO: Update in database
    // For now, return mock rank
    const rank = Math.floor(Math.random() * 100) + 1

    logger.info('Leaderboard updated', { playerId, score, rank })

    return {
      success: true,
      rank,
    }
  } catch (error) {
    logger.error('Failed to update leaderboard', error as Error, { playerId })
    return { success: false }
  }
}

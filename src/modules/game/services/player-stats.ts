/**
 * Player Statistics Tracking Service
 * Manages player performance metrics and statistics.
 */

import { storage } from '@/utils/storage'
import { logger } from '@/utils/logger'

export interface PlayerStats {
  playerId: string
  totalScore: number
  highScore: number
  gamesPlayed: number
  gamesWon: number
  totalPlayTime: number // in seconds
  obstaclesCleared: number
  totalJumps: number
  perfectGames: number // Games with no collisions
  longestStreak: number
  currentStreak: number
  averageScore: number
  winRate: number
  lastPlayed: number
  firstPlayed: number
}

export interface GameResult {
  score: number
  duration: number
  obstaclesCleared: number
  jumps: number
  isWin: boolean
  isPerfect: boolean
}

const STATS_STORAGE_KEY = 'samodoge_player_stats'

class PlayerStatsService {
  private stats: Map<string, PlayerStats> = new Map()

  constructor() {
    this.loadStats()
  }

  /**
   * Load all player stats from storage.
   */
  private loadStats(): void {
    try {
      const savedStats = storage.get<Record<string, PlayerStats>>(STATS_STORAGE_KEY)
      if (savedStats) {
        Object.entries(savedStats).forEach(([playerId, stats]) => {
          this.stats.set(playerId, stats)
        })
        logger.info('Player stats loaded successfully')
      }
    } catch (error) {
      logger.error('Failed to load player stats from storage', error)
    }
  }

  /**
   * Save all player stats to storage.
   */
  private saveStats(): void {
    try {
      const statsToSave: Record<string, PlayerStats> = {}
      this.stats.forEach((stats, playerId) => {
        statsToSave[playerId] = stats
      })
      storage.set(STATS_STORAGE_KEY, statsToSave)
      logger.debug('Player stats saved successfully')
    } catch (error) {
      logger.error('Failed to save player stats', error)
    }
  }

  /**
   * Initialize stats for a new player.
   * @param playerId The player's ID.
   * @returns The initialized player stats.
   */
  private initializeStats(playerId: string): PlayerStats {
    const now = Date.now()
    return {
      playerId,
      totalScore: 0,
      highScore: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      totalPlayTime: 0,
      obstaclesCleared: 0,
      totalJumps: 0,
      perfectGames: 0,
      longestStreak: 0,
      currentStreak: 0,
      averageScore: 0,
      winRate: 0,
      lastPlayed: now,
      firstPlayed: now,
    }
  }

  /**
   * Get stats for a specific player.
   * @param playerId The player's ID.
   * @returns The player's stats.
   */
  getStats(playerId: string): PlayerStats {
    let stats = this.stats.get(playerId)
    if (!stats) {
      stats = this.initializeStats(playerId)
      this.stats.set(playerId, stats)
      this.saveStats()
    }
    return { ...stats }
  }

  /**
   * Update player stats after a game.
   * @param playerId The player's ID.
   * @param result The game result.
   */
  updateStats(playerId: string, result: GameResult): void {
    let stats = this.stats.get(playerId)
    if (!stats) {
      stats = this.initializeStats(playerId)
    }

    // Update basic stats
    stats.gamesPlayed++
    stats.totalScore += result.score
    stats.totalPlayTime += result.duration
    stats.obstaclesCleared += result.obstaclesCleared
    stats.totalJumps += result.jumps
    stats.lastPlayed = Date.now()

    // Update high score
    if (result.score > stats.highScore) {
      stats.highScore = result.score
      logger.info(`New high score for ${playerId}: ${result.score}`)
    }

    // Update win stats
    if (result.isWin) {
      stats.gamesWon++
      stats.currentStreak++
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak
      }
    } else {
      stats.currentStreak = 0
    }

    // Update perfect games
    if (result.isPerfect) {
      stats.perfectGames++
    }

    // Calculate derived stats
    stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed)
    stats.winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0

    this.stats.set(playerId, stats)
    this.saveStats()

    logger.info(`Updated stats for player ${playerId}`, {
      gamesPlayed: stats.gamesPlayed,
      highScore: stats.highScore,
      winRate: stats.winRate.toFixed(2),
    })
  }

  /**
   * Get all players' stats sorted by a specific metric.
   * @param sortBy The metric to sort by.
   * @param limit Optional limit of results.
   * @returns Array of sorted player stats.
   */
  getAllStats(sortBy: keyof PlayerStats = 'highScore', limit?: number): PlayerStats[] {
    const allStats = Array.from(this.stats.values())
    const sorted = allStats.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue // Descending order
      }
      return 0
    })

    return limit ? sorted.slice(0, limit) : sorted
  }

  /**
   * Get player's ranking for a specific metric.
   * @param playerId The player's ID.
   * @param metric The metric to rank by.
   * @returns The player's rank (1-indexed) or null if not found.
   */
  getPlayerRank(playerId: string, metric: keyof PlayerStats = 'highScore'): number | null {
    const sorted = this.getAllStats(metric)
    const index = sorted.findIndex(s => s.playerId === playerId)
    return index >= 0 ? index + 1 : null
  }

  /**
   * Compare two players' stats.
   * @param playerId1 First player's ID.
   * @param playerId2 Second player's ID.
   * @returns Comparison object with differences.
   */
  compareStats(playerId1: string, playerId2: string): Partial<Record<keyof PlayerStats, number>> {
    const stats1 = this.getStats(playerId1)
    const stats2 = this.getStats(playerId2)

    return {
      totalScore: stats1.totalScore - stats2.totalScore,
      highScore: stats1.highScore - stats2.highScore,
      gamesPlayed: stats1.gamesPlayed - stats2.gamesPlayed,
      gamesWon: stats1.gamesWon - stats2.gamesWon,
      winRate: stats1.winRate - stats2.winRate,
      averageScore: stats1.averageScore - stats2.averageScore,
    }
  }

  /**
   * Reset stats for a specific player.
   * @param playerId The player's ID.
   */
  resetStats(playerId: string): void {
    const stats = this.initializeStats(playerId)
    this.stats.set(playerId, stats)
    this.saveStats()
    logger.info(`Reset stats for player ${playerId}`)
  }

  /**
   * Reset all player stats.
   */
  resetAllStats(): void {
    this.stats.clear()
    this.saveStats()
    logger.info('All player stats reset')
  }

  /**
   * Export stats for a player as JSON.
   * @param playerId The player's ID.
   * @returns JSON string of player stats.
   */
  exportStats(playerId: string): string {
    const stats = this.getStats(playerId)
    return JSON.stringify(stats, null, 2)
  }

  /**
   * Get aggregated stats across all players.
   * @returns Aggregated statistics.
   */
  getAggregatedStats(): {
    totalPlayers: number
    totalGamesPlayed: number
    totalPlayTime: number
    averageGamesPerPlayer: number
    topScore: number
    totalObstaclesCleared: number
  } {
    const allStats = Array.from(this.stats.values())

    if (allStats.length === 0) {
      return {
        totalPlayers: 0,
        totalGamesPlayed: 0,
        totalPlayTime: 0,
        averageGamesPerPlayer: 0,
        topScore: 0,
        totalObstaclesCleared: 0,
      }
    }

    return {
      totalPlayers: allStats.length,
      totalGamesPlayed: allStats.reduce((sum, s) => sum + s.gamesPlayed, 0),
      totalPlayTime: allStats.reduce((sum, s) => sum + s.totalPlayTime, 0),
      averageGamesPerPlayer: Math.round(
        allStats.reduce((sum, s) => sum + s.gamesPlayed, 0) / allStats.length
      ),
      topScore: Math.max(...allStats.map(s => s.highScore)),
      totalObstaclesCleared: allStats.reduce((sum, s) => sum + s.obstaclesCleared, 0),
    }
  }

  /**
   * Check if a player has achieved a new milestone.
   * @param playerId The player's ID.
   * @returns Array of achieved milestones.
   */
  checkMilestones(playerId: string): string[] {
    const stats = this.getStats(playerId)
    const milestones: string[] = []

    const milestoneChecks = [
      { condition: stats.gamesPlayed === 1, message: 'First game played!' },
      { condition: stats.gamesPlayed === 10, message: 'Played 10 games!' },
      { condition: stats.gamesPlayed === 50, message: 'Played 50 games!' },
      { condition: stats.gamesPlayed === 100, message: 'Century of games!' },
      { condition: stats.highScore >= 1000, message: 'Score over 1000!' },
      { condition: stats.highScore >= 5000, message: 'Score over 5000!' },
      { condition: stats.highScore >= 10000, message: 'Score over 10000!' },
      { condition: stats.perfectGames === 1, message: 'First perfect game!' },
      { condition: stats.perfectGames === 10, message: '10 perfect games!' },
      { condition: stats.longestStreak === 5, message: '5-game win streak!' },
      { condition: stats.longestStreak === 10, message: '10-game win streak!' },
      { condition: stats.winRate >= 50 && stats.gamesPlayed >= 10, message: '50% win rate!' },
      { condition: stats.winRate >= 75 && stats.gamesPlayed >= 10, message: '75% win rate!' },
      { condition: stats.obstaclesCleared >= 100, message: '100 obstacles cleared!' },
      { condition: stats.obstaclesCleared >= 1000, message: '1000 obstacles cleared!' },
    ]

    milestoneChecks.forEach(check => {
      if (check.condition) {
        milestones.push(check.message)
      }
    })

    return milestones
  }
}

/**
 * playerStatsService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of playerStatsService.
 */
export const playerStatsService = new PlayerStatsService()

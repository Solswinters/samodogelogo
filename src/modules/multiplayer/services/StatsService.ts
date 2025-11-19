/**
 * Player statistics service
 */

import type { MultiplayerStats } from '../types'

export class StatsService {
  private stats = new Map<string, MultiplayerStats>()

  /**
   * Initialize stats for player
   */
  initializeStats(playerId: string): MultiplayerStats {
    const stats: MultiplayerStats = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      averageScore: 0,
      totalPlayTime: 0,
    }

    this.stats.set(playerId, stats)
    return stats
  }

  /**
   * Get player stats
   */
  getStats(playerId: string): MultiplayerStats | undefined {
    return this.stats.get(playerId)
  }

  /**
   * Record game result
   */
  recordGame(
    playerId: string,
    result: 'win' | 'loss' | 'draw',
    score: number,
    playTime: number
  ): void {
    let stats = this.stats.get(playerId)
    if (!stats) {
      stats = this.initializeStats(playerId)
    }

    stats.gamesPlayed++
    stats.totalPlayTime += playTime

    switch (result) {
      case 'win':
        stats.wins++
        break
      case 'loss':
        stats.losses++
        break
      case 'draw':
        stats.draws++
        break
    }

    // Calculate win rate
    const totalGames = stats.wins + stats.losses
    stats.winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0

    // Update average score
    const previousTotal = stats.averageScore * (stats.gamesPlayed - 1)
    stats.averageScore = (previousTotal + score) / stats.gamesPlayed

    this.stats.set(playerId, stats)
  }

  /**
   * Update playtime
   */
  updatePlayTime(playerId: string, additionalTime: number): void {
    const stats = this.stats.get(playerId)
    if (stats) {
      stats.totalPlayTime += additionalTime
    }
  }

  /**
   * Clear player stats
   */
  clearStats(playerId: string): void {
    this.stats.delete(playerId)
  }

  /**
   * Get all stats
   */
  getAllStats(): Map<string, MultiplayerStats> {
    return new Map(this.stats)
  }
}

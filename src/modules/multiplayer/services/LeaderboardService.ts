/**
 * Leaderboard service
 */

import type { Leaderboard, LeaderboardEntry, MultiplayerStats } from '../types'

export class LeaderboardService {
  private leaderboards = new Map<string, Leaderboard>()

  /**
   * Update leaderboard
   */
  updateLeaderboard(
    period: 'daily' | 'weekly' | 'monthly' | 'allTime',
    entries: LeaderboardEntry[]
  ): void {
    const leaderboard: Leaderboard = {
      period,
      entries: entries
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })),
      updatedAt: Date.now(),
    }

    this.leaderboards.set(period, leaderboard)
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'allTime'): Leaderboard | undefined {
    return this.leaderboards.get(period)
  }

  /**
   * Get player rank
   */
  getPlayerRank(
    period: 'daily' | 'weekly' | 'monthly' | 'allTime',
    playerId: string
  ): number | null {
    const leaderboard = this.leaderboards.get(period)
    if (!leaderboard) return null

    const entry = leaderboard.entries.find(e => e.playerId === playerId)
    return entry?.rank ?? null
  }

  /**
   * Get top players
   */
  getTopPlayers(
    period: 'daily' | 'weekly' | 'monthly' | 'allTime',
    limit = 10
  ): LeaderboardEntry[] {
    const leaderboard = this.leaderboards.get(period)
    if (!leaderboard) return []

    return leaderboard.entries.slice(0, limit)
  }

  /**
   * Get players around rank
   */
  getPlayersAroundRank(
    period: 'daily' | 'weekly' | 'monthly' | 'allTime',
    rank: number,
    range = 5
  ): LeaderboardEntry[] {
    const leaderboard = this.leaderboards.get(period)
    if (!leaderboard) return []

    const start = Math.max(0, rank - range - 1)
    const end = Math.min(leaderboard.entries.length, rank + range)

    return leaderboard.entries.slice(start, end)
  }
}

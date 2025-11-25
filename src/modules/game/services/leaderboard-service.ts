/**
 * Leaderboard service for game rankings
 */

export interface LeaderboardEntry {
  rank: number
  playerAddress: string
  score: number
  gamesPlayed: number
  totalClaimed: number
  timestamp: number
}

export interface LeaderboardFilters {
  timeframe?: 'daily' | 'weekly' | 'alltime'
  limit?: number
  offset?: number
}

class LeaderboardService {
  private entries: Map<string, LeaderboardEntry> = new Map()

  updateScore(playerAddress: string, score: number): void {
    const entry = this.entries.get(playerAddress)

    if (!entry) {
      this.entries.set(playerAddress, {
        rank: 0,
        playerAddress,
        score,
        gamesPlayed: 1,
        totalClaimed: 0,
        timestamp: Date.now(),
      })
    } else if (score > entry.score) {
      entry.score = score
      entry.gamesPlayed++
      entry.timestamp = Date.now()
      this.entries.set(playerAddress, entry)
    } else {
      entry.gamesPlayed++
      this.entries.set(playerAddress, entry)
    }

    this.recalculateRanks()
  }

  getLeaderboard(filters: LeaderboardFilters = {}): LeaderboardEntry[] {
    const { limit = 100, offset = 0 } = filters

    const sorted = Array.from(this.entries.values())
      .sort((a, b) => b.score - a.score)
      .slice(offset, offset + limit)

    return sorted
  }

  getPlayerRank(playerAddress: string): number | null {
    const entry = this.entries.get(playerAddress)
    return entry ? entry.rank : null
  }

  getPlayerStats(playerAddress: string): LeaderboardEntry | null {
    return this.entries.get(playerAddress) ?? null
  }

  private recalculateRanks(): void {
    const sorted = Array.from(this.entries.values()).sort((a, b) => b.score - a.score)

    sorted.forEach((entry, index) => {
      entry.rank = index + 1
      this.entries.set(entry.playerAddress, entry)
    })
  }

  getTotalPlayers(): number {
    return this.entries.size
  }

  getAverageScore(): number {
    if (this.entries.size === 0) {
      return 0
    }

    const totalScore = Array.from(this.entries.values()).reduce(
      (sum, entry) => sum + entry.score,
      0
    )

    return totalScore / this.entries.size
  }

  getTopScore(): number {
    if (this.entries.size === 0) {
      return 0
    }

    return Math.max(...Array.from(this.entries.values()).map((e) => e.score))
  }
}

/**
 * leaderboardService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of leaderboardService.
 */
export const leaderboardService = new LeaderboardService()

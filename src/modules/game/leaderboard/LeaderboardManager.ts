/**
 * Advanced leaderboard management system with persistence and statistics
 */

export interface LeaderboardEntry {
  id: string
  playerName: string
  walletAddress?: string
  score: number
  distance?: number
  time?: number
  coins?: number
  achievements?: string[]
  mode: string
  difficulty?: string
  timestamp: number
  isPlayer?: boolean
  metadata?: Record<string, any>
}

export interface PlayerStats {
  playerId: string
  playerName: string
  totalGames: number
  bestScore: number
  totalScore: number
  averageScore: number
  bestRank: number
  currentStreak: number
  longestStreak: number
  lastPlayedAt: number
  achievements: string[]
}

export interface LeaderboardFilter {
  mode?: string
  difficulty?: string
  startDate?: number
  endDate?: number
  minScore?: number
  maxScore?: number
}

export interface LeaderboardStats {
  totalEntries: number
  averageScore: number
  highestScore: number
  lowestScore: number
  entriesThisWeek: number
  topPlayer: string | null
}

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'alltime'

export class LeaderboardManager {
  private entries: LeaderboardEntry[] = []
  private playerStats: Map<string, PlayerStats> = new Map()
  private maxEntries: number = 100
  private storageKey: string = 'game-leaderboard'
  private statsStorageKey: string = 'game-player-stats'

  constructor(maxEntries: number = 100) {
    this.maxEntries = maxEntries
    this.loadFromStorage()
  }

  /**
   * Add a new leaderboard entry
   */
  addEntry(entry: Omit<LeaderboardEntry, 'id'>): string {
    const id = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const newEntry: LeaderboardEntry = {
      ...entry,
      id,
      timestamp: entry.timestamp || Date.now(),
    }

    this.entries.push(newEntry)
    this.sortEntries()

    // Keep only top entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries)
    }

    // Update player stats
    this.updatePlayerStats(newEntry)

    // Save to storage
    this.saveToStorage()

    return id
  }

  /**
   * Sort entries by score (descending)
   */
  private sortEntries(): void {
    this.entries.sort((a, b) => b.score - a.score)
  }

  /**
   * Get top entries
   */
  getTopEntries(count: number = 10): LeaderboardEntry[] {
    return this.entries.slice(0, count)
  }

  /**
   * Get entries by mode
   */
  getEntriesByMode(mode: string, count: number = 10): LeaderboardEntry[] {
    return this.entries.filter((e) => e.mode === mode).slice(0, count)
  }

  /**
   * Get entries by time range
   */
  getEntriesByTimeRange(range: TimeRange, count: number = 10): LeaderboardEntry[] {
    const now = Date.now()
    const cutoffTime = this.getTimeRangeCutoff(range, now)

    return this.entries.filter((e) => e.timestamp >= cutoffTime).slice(0, count)
  }

  /**
   * Get entries with filter
   */
  getEntriesWithFilter(filter: LeaderboardFilter, count: number = 10): LeaderboardEntry[] {
    let filtered = this.entries

    if (filter.mode) {
      filtered = filtered.filter((e) => e.mode === filter.mode)
    }

    if (filter.difficulty) {
      filtered = filtered.filter((e) => e.difficulty === filter.difficulty)
    }

    if (filter.startDate) {
      filtered = filtered.filter((e) => e.timestamp >= filter.startDate!)
    }

    if (filter.endDate) {
      filtered = filtered.filter((e) => e.timestamp <= filter.endDate!)
    }

    if (filter.minScore !== undefined) {
      filtered = filtered.filter((e) => e.score >= filter.minScore!)
    }

    if (filter.maxScore !== undefined) {
      filtered = filtered.filter((e) => e.score <= filter.maxScore!)
    }

    return filtered.slice(0, count)
  }

  /**
   * Get player rank by score
   */
  getPlayerRank(score: number, mode?: string): number {
    const entries = mode ? this.entries.filter((e) => e.mode === mode) : this.entries

    const rank = entries.findIndex((e) => score > e.score)
    return rank === -1 ? entries.length + 1 : rank + 1
  }

  /**
   * Get entries near a specific rank
   */
  getNearbyRanks(rank: number, range: number = 5): LeaderboardEntry[] {
    const startIndex = Math.max(0, rank - range - 1)
    const endIndex = Math.min(this.entries.length, rank + range)
    return this.entries.slice(startIndex, endIndex)
  }

  /**
   * Check if score qualifies as top score
   */
  isTopScore(score: number, topCount: number = 10): boolean {
    if (this.entries.length < topCount) {
      return true
    }

    const topEntries = this.getTopEntries(topCount)
    const lowestTop = topEntries[topEntries.length - 1]
    return !lowestTop || score > lowestTop.score
  }

  /**
   * Get player's best entry
   */
  getPlayerBest(playerId: string): LeaderboardEntry | null {
    const playerEntries = this.entries.filter(
      (e) => e.walletAddress === playerId || e.playerName === playerId
    )
    return playerEntries.length > 0 ? playerEntries[0] : null
  }

  /**
   * Get player's all entries
   */
  getPlayerEntries(playerId: string): LeaderboardEntry[] {
    return this.entries.filter((e) => e.walletAddress === playerId || e.playerName === playerId)
  }

  /**
   * Update player statistics
   */
  private updatePlayerStats(entry: LeaderboardEntry): void {
    const playerId = entry.walletAddress || entry.playerName
    let stats = this.playerStats.get(playerId)

    if (!stats) {
      stats = {
        playerId,
        playerName: entry.playerName,
        totalGames: 0,
        bestScore: 0,
        totalScore: 0,
        averageScore: 0,
        bestRank: Infinity,
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedAt: 0,
        achievements: [],
      }
    }

    stats.totalGames++
    stats.totalScore += entry.score
    stats.averageScore = stats.totalScore / stats.totalGames
    stats.bestScore = Math.max(stats.bestScore, entry.score)
    stats.lastPlayedAt = entry.timestamp

    const rank = this.getPlayerRank(entry.score, entry.mode)
    stats.bestRank = Math.min(stats.bestRank, rank)

    // Update streak
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    if (stats.lastPlayedAt >= oneDayAgo) {
      stats.currentStreak++
    } else {
      stats.currentStreak = 1
    }
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak)

    // Merge achievements
    if (entry.achievements) {
      stats.achievements = [...new Set([...stats.achievements, ...entry.achievements])]
    }

    this.playerStats.set(playerId, stats)
    this.saveStatsToStorage()
  }

  /**
   * Get player statistics
   */
  getPlayerStats(playerId: string): PlayerStats | null {
    return this.playerStats.get(playerId) || null
  }

  /**
   * Get all player statistics
   */
  getAllPlayerStats(): PlayerStats[] {
    return Array.from(this.playerStats.values())
  }

  /**
   * Get leaderboard statistics
   */
  getLeaderboardStats(): LeaderboardStats {
    if (this.entries.length === 0) {
      return {
        totalEntries: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        entriesThisWeek: 0,
        topPlayer: null,
      }
    }

    const scores = this.entries.map((e) => e.score)
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    return {
      totalEntries: this.entries.length,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      entriesThisWeek: this.entries.filter((e) => e.timestamp >= oneWeekAgo).length,
      topPlayer: this.entries[0]?.playerName || null,
    }
  }

  /**
   * Get time range cutoff timestamp
   */
  private getTimeRangeCutoff(range: TimeRange, now: number): number {
    switch (range) {
      case 'daily':
        return now - 24 * 60 * 60 * 1000
      case 'weekly':
        return now - 7 * 24 * 60 * 60 * 1000
      case 'monthly':
        return now - 30 * 24 * 60 * 60 * 1000
      case 'alltime':
      default:
        return 0
    }
  }

  /**
   * Remove entry by ID
   */
  removeEntry(entryId: string): boolean {
    const index = this.entries.findIndex((e) => e.id === entryId)
    if (index !== -1) {
      this.entries.splice(index, 1)
      this.saveToStorage()
      return true
    }
    return false
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = []
    this.saveToStorage()
  }

  /**
   * Clear entries by time range
   */
  clearByTimeRange(range: TimeRange): number {
    const now = Date.now()
    const cutoffTime = this.getTimeRangeCutoff(range, now)

    const initialCount = this.entries.length
    this.entries = this.entries.filter((e) => e.timestamp < cutoffTime)

    this.saveToStorage()
    return initialCount - this.entries.length
  }

  /**
   * Get total entry count
   */
  getCount(): number {
    return this.entries.length
  }

  /**
   * Export leaderboard data
   */
  exportData(): string {
    return JSON.stringify(
      {
        entries: this.entries,
        playerStats: Array.from(this.playerStats.entries()),
        exportedAt: Date.now(),
      },
      null,
      2
    )
  }

  /**
   * Import leaderboard data
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      if (data.entries && Array.isArray(data.entries)) {
        this.entries = data.entries
      }

      if (data.playerStats && Array.isArray(data.playerStats)) {
        this.playerStats = new Map(data.playerStats)
      }

      this.sortEntries()
      this.saveToStorage()
      this.saveStatsToStorage()

      return true
    } catch (error) {
      console.error('Failed to import leaderboard data:', error)
      return false
    }
  }

  /**
   * Save entries to local storage
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.entries))
      } catch (error) {
        console.error('Failed to save leaderboard to storage:', error)
      }
    }
  }

  /**
   * Save player stats to local storage
   */
  private saveStatsToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const statsArray = Array.from(this.playerStats.entries())
        localStorage.setItem(this.statsStorageKey, JSON.stringify(statsArray))
      } catch (error) {
        console.error('Failed to save player stats to storage:', error)
      }
    }
  }

  /**
   * Load entries from local storage
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.storageKey)
        if (stored) {
          this.entries = JSON.parse(stored)
        }

        const storedStats = localStorage.getItem(this.statsStorageKey)
        if (storedStats) {
          const statsArray = JSON.parse(storedStats)
          this.playerStats = new Map(statsArray)
        }
      } catch (error) {
        console.error('Failed to load leaderboard from storage:', error)
      }
    }
  }

  /**
   * Sync with remote server
   */
  async syncWithServer(apiEndpoint: string): Promise<boolean> {
    try {
      // Upload local entries
      const response = await fetch(`${apiEndpoint}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: this.entries,
          playerStats: Array.from(this.playerStats.entries()),
        }),
      })

      if (!response.ok) {
        throw new Error('Sync failed')
      }

      const serverData = await response.json()

      // Merge server entries
      if (serverData.entries) {
        this.entries = this.mergeEntries(this.entries, serverData.entries)
        this.sortEntries()
        this.saveToStorage()
      }

      return true
    } catch (error) {
      console.error('Failed to sync with server:', error)
      return false
    }
  }

  /**
   * Merge local and server entries
   */
  private mergeEntries(local: LeaderboardEntry[], remote: LeaderboardEntry[]): LeaderboardEntry[] {
    const merged = new Map<string, LeaderboardEntry>()

    // Add all local entries
    local.forEach((entry) => merged.set(entry.id, entry))

    // Add remote entries (newer ones override)
    remote.forEach((entry) => {
      const existing = merged.get(entry.id)
      if (!existing || entry.timestamp > existing.timestamp) {
        merged.set(entry.id, entry)
      }
    })

    return Array.from(merged.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, this.maxEntries)
  }
}

export const leaderboardManager = new LeaderboardManager()

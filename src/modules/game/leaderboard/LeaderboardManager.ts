/**
 * Leaderboard management system
 */

export interface LeaderboardEntry {
  id: string
  playerName: string
  score: number
  mode: string
  timestamp: number
  isPlayer?: boolean
}

export class LeaderboardManager {
  private entries: LeaderboardEntry[] = []
  private maxEntries: number = 100

  constructor(maxEntries: number = 100) {
    this.maxEntries = maxEntries
  }

  addEntry(entry: Omit<LeaderboardEntry, 'id'>): string {
    const id = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const newEntry: LeaderboardEntry = {
      ...entry,
      id,
    }

    this.entries.push(newEntry)
    this.sortEntries()

    // Keep only top entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries)
    }

    return id
  }

  private sortEntries(): void {
    this.entries.sort((a, b) => b.score - a.score)
  }

  getTopEntries(count: number = 10): LeaderboardEntry[] {
    return this.entries.slice(0, count)
  }

  getEntriesByMode(mode: string, count: number = 10): LeaderboardEntry[] {
    return this.entries.filter(e => e.mode === mode).slice(0, count)
  }

  getPlayerRank(score: number, mode?: string): number {
    const entries = mode ? this.entries.filter(e => e.mode === mode) : this.entries

    const rank = entries.findIndex(e => score > e.score)
    return rank === -1 ? entries.length + 1 : rank + 1
  }

  isTopScore(score: number, topCount: number = 10): boolean {
    if (this.entries.length < topCount) {
      return true
    }

    const topEntries = this.getTopEntries(topCount)
    const lowestTop = topEntries[topEntries.length - 1]
    return !lowestTop || score > lowestTop.score
  }

  clear(): void {
    this.entries = []
  }

  getCount(): number {
    return this.entries.length
  }
}

export const leaderboardManager = new LeaderboardManager()

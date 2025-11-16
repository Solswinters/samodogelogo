/**
 * Leaderboard Data Service
 * Manages leaderboard data fetching, caching, and ranking logic.
 */

import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

export interface LeaderboardEntry {
  rank: number
  playerId: string
  playerName?: string
  score: number
  gamesPlayed: number
  totalRewards: bigint
  lastUpdated: number
}

export interface LeaderboardFilter {
  timeFrame?: 'daily' | 'weekly' | 'monthly' | 'allTime'
  limit?: number
  offset?: number
}

const LEADERBOARD_CACHE_KEY = 'samodoge_leaderboard_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface LeaderboardCache {
  data: LeaderboardEntry[]
  timestamp: number
  filter: LeaderboardFilter
}

class LeaderboardService {
  private cache: Map<string, LeaderboardCache> = new Map()

  /**
   * Fetches leaderboard data from the API.
   * @param filter Filter options for the leaderboard.
   * @returns Array of leaderboard entries.
   */
  async fetchLeaderboard(filter: LeaderboardFilter = {}): Promise<LeaderboardEntry[]> {
    const cacheKey = this.getCacheKey(filter)
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      logger.debug('Returning cached leaderboard data')
      return cached
    }

    try {
      logger.info('Fetching leaderboard data from API', filter)

      const queryParams = new URLSearchParams()
      if (filter.timeFrame) {
        queryParams.append('timeFrame', filter.timeFrame)
      }
      if (filter.limit) {
        queryParams.append('limit', filter.limit.toString())
      }
      if (filter.offset) {
        queryParams.append('offset', filter.offset.toString())
      }

      const response = await fetch(`/api/leaderboard?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.statusText}`)
      }

      const data = (await response.json()) as { leaderboard: LeaderboardEntry[] }
      const leaderboard = data.leaderboard

      // Add ranks to entries
      const rankedLeaderboard = leaderboard.map((entry, index) => ({
        ...entry,
        rank: (filter.offset ?? 0) + index + 1,
      }))

      this.setCache(cacheKey, rankedLeaderboard, filter)
      return rankedLeaderboard
    } catch (error) {
      logger.error('Failed to fetch leaderboard', error)
      throw error
    }
  }

  /**
   * Gets the player's position in the leaderboard.
   * @param playerId The player's ID.
   * @param filter Filter options.
   * @returns The player's rank or null if not found.
   */
  async getPlayerRank(playerId: string, filter: LeaderboardFilter = {}): Promise<number | null> {
    try {
      const leaderboard = await this.fetchLeaderboard({ ...filter, limit: 1000 }) // Fetch large set
      const entry = leaderboard.find(e => e.playerId === playerId)
      return entry ? entry.rank : null
    } catch (error) {
      logger.error('Failed to get player rank', error)
      return null
    }
  }

  /**
   * Gets leaderboard entries near a specific player.
   * @param playerId The player's ID.
   * @param range Number of entries above and below the player.
   * @param filter Filter options.
   * @returns Array of leaderboard entries around the player.
   */
  async getLeaderboardAroundPlayer(
    playerId: string,
    range: number = 5,
    filter: LeaderboardFilter = {}
  ): Promise<LeaderboardEntry[]> {
    try {
      const rank = await this.getPlayerRank(playerId, filter)
      if (!rank) {
        return []
      }

      const offset = Math.max(0, rank - range - 1)
      return await this.fetchLeaderboard({
        ...filter,
        offset,
        limit: range * 2 + 1,
      })
    } catch (error) {
      logger.error('Failed to get leaderboard around player', error)
      return []
    }
  }

  /**
   * Gets the top N players from the leaderboard.
   * @param limit Number of top players to retrieve.
   * @param filter Filter options.
   * @returns Array of top leaderboard entries.
   */
  async getTopPlayers(
    limit: number = 10,
    filter: LeaderboardFilter = {}
  ): Promise<LeaderboardEntry[]> {
    return await this.fetchLeaderboard({ ...filter, limit, offset: 0 })
  }

  /**
   * Invalidates the cache for a specific filter or all caches.
   * @param filter Optional filter to invalidate specific cache.
   */
  invalidateCache(filter?: LeaderboardFilter): void {
    if (filter) {
      const cacheKey = this.getCacheKey(filter)
      this.cache.delete(cacheKey)
      logger.debug(`Invalidated leaderboard cache: ${cacheKey}`)
    } else {
      this.cache.clear()
      logger.debug('Invalidated all leaderboard caches')
    }
  }

  /**
   * Submits a new score to the leaderboard.
   * @param playerId The player's ID.
   * @param score The score to submit.
   * @returns True if successful, false otherwise.
   */
  async submitScore(playerId: string, score: number): Promise<boolean> {
    try {
      logger.info(`Submitting score for player ${playerId}: ${score}`)

      const response = await fetch('/api/leaderboard/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, score }),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit score: ${response.statusText}`)
      }

      // Invalidate cache after submission
      this.invalidateCache()
      return true
    } catch (error) {
      logger.error('Failed to submit score', error)
      return false
    }
  }

  private getCacheKey(filter: LeaderboardFilter): string {
    return JSON.stringify(filter)
  }

  private getFromCache(cacheKey: string): LeaderboardEntry[] | null {
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }

  private setCache(cacheKey: string, data: LeaderboardEntry[], filter: LeaderboardFilter): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      filter,
    })

    // Also persist to storage for offline access
    try {
      storage.set(LEADERBOARD_CACHE_KEY, {
        data,
        timestamp: Date.now(),
        filter,
      })
    } catch (error) {
      logger.warn('Failed to persist leaderboard cache to storage', error)
    }
  }

  /**
   * Loads cached leaderboard from storage on initialization.
   */
  loadCacheFromStorage(): void {
    try {
      const cached = storage.get<LeaderboardCache>(LEADERBOARD_CACHE_KEY)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        const cacheKey = this.getCacheKey(cached.filter)
        this.cache.set(cacheKey, cached)
        logger.debug('Loaded leaderboard cache from storage')
      }
    } catch (error) {
      logger.warn('Failed to load leaderboard cache from storage', error)
    }
  }
}

export const leaderboardService = new LeaderboardService()

// Load cache on initialization
if (typeof window !== 'undefined') {
  leaderboardService.loadCacheFromStorage()
}

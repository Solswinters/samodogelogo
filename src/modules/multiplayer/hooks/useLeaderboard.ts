/**
 * Hook for leaderboard
 */

import { useState, useEffect, useCallback } from 'react'
import { LeaderboardService } from '../services/LeaderboardService'
import { useWebSocket } from './useWebSocket'
import type { Leaderboard, LeaderboardEntry } from '../types'

// Singleton service
const leaderboardService = new LeaderboardService()

/**
 * useLeaderboard utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useLeaderboard.
 */
export function useLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'allTime' = 'allTime') {
  const { send, on } = useWebSocket()
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Listen for leaderboard updates
  useEffect(() => {
    const unsubscribe = on('leaderboard_update', (event) => {
      const data = event.data as { period: string; entries: LeaderboardEntry[] }
      if (data.period === period) {
        leaderboardService.updateLeaderboard(period, data.entries)
        setLeaderboard(leaderboardService.getLeaderboard(period) ?? null)
      }
    })

    return unsubscribe
  }, [on, period])

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true)
    send('get_leaderboard', { period })
  }, [period, send])

  const getPlayerRank = useCallback(
    (playerId: string) => {
      return leaderboardService.getPlayerRank(period, playerId)
    },
    [period]
  )

  return {
    leaderboard,
    isLoading,
    fetchLeaderboard,
    getPlayerRank,
    topPlayers: leaderboard?.entries.slice(0, 10) ?? [],
  }
}

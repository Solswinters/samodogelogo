/**
 * Hook for matchmaking
 */

import { useState, useCallback, useEffect } from 'react'
import {
  MatchmakingService,
  type PlayerMatchProfile,
  type Match,
} from '../services/MatchmakingService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const matchmakingService = new MatchmakingService()

export function useMatchmaking(playerId: string, username: string, skillRating: number) {
  const { send, on } = useWebSocket()
  const [isInQueue, setIsInQueue] = useState(false)
  const [queuePosition, setQueuePosition] = useState(0)
  const [estimatedWait, setEstimatedWait] = useState(0)
  const [matchFound, setMatchFound] = useState<Match | null>(null)

  // Listen for match found
  useEffect(() => {
    const unsubscribe = on('match_found', event => {
      const match = event.data as Match
      setMatchFound(match)
      setIsInQueue(false)
    })

    return unsubscribe
  }, [on])

  // Update queue status
  useEffect(() => {
    if (!isInQueue) return

    const interval = setInterval(() => {
      const position = matchmakingService.getQueuePosition(playerId)
      const wait = matchmakingService.getEstimatedWaitTime(playerId)
      setQueuePosition(position)
      setEstimatedWait(wait)
    }, 1000)

    return () => clearInterval(interval)
  }, [isInQueue, playerId])

  const joinQueue = useCallback(
    (region: string, preferredMode: string) => {
      const profile: Omit<PlayerMatchProfile, 'queueTime'> = {
        playerId,
        username,
        skillRating,
        region,
        preferredMode,
      }

      matchmakingService.joinQueue(profile)
      send('join_matchmaking', profile)
      setIsInQueue(true)
      setMatchFound(null)
    },
    [playerId, username, skillRating, send]
  )

  const leaveQueue = useCallback(() => {
    matchmakingService.leaveQueue(playerId)
    send('leave_matchmaking', { playerId })
    setIsInQueue(false)
    setQueuePosition(0)
    setEstimatedWait(0)
  }, [playerId, send])

  return {
    isInQueue,
    queuePosition,
    estimatedWait,
    matchFound,
    joinQueue,
    leaveQueue,
  }
}

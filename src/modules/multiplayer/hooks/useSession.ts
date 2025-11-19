/**
 * Hook for game sessions
 */

import { useState, useCallback } from 'react'
import { SessionService } from '../services/SessionService'
import { useWebSocket } from './useWebSocket'
import type { GameSession } from '../types'

// Singleton service
const sessionService = new SessionService()

export function useSession() {
  const { send } = useWebSocket()
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)

  const startSession = useCallback(
    (roomId: string, mode: string) => {
      const session = sessionService.createSession(roomId, mode)
      setCurrentSession(session)
      send('session_start', session)
      return session
    },
    [send]
  )

  const endSession = useCallback(
    (winner?: string) => {
      if (!currentSession) return

      sessionService.endSession(currentSession.id, winner)
      send('session_end', { sessionId: currentSession.id, winner })
      setCurrentSession(null)
    },
    [currentSession, send]
  )

  const getSessionDuration = useCallback(() => {
    if (!currentSession) return 0
    return sessionService.getSessionDuration(currentSession.id)
  }, [currentSession])

  return {
    currentSession,
    startSession,
    endSession,
    getSessionDuration,
    isActive: !!currentSession,
  }
}

/**
 * Hook for analytics tracking
 */

import { useCallback, useRef } from 'react'
import { AnalyticsService } from '../services/AnalyticsService'

// Singleton service
const analyticsService = new AnalyticsService()

export function useAnalytics() {
  const serviceRef = useRef(analyticsService)

  const trackEvent = useCallback((type: string, data: Record<string, unknown>) => {
    serviceRef.current.trackEvent(type, data)
  }, [])

  const trackRoomCreate = useCallback((roomId: string, mode: string) => {
    serviceRef.current.trackRoomCreate(roomId, mode)
  }, [])

  const trackRoomJoin = useCallback((roomId: string, playerId: string) => {
    serviceRef.current.trackRoomJoin(roomId, playerId)
  }, [])

  const trackGameStart = useCallback((sessionId: string, playerCount: number) => {
    serviceRef.current.trackGameStart(sessionId, playerCount)
  }, [])

  const trackGameEnd = useCallback((sessionId: string, duration: number, winner?: string) => {
    serviceRef.current.trackGameEnd(sessionId, duration, winner)
  }, [])

  const trackMatchmaking = useCallback((playerId: string, queueTime: number) => {
    serviceRef.current.trackMatchmaking(playerId, queueTime)
  }, [])

  return {
    trackEvent,
    trackRoomCreate,
    trackRoomJoin,
    trackGameStart,
    trackGameEnd,
    trackMatchmaking,
  }
}

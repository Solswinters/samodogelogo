/**
 * Hook for spectator mode
 */

import { useState, useCallback, useEffect } from 'react'
import { SpectatorService } from '../services/SpectatorService'
import { useWebSocket } from './useWebSocket'
import type { SpectatorInfo } from '../types'

// Singleton service
const spectatorService = new SpectatorService()

export function useSpectator(roomId: string) {
  const { send, on } = useWebSocket()
  const [spectators, setSpectators] = useState<SpectatorInfo[]>([])
  const [isSpectating, setIsSpectating] = useState(false)

  // Listen for spectator updates
  useEffect(() => {
    const unsubscribe = on('spectator_update', event => {
      const data = event.data as { roomId: string; spectators: SpectatorInfo[] }
      if (data.roomId === roomId) {
        setSpectators(data.spectators)
      }
    })

    return unsubscribe
  }, [on, roomId])

  const startSpectating = useCallback(
    (playerId: string, username: string) => {
      spectatorService.addSpectator(roomId, playerId, username)
      send('start_spectating', { roomId, playerId, username })
      setIsSpectating(true)
    },
    [roomId, send]
  )

  const stopSpectating = useCallback(
    (playerId: string) => {
      spectatorService.removeSpectator(roomId, playerId)
      send('stop_spectating', { roomId, playerId })
      setIsSpectating(false)
    },
    [roomId, send]
  )

  return {
    spectators,
    spectatorCount: spectators.length,
    isSpectating,
    startSpectating,
    stopSpectating,
  }
}

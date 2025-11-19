/**
 * Hook for player presence
 */

import { useState, useEffect, useCallback } from 'react'
import {
  PresenceService,
  type PlayerPresence,
  type PresenceStatus,
} from '../services/PresenceService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const presenceService = new PresenceService()

export function usePresence(playerId: string, username: string) {
  const { send, on, isConnected } = useWebSocket()
  const [onlinePlayers, setOnlinePlayers] = useState<PlayerPresence[]>([])
  const [myPresence, setMyPresence] = useState<PlayerPresence | null>(null)

  // Set online when connected
  useEffect(() => {
    if (isConnected && playerId) {
      presenceService.setOnline(playerId, username)
      send('presence_update', { playerId, username, status: 'online' })

      // Send heartbeat every 30 seconds
      const interval = setInterval(() => {
        presenceService.heartbeat(playerId)
        send('presence_heartbeat', { playerId })
      }, 30000)

      return () => {
        clearInterval(interval)
        presenceService.setOffline(playerId)
        send('presence_update', { playerId, status: 'offline' })
      }
    }
  }, [isConnected, playerId, username, send])

  // Listen for presence updates
  useEffect(() => {
    const unsubscribePresence = on('presence_update', event => {
      const data = event.data as PlayerPresence
      if (data.playerId === playerId) {
        setMyPresence(data)
      }
      setOnlinePlayers(presenceService.getOnlinePlayers())
    })

    const unsubscribeList = on('presence_list', event => {
      const players = event.data as PlayerPresence[]
      players.forEach(p => {
        presenceService.setOnline(p.playerId, p.username)
      })
      setOnlinePlayers(presenceService.getOnlinePlayers())
    })

    return () => {
      unsubscribePresence()
      unsubscribeList()
    }
  }, [on, playerId])

  const updateStatus = useCallback(
    (status: PresenceStatus) => {
      presenceService.updateStatus(playerId, status)
      send('presence_update', { playerId, status })
    },
    [playerId, send]
  )

  const setInRoom = useCallback(
    (roomId: string) => {
      presenceService.setInRoom(playerId, roomId)
      send('presence_update', { playerId, roomId })
    },
    [playerId, send]
  )

  const leaveRoom = useCallback(() => {
    presenceService.removeFromRoom(playerId)
    send('presence_update', { playerId, roomId: null })
  }, [playerId, send])

  return {
    myPresence,
    onlinePlayers,
    onlineCount: onlinePlayers.length,
    updateStatus,
    setInRoom,
    leaveRoom,
  }
}

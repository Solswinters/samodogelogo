/**
 * Hook for multiplayer functionality
 */

import { useState, useEffect, useCallback } from 'react'
import { connectionManager } from '@/modules/multiplayer/services/connection-manager'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { logger } from '@/utils/logger'
import type { Socket } from 'socket.io-client'

interface MultiplayerState {
  isConnected: boolean
  roomId: string | null
  players: string[]
  isHost: boolean
  error: string | null
}

export function useMultiplayer() {
  const [state, setState] = useState<MultiplayerState>({
    isConnected: false,
    roomId: null,
    players: [],
    isHost: false,
    error: null,
  })

  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const connectedSocket = await connectionManager.connect()
        setSocket(connectedSocket)
        setState(prev => ({ ...prev, isConnected: true, error: null }))
        logger.info('Multiplayer connected')
      } catch (error) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: error instanceof Error ? error.message : 'Connection failed',
        }))
        logger.error('Multiplayer connection failed', error)
      }
    }

    void init()

    return () => {
      connectionManager.disconnect()
    }
  }, [])

  const joinRoom = useCallback(
    (roomId?: string) => {
      if (!socket) {
        logger.warn('Cannot join room: Socket not connected')
        return
      }

      const playerId = `player-${Date.now()}`
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, { playerId, roomId })

      socket.once(
        SOCKET_EVENTS.ROOM_JOINED,
        (data: { roomId: string; players: string[]; isHost: boolean }) => {
          setState(prev => ({
            ...prev,
            roomId: data.roomId,
            players: data.players,
            isHost: data.isHost,
          }))
          logger.info(`Joined room: ${data.roomId}`)
        }
      )

      socket.once(SOCKET_EVENTS.ROOM_FULL, () => {
        setState(prev => ({ ...prev, error: 'Room is full' }))
        logger.warn('Room is full')
      })
    },
    [socket]
  )

  const leaveRoom = useCallback(() => {
    if (!socket || !state.roomId) {return}

    socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId: state.roomId })
    setState(prev => ({
      ...prev,
      roomId: null,
      players: [],
      isHost: false,
    }))
    logger.info('Left room')
  }, [socket, state.roomId])

  const sendPlayerAction = useCallback(
    (action: string, data: unknown) => {
      if (!socket || !state.roomId) {return}

      socket.emit(action, { roomId: state.roomId, ...data })
    },
    [socket, state.roomId]
  )

  const onPlayerJoined = useCallback(
    (callback: (playerId: string) => void) => {
      if (!socket) {return}

      socket.on(SOCKET_EVENTS.PLAYER_JOINED, (data: { playerId: string }) => {
        callback(data.playerId)
        setState(prev => ({
          ...prev,
          players: [...prev.players, data.playerId],
        }))
      })
    },
    [socket]
  )

  const onPlayerLeft = useCallback(
    (callback: (playerId: string) => void) => {
      if (!socket) {return}

      socket.on(SOCKET_EVENTS.PLAYER_LEFT, (data: { playerId: string }) => {
        callback(data.playerId)
        setState(prev => ({
          ...prev,
          players: prev.players.filter(id => id !== data.playerId),
        }))
      })
    },
    [socket]
  )

  return {
    ...state,
    joinRoom,
    leaveRoom,
    sendPlayerAction,
    onPlayerJoined,
    onPlayerLeft,
  }
}

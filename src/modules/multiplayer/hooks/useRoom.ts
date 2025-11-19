/**
 * Hook for room management
 */

import { useState, useCallback, useEffect } from 'react'
import { RoomService, type Room, type CreateRoomOptions } from '../services/RoomService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const roomService = new RoomService()

export function useRoom() {
  const { send, on } = useWebSocket()
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Listen for room updates
  useEffect(() => {
    const unsubscribeRoomUpdate = on('room_update', event => {
      const room = event.data as Room
      setCurrentRoom(room)
    })

    const unsubscribeRoomList = on('room_list', event => {
      const rooms = event.data as Room[]
      setAvailableRooms(rooms)
    })

    const unsubscribePlayerJoined = on('player_joined', event => {
      const room = event.data as Room
      setCurrentRoom(room)
    })

    const unsubscribePlayerLeft = on('player_left', event => {
      const room = event.data as Room
      setCurrentRoom(room)
    })

    return () => {
      unsubscribeRoomUpdate()
      unsubscribeRoomList()
      unsubscribePlayerJoined()
      unsubscribePlayerLeft()
    }
  }, [on])

  const createRoom = useCallback(
    async (
      hostId: string,
      hostUsername: string,
      options: CreateRoomOptions
    ): Promise<Room | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const room = roomService.createRoom(hostId, hostUsername, options)
        send('create_room', room)
        setCurrentRoom(room)
        return room
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create room')
        setError(error)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [send]
  )

  const joinRoom = useCallback(
    async (
      roomId: string,
      playerId: string,
      username: string,
      password?: string
    ): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const room = roomService.joinRoom(roomId, playerId, username, password)
        send('join_room', { roomId, playerId, username, password })
        setCurrentRoom(room)
        return true
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to join room')
        setError(error)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [send]
  )

  const leaveRoom = useCallback(
    (playerId: string) => {
      roomService.leaveRoom(playerId)
      send('leave_room', { playerId })
      setCurrentRoom(null)
    },
    [send]
  )

  const setReady = useCallback(
    (playerId: string, isReady: boolean) => {
      roomService.setPlayerReady(playerId, isReady)
      send('set_ready', { playerId, isReady })
    },
    [send]
  )

  const startGame = useCallback(
    (roomId: string, hostId: string) => {
      try {
        roomService.startGame(roomId, hostId)
        send('start_game', { roomId })
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to start game')
        setError(error)
      }
    },
    [send]
  )

  const refreshRoomList = useCallback(() => {
    send('get_rooms')
  }, [send])

  return {
    currentRoom,
    availableRooms,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
    startGame,
    refreshRoomList,
  }
}

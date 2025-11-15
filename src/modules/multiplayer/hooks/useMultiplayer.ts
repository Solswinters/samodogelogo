'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client'
import type { Player, Obstacle } from '@/modules/game/domain/engine'

interface PlayerPosition {
  y: number
  velocityY: number
  isGrounded: boolean
}

interface GameOverData {
  winnerId: string
  scores: Array<{ playerId: string; score: number }>
}

interface UseMultiplayerProps {
  onPlayerJoined?: (playerId: string, player: Player) => void
  onPlayerLeft?: (playerId: string) => void
  onPlayerJumped?: (playerId: string) => void
  onPositionUpdated?: (playerId: string, position: PlayerPosition) => void
  onScoreUpdated?: (playerId: string, score: number) => void
  onObstaclesSynced?: (obstacles: Obstacle[]) => void
  onPlayerDied?: (playerId: string) => void
  onGameStarted?: () => void
  onGameOver?: (data: GameOverData) => void
}

export function useMultiplayer(props: UseMultiplayerProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [players, setPlayers] = useState<Map<string, Player>>(new Map())
  const [isHost, setIsHost] = useState(false)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000'
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to multiplayer server')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from multiplayer server')
    })

    socketInstance.on(
      'room-joined',
      (data: { roomId: string; playerId: string; player: Player }) => {
        setRoomId(data.roomId)
        setPlayerId(data.playerId)
        setPlayers(new Map([[data.playerId, data.player]]))

        // First player in room is the host
        setIsHost(true)

        console.log('Joined room:', data.roomId)
      }
    )

    socketInstance.on(
      'room-state',
      (data: { players: Player[]; obstacles: Obstacle[]; gameStarted: boolean }) => {
        const playersMap = new Map<string, Player>()
        data.players.forEach((p: Player) => {
          playersMap.set(p.id, p)
        })
        setPlayers(playersMap)

        // If there are other players, we're not the host
        if (data.players.length > 1) {
          setIsHost(false)
        }

        if (props.onObstaclesSynced && data.obstacles.length > 0) {
          props.onObstaclesSynced(data.obstacles)
        }
      }
    )

    socketInstance.on('player-joined', (data: { playerId: string; player: Player }) => {
      setPlayers(prev => new Map(prev).set(data.playerId, data.player))
      if (props.onPlayerJoined) {
        props.onPlayerJoined(data.playerId, data.player)
      }
      console.log('Player joined:', data.playerId)
    })

    socketInstance.on('player-left', (playerId: string) => {
      setPlayers(prev => {
        const newMap = new Map(prev)
        newMap.delete(playerId)
        return newMap
      })
      if (props.onPlayerLeft) {
        props.onPlayerLeft(playerId)
      }
      console.log('Player left:', playerId)
    })

    socketInstance.on('player-jumped', (playerId: string) => {
      if (props.onPlayerJumped) {
        props.onPlayerJumped(playerId)
      }
    })

    socketInstance.on(
      'position-updated',
      (data: { playerId: string; position: PlayerPosition }) => {
        if (props.onPositionUpdated) {
          props.onPositionUpdated(data.playerId, data.position)
        }
      }
    )

    socketInstance.on('score-updated', (data: { playerId: string; score: number }) => {
      setPlayers(prev => {
        const newMap = new Map(prev)
        const player = newMap.get(data.playerId)
        if (player) {
          player.score = data.score
        }
        return newMap
      })
      if (props.onScoreUpdated) {
        props.onScoreUpdated(data.playerId, data.score)
      }
    })

    socketInstance.on('obstacles-synced', (obstacles: Obstacle[]) => {
      if (props.onObstaclesSynced) {
        props.onObstaclesSynced(obstacles)
      }
    })

    socketInstance.on('player-died', (playerId: string) => {
      setPlayers(prev => {
        const newMap = new Map(prev)
        const player = newMap.get(playerId)
        if (player) {
          player.isAlive = false
        }
        return newMap
      })
      if (props.onPlayerDied) {
        props.onPlayerDied(playerId)
      }
    })

    socketInstance.on('game-started', () => {
      if (props.onGameStarted) {
        props.onGameStarted()
      }
      console.log('Game started')
    })

    socketInstance.on('game-over', (data: { winnerId: string; scores: any[] }) => {
      if (props.onGameOver) {
        props.onGameOver(data)
      }
      console.log('Game over. Winner:', data.winnerId)
    })

    socketInstance.on('room-full', () => {
      alert('Room is full. Please try again later.')
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const joinRoom = useCallback(
    (roomId?: string) => {
      if (socket) {
        socket.emit('join-room', roomId)
      }
    },
    [socket]
  )

  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit('leave-room')
      setRoomId(null)
      setPlayerId(null)
      setPlayers(new Map())
      setIsHost(false)
    }
  }, [socket])

  const startGame = useCallback(() => {
    if (socket && isHost) {
      socket.emit('start-game')
    }
  }, [socket, isHost])

  const sendJump = useCallback(() => {
    if (socket) {
      socket.emit('player-jump')
    }
  }, [socket])

  const updatePosition = useCallback(
    (position: { y: number; velocityY: number; isGrounded: boolean }) => {
      if (socket) {
        socket.emit('update-position', position)
      }
    },
    [socket]
  )

  const updateScore = useCallback(
    (score: number) => {
      if (socket) {
        socket.emit('update-score', score)
      }
    },
    [socket]
  )

  const syncObstacles = useCallback(
    (obstacles: Obstacle[]) => {
      if (socket && isHost) {
        socket.emit('sync-obstacles', obstacles)
      }
    },
    [socket, isHost]
  )

  const notifyDeath = useCallback(() => {
    if (socket) {
      socket.emit('player-died')
    }
  }, [socket])

  return {
    socket,
    isConnected,
    roomId,
    playerId,
    players,
    isHost,
    joinRoom,
    leaveRoom,
    startGame,
    sendJump,
    updatePosition,
    updateScore,
    syncObstacles,
    notifyDeath,
  }
}

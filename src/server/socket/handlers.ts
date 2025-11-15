/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { Server as SocketIOServer, Socket } from 'socket.io'
import { roomManager } from './roomManager'
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  CreateRoomData,
  JoinRoomData,
} from './types'
import { multiplayerLogger as logger } from '@/middleware/logging'

export type GameSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>
export type GameServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

// Connection handler
export function handleConnection(io: GameServer, socket: GameSocket): void {
  const { playerId } = socket.data
  logger.info('Client connected', { socketId: socket.id, playerId })

  // Create room handler
  socket.on('createRoom', (data: CreateRoomData, callback) => {
    try {
      const roomId = crypto.randomUUID()

      const room = roomManager.createRoom({
        roomId,
        roomName: data.roomName,
        hostId: socket.data.playerId,
        hostName: data.playerName,
        maxPlayers: data.maxPlayers,
        isPrivate: data.isPrivate,
        address: data.address,
      })

      // Join socket room
      void socket.join(roomId)
      socket.data.roomId = roomId

      // Notify others
      io.emit('roomCreated', room)

      callback({ success: true, room })
    } catch (error) {
      logger.error('Create room error', error as Error, { playerId })
      callback({
        success: false,
        error: {
          code: 'CREATE_ROOM_ERROR',
          message: 'Failed to create room',
        },
      })
    }
  })

  // Join room handler
  socket.on('joinRoom', (data: JoinRoomData, callback) => {
    try {
      const result = roomManager.addPlayer(
        data.roomId,
        socket.data.playerId,
        data.playerName,
        data.address
      )

      if (!result.success) {
        callback({
          success: false,
          error: {
            code: 'JOIN_ROOM_ERROR',
            message: result.error ?? 'Failed to join room',
          },
        })
        return
      }

      // Join socket room
      void socket.join(data.roomId)
      socket.data.roomId = data.roomId

      // Notify others in room
      io.to(data.roomId).emit('playerJoined', {
        playerId: socket.data.playerId,
        playerName: data.playerName,
        roomId: data.roomId,
      })

      // Notify room updated
      if (result.room) {
        io.to(data.roomId).emit('roomUpdated', result.room)
      }

      callback({ success: true, room: result.room })
    } catch (error) {
      logger.error('Join room error', error as Error, { playerId, roomId: data.roomId })
      callback({
        success: false,
        error: {
          code: 'JOIN_ROOM_ERROR',
          message: 'Failed to join room',
        },
      })
    }
  })

  // Leave room handler
  socket.on('leaveRoom', (data, callback) => {
    try {
      const { roomId } = data

      const result = roomManager.removePlayer(roomId, socket.data.playerId)

      if (!result.success) {
        callback({
          success: false,
          error: {
            code: 'LEAVE_ROOM_ERROR',
            message: result.error ?? 'Failed to leave room',
          },
        })
        return
      }

      // Leave socket room
      void socket.leave(roomId)
      socket.data.roomId = undefined

      // Notify others in room
      io.to(roomId).emit('playerLeft', {
        playerId: socket.data.playerId,
        roomId,
      })

      // If room should be closed, notify all
      if (result.shouldClose) {
        io.to(roomId).emit('roomClosed', {
          roomId,
          reason: 'Room closed by host',
        })
      } else if (result.room) {
        // Otherwise, update room
        io.to(roomId).emit('roomUpdated', result.room)
      }

      callback({ success: true })
    } catch (error) {
      logger.error('Leave room error', error as Error, { playerId })
      callback({
        success: false,
        error: {
          code: 'LEAVE_ROOM_ERROR',
          message: 'Failed to leave room',
        },
      })
    }
  })

  // Get rooms handler
  socket.on('getRooms', callback => {
    try {
      const rooms = roomManager.getPublicRooms()
      callback({ success: true, rooms })
    } catch (error) {
      logger.error('Get rooms error', error as Error, { playerId })
      callback({
        success: false,
        error: {
          code: 'GET_ROOMS_ERROR',
          message: 'Failed to get rooms',
        },
      })
    }
  })

  // Set ready handler
  socket.on('setReady', data => {
    try {
      const result = roomManager.setPlayerReady(data.roomId, socket.data.playerId, data.isReady)

      if (result.success && result.room) {
        // Notify others in room
        io.to(data.roomId).emit('playerReady', {
          playerId: socket.data.playerId,
          isReady: data.isReady,
        })

        io.to(data.roomId).emit('roomUpdated', result.room)

        // Check if all players are ready and auto-start
        if (roomManager.areAllPlayersReady(data.roomId)) {
          const startResult = roomManager.startGame(data.roomId)
          if (startResult.success) {
            io.to(data.roomId).emit('gameStarted', {
              roomId: data.roomId,
              startTime: Date.now(),
            })
          }
        }
      }
    } catch (error) {
      logger.error('Set ready error', error as Error, { playerId })
    }
  })

  // Update player handler
  socket.on('updatePlayer', data => {
    try {
      roomManager.updatePlayerPosition(data.roomId, socket.data.playerId, data.position)

      if (data.score !== undefined) {
        roomManager.updatePlayerScore(data.roomId, socket.data.playerId, data.score)
      }

      // Broadcast to other players in room (not sender)
      socket.to(data.roomId).emit('gameStateUpdate', {
        roomId: data.roomId,
        players: {
          [socket.data.playerId]: {
            playerId: socket.data.playerId,
            playerName: socket.data.playerName,
            isHost: false, // Will be determined by room
            isReady: false,
            score: data.score ?? 0,
            position: data.position,
          },
        },
        obstacles: [], // Obstacles are synced separately
        gameTime: Date.now(),
      })
    } catch (error) {
      logger.error('Update player error', error as Error, { playerId })
    }
  })

  // Start game handler
  socket.on('startGame', data => {
    try {
      const result = roomManager.startGame(data.roomId)

      if (result.success) {
        io.to(data.roomId).emit('gameStarted', {
          roomId: data.roomId,
          startTime: Date.now(),
        })
      } else {
        socket.emit('error', {
          code: 'START_GAME_ERROR',
          message: result.error ?? 'Failed to start game',
        })
      }
    } catch (error) {
      logger.error('Start game error', error as Error, { playerId })
    }
  })

  // Ping/pong for latency measurement
  socket.on('ping', data => {
    socket.emit('pong', { timestamp: data.timestamp })
  })

  // Disconnect handler
  socket.on('disconnect', reason => {
    logger.info('Client disconnected', { socketId: socket.id, playerId, reason })

    // Remove player from room if in one
    if (socket.data.roomId) {
      const result = roomManager.removePlayer(socket.data.roomId, socket.data.playerId)

      if (result.success) {
        io.to(socket.data.roomId).emit('playerLeft', {
          playerId: socket.data.playerId,
          roomId: socket.data.roomId,
        })

        if (result.shouldClose) {
          io.to(socket.data.roomId).emit('roomClosed', {
            roomId: socket.data.roomId,
            reason: 'Room closed',
          })
        } else if (result.room) {
          io.to(socket.data.roomId).emit('roomUpdated', result.room)
        }
      }
    }
  })
}

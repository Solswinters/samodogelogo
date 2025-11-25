/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { RoomData, Player, RoomInfo } from './types'
import { multiplayerLogger as logger } from '@/middleware/logging'

// Room manager class
export class RoomManager {
  private rooms: Map<string, RoomData> = new Map()

  // Create a new room
  createRoom(data: {
    roomId: string
    roomName: string
    hostId: string
    hostName: string
    maxPlayers: number
    isPrivate: boolean
    address?: string
  }): RoomData {
    const room: RoomData = {
      roomId: data.roomId,
      roomName: data.roomName,
      hostId: data.hostId,
      players: [
        {
          playerId: data.hostId,
          playerName: data.hostName,
          address: data.address,
          isHost: true,
          isReady: false,
          score: 0,
          position: { x: 100, y: 300, velocityY: 0 },
        },
      ],
      maxPlayers: data.maxPlayers,
      isPrivate: data.isPrivate,
      status: 'waiting',
      createdAt: Date.now(),
    }

    this.rooms.set(data.roomId, room)
    logger.info('Room created', { roomId: data.roomId, roomName: data.roomName })

    return room
  }

  // Get room by ID
  getRoom(roomId: string): RoomData | undefined {
    return this.rooms.get(roomId)
  }

  // Get all rooms
  getAllRooms(): RoomData[] {
    return Array.from(this.rooms.values())
  }

  // Get public rooms (for room list)
  getPublicRooms(): RoomInfo[] {
    return Array.from(this.rooms.values())
      .filter((room) => !room.isPrivate && room.status === 'waiting')
      .map((room) => ({
        roomId: room.roomId,
        roomName: room.roomName,
        currentPlayers: room.players.length,
        maxPlayers: room.maxPlayers,
        isPrivate: room.isPrivate,
        status: room.status,
      }))
  }

  // Add player to room
  addPlayer(
    roomId: string,
    playerId: string,
    playerName: string,
    address?: string
  ): { success: boolean; error?: string; room?: RoomData } {
    const room = this.rooms.get(roomId)

    if (!room) {
      return { success: false, error: 'Room not found' }
    }

    if (room.status !== 'waiting') {
      return { success: false, error: 'Room is not accepting players' }
    }

    if (room.players.length >= room.maxPlayers) {
      return { success: false, error: 'Room is full' }
    }

    if (room.players.some((p) => p.playerId === playerId)) {
      return { success: false, error: 'Player already in room' }
    }

    const newPlayer: Player = {
      playerId,
      playerName,
      address,
      isHost: false,
      isReady: false,
      score: 0,
      position: { x: 100, y: 300, velocityY: 0 },
    }

    room.players.push(newPlayer)
    logger.info('Player joined room', { roomId, playerId, playerName })

    return { success: true, room }
  }

  // Remove player from room
  removePlayer(
    roomId: string,
    playerId: string
  ): { success: boolean; error?: string; room?: RoomData; shouldClose?: boolean } {
    const room = this.rooms.get(roomId)

    if (!room) {
      return { success: false, error: 'Room not found' }
    }

    const playerIndex = room.players.findIndex((p) => p.playerId === playerId)

    if (playerIndex === -1) {
      return { success: false, error: 'Player not in room' }
    }

    const removedPlayer = room.players[playerIndex]
    room.players.splice(playerIndex, 1)

    logger.info('Player left room', { roomId, playerId })

    // If host left, either assign new host or close room
    if (removedPlayer?.isHost) {
      if (room.players.length > 0) {
        // Assign new host
        room.players[0]!.isHost = true
        room.hostId = room.players[0]!.playerId
        logger.info('New host assigned', { roomId, newHostId: room.hostId })
      } else {
        // Close room if empty
        this.rooms.delete(roomId)
        logger.info('Room closed (empty)', { roomId })
        return { success: true, shouldClose: true }
      }
    }

    // Close room if empty
    if (room.players.length === 0) {
      this.rooms.delete(roomId)
      logger.info('Room closed (empty)', { roomId })
      return { success: true, shouldClose: true }
    }

    return { success: true, room }
  }

  // Set player ready status
  setPlayerReady(
    roomId: string,
    playerId: string,
    isReady: boolean
  ): { success: boolean; error?: string; room?: RoomData } {
    const room = this.rooms.get(roomId)

    if (!room) {
      return { success: false, error: 'Room not found' }
    }

    const player = room.players.find((p) => p.playerId === playerId)

    if (!player) {
      return { success: false, error: 'Player not in room' }
    }

    player.isReady = isReady
    logger.info('Player ready status updated', { roomId, playerId, isReady })

    return { success: true, room }
  }

  // Check if all players are ready
  areAllPlayersReady(roomId: string): boolean {
    const room = this.rooms.get(roomId)

    if (!room || room.players.length < 2) {
      return false
    }

    return room.players.every((p) => p.isReady)
  }

  // Start game
  startGame(roomId: string): { success: boolean; error?: string; room?: RoomData } {
    const room = this.rooms.get(roomId)

    if (!room) {
      return { success: false, error: 'Room not found' }
    }

    if (room.status !== 'waiting') {
      return { success: false, error: 'Game already started' }
    }

    if (room.players.length < 2) {
      return { success: false, error: 'Not enough players' }
    }

    room.status = 'playing'
    logger.info('Game started', { roomId })

    return { success: true, room }
  }

  // End game
  endGame(roomId: string): { success: boolean; error?: string; room?: RoomData } {
    const room = this.rooms.get(roomId)

    if (!room) {
      return { success: false, error: 'Room not found' }
    }

    room.status = 'finished'
    logger.info('Game ended', { roomId })

    // Reset players
    room.players.forEach((player) => {
      player.isReady = false
      player.score = 0
    })

    // Room will be closed or reset to waiting
    return { success: true, room }
  }

  // Update player position
  updatePlayerPosition(
    roomId: string,
    playerId: string,
    position: { x: number; y: number; velocityY: number }
  ): { success: boolean; error?: string } {
    const room = this.rooms.get(roomId)

    if (!room) {
      return { success: false, error: 'Room not found' }
    }

    const player = room.players.find((p) => p.playerId === playerId)

    if (!player) {
      return { success: false, error: 'Player not in room' }
    }

    player.position = position

    return { success: true }
  }

  // Update player score
  updatePlayerScore(
    roomId: string,
    playerId: string,
    score: number
  ): { success: boolean; error?: string } {
    const room = this.rooms.get(roomId)

    if (!room) {
      return { success: false, error: 'Room not found' }
    }

    const player = room.players.find((p) => p.playerId === playerId)

    if (!player) {
      return { success: false, error: 'Player not in room' }
    }

    player.score = score

    return { success: true }
  }

  // Delete room
  deleteRoom(roomId: string): boolean {
    const deleted = this.rooms.delete(roomId)
    if (deleted) {
      logger.info('Room deleted', { roomId })
    }
    return deleted
  }

  // Get room stats
  getStats(): {
    totalRooms: number
    activeRooms: number
    totalPlayers: number
  } {
    const totalRooms = this.rooms.size
    const activeRooms = Array.from(this.rooms.values()).filter((r) => r.status === 'playing').length
    const totalPlayers = Array.from(this.rooms.values()).reduce(
      (sum, r) => sum + r.players.length,
      0
    )

    return {
      totalRooms,
      activeRooms,
      totalPlayers,
    }
  }
}

// Singleton instance
/**
 * roomManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of roomManager.
 */
export const roomManager = new RoomManager()

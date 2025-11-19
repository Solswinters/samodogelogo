/**
 * Multiplayer room utilities
 */

import { MAX_PLAYERS_PER_ROOM, MIN_PLAYERS_TO_START } from '../constants'

export interface Room {
  id: string
  name: string
  playerCount: number
  maxPlayers: number
  isStarted: boolean
  isPrivate: boolean
}

export function canJoinRoom(room: Room): boolean {
  return room.playerCount < room.maxPlayers && !room.isStarted
}

export function canStartGame(playerCount: number): boolean {
  return playerCount >= MIN_PLAYERS_TO_START
}

export function isRoomFull(room: Room): boolean {
  return room.playerCount >= room.maxPlayers
}

export function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createRoom(name: string, isPrivate: boolean = false): Room {
  return {
    id: generateRoomId(),
    name,
    playerCount: 0,
    maxPlayers: MAX_PLAYERS_PER_ROOM,
    isStarted: false,
    isPrivate,
  }
}

export function getRoomDisplayName(room: Room): string {
  const privacy = room.isPrivate ? '🔒' : '🌐'
  return `${privacy} ${room.name} (${room.playerCount}/${room.maxPlayers})`
}

export function filterAvailableRooms(rooms: Room[]): Room[] {
  return rooms.filter(room => canJoinRoom(room) && !room.isPrivate)
}

export function sortRoomsByPlayers(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.playerCount - a.playerCount)
}

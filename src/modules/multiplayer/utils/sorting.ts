/**
 * Multiplayer sorting utilities
 */

import type { Room, Player } from '../types'

/**
 * sortRoomsByPlayers utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortRoomsByPlayers.
 */
export function sortRoomsByPlayers(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.currentPlayers - a.currentPlayers)
}

/**
 * sortRoomsByCreated utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortRoomsByCreated.
 */
export function sortRoomsByCreated(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * sortPlayersByScore utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortPlayersByScore.
 */
export function sortPlayersByScore(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score)
}

/**
 * sortPlayersByName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortPlayersByName.
 */
export function sortPlayersByName(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * sortPlayersByJoinTime utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortPlayersByJoinTime.
 */
export function sortPlayersByJoinTime(players: Player[]): Player[] {
  return [...rooms].sort((a, b) => a.joinedAt - b.joinedAt)
}

/**
 * filterAvailableRooms utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of filterAvailableRooms.
 */
export function filterAvailableRooms(rooms: Room[]): Room[] {
  return rooms.filter((room) => room.currentPlayers < room.maxPlayers)
}

/**
 * filterPublicRooms utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of filterPublicRooms.
 */
export function filterPublicRooms(rooms: Room[]): Room[] {
  return rooms.filter((room) => !room.isPrivate)
}

/**
 * searchRooms utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of searchRooms.
 */
export function searchRooms(rooms: Room[], query: string): Room[] {
  const lowercaseQuery = query.toLowerCase()
  return rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(lowercaseQuery) ||
      room.host.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Room cache for optimized lookups
 */

import type { Room } from '../types'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class RoomCache {
  private cache: Map<string, CacheEntry<Room>> = new Map()
  private ttl: number

  constructor(ttlMs = 60000) {
    // 1 minute default
    this.ttl = ttlMs
    this.startCleanup()
  }

  set(roomId: string, room: Room): void {
    this.cache.set(roomId, {
      value: room,
      expiresAt: Date.now() + this.ttl,
    })
  }

  get(roomId: string): Room | undefined {
    const entry = this.cache.get(roomId)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(roomId)
      return undefined
    }

    return entry.value
  }

  has(roomId: string): boolean {
    return this.get(roomId) !== undefined
  }

  delete(roomId: string): void {
    this.cache.delete(roomId)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  getAll(): Room[] {
    const rooms: Room[] = []
    const now = Date.now()

    for (const [roomId, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(roomId)
      } else {
        rooms.push(entry.value)
      }
    }

    return rooms
  }

  getAvailable(): Room[] {
    return this.getAll().filter(room => room.currentPlayers < room.maxPlayers)
  }

  getPublic(): Room[] {
    return this.getAll().filter(room => !room.isPrivate)
  }

  update(roomId: string, updates: Partial<Room>): boolean {
    const room = this.get(roomId)
    if (!room) return false

    this.set(roomId, { ...room, ...updates })
    return true
  }

  search(query: string): Room[] {
    const lowercaseQuery = query.toLowerCase()
    return this.getAll().filter(
      room =>
        room.name.toLowerCase().includes(lowercaseQuery) ||
        room.host.toLowerCase().includes(lowercaseQuery)
    )
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [roomId, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(roomId)
        }
      }
    }, 30000) // Clean up every 30 seconds
  }
}

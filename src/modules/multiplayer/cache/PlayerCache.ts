/**
 * Player cache for optimized lookups
 */

import type { Player } from '../types'

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class PlayerCache {
  private cache: Map<string, CacheEntry<Player>> = new Map()
  private ttl: number

  constructor(ttlMs = 300000) {
    // 5 minutes default
    this.ttl = ttlMs
    this.startCleanup()
  }

  set(playerId: string, player: Player): void {
    this.cache.set(playerId, {
      value: player,
      expiresAt: Date.now() + this.ttl,
    })
  }

  get(playerId: string): Player | undefined {
    const entry = this.cache.get(playerId)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(playerId)
      return undefined
    }

    return entry.value
  }

  has(playerId: string): boolean {
    return this.get(playerId) !== undefined
  }

  delete(playerId: string): void {
    this.cache.delete(playerId)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  getAll(): Player[] {
    const players: Player[] = []
    const now = Date.now()

    for (const [playerId, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(playerId)
      } else {
        players.push(entry.value)
      }
    }

    return players
  }

  update(playerId: string, updates: Partial<Player>): boolean {
    const player = this.get(playerId)
    if (!player) return false

    this.set(playerId, { ...player, ...updates })
    return true
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [playerId, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(playerId)
        }
      }
    }, 60000) // Clean up every minute
  }
}

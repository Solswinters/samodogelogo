/**
 * Power-Up Manager - Manages power-up lifecycle, activation, and effects
 */

import type { PowerUp } from './types'
import { PowerUpFactory } from './factory'

export interface ActivePowerUp {
  powerUp: PowerUp
  startTime: number
  endTime: number
  isActive: boolean
}

export interface PowerUpEffect {
  type: PowerUp['type']
  value: number
  duration: number
}

export interface PowerUpStats {
  collected: number
  active: number
  expired: number
  byType: Record<PowerUp['type'], number>
}

export interface PowerUpConfig {
  spawnInterval?: number
  maxActive?: number
  despawnTime?: number
  stackable?: boolean
}

export type PowerUpEventType = 'spawned' | 'collected' | 'activated' | 'expired' | 'removed'

export type PowerUpEventHandler = (data?: any) => void

export class PowerUpManager {
  private powerUps: Map<string, PowerUp> = new Map()
  private activePowerUps: Map<string, ActivePowerUp> = new Map()
  private factory: PowerUpFactory
  private eventHandlers: Map<PowerUpEventType, Set<PowerUpEventHandler>> = new Map()
  private config: Required<PowerUpConfig>
  private stats: PowerUpStats
  private spawnTimer: NodeJS.Timeout | null = null
  private updateTimer: NodeJS.Timeout | null = null

  constructor(config: PowerUpConfig = {}) {
    this.factory = PowerUpFactory.getInstance()
    this.config = {
      spawnInterval: 5000, // 5 seconds
      maxActive: 10,
      despawnTime: 10000, // 10 seconds
      stackable: false,
      ...config,
    }

    this.stats = {
      collected: 0,
      active: 0,
      expired: 0,
      byType: {
        'double-jump': 0,
        invincibility: 0,
        'speed-boost': 0,
        'slow-motion': 0,
        'score-multiplier': 0,
      },
    }
  }

  /**
   * Start the power-up system
   */
  start(): void {
    this.stop()

    // Spawn power-ups periodically
    this.spawnTimer = setInterval(() => {
      this.spawnRandom()
    }, this.config.spawnInterval)

    // Update active power-ups
    this.updateTimer = setInterval(() => {
      this.updateActivePowerUps()
    }, 100)
  }

  /**
   * Stop the power-up system
   */
  stop(): void {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer)
      this.spawnTimer = null
    }

    if (this.updateTimer) {
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
  }

  /**
   * Spawn a power-up at position
   */
  spawn(x: number, type: PowerUp['type']): PowerUp {
    if (this.powerUps.size >= this.config.maxActive) {
      // Remove oldest power-up
      const oldestId = this.powerUps.keys().next().value
      if (oldestId) {
        this.remove(oldestId)
      }
    }

    const powerUp = this.factory.create(x, type)
    this.powerUps.set(powerUp.id, powerUp)

    // Schedule auto-despawn
    setTimeout(() => {
      if (this.powerUps.has(powerUp.id) && !powerUp.collected) {
        this.remove(powerUp.id)
      }
    }, this.config.despawnTime)

    this.emit('spawned', { powerUp })
    return powerUp
  }

  /**
   * Spawn a random power-up
   */
  spawnRandom(x?: number): PowerUp {
    const spawnX = x ?? Math.random() * 800 + 100
    return this.spawn(spawnX, this.getRandomType())
  }

  /**
   * Collect a power-up
   */
  collect(powerUpId: string): boolean {
    const powerUp = this.powerUps.get(powerUpId)

    if (!powerUp || powerUp.collected) {
      return false
    }

    powerUp.collected = true
    this.powerUps.delete(powerUpId)

    // Activate the power-up
    this.activate(powerUp)

    // Update stats
    this.stats.collected++
    this.stats.byType[powerUp.type]++

    this.emit('collected', { powerUp })
    return true
  }

  /**
   * Activate a power-up
   */
  private activate(powerUp: PowerUp): void {
    const now = Date.now()
    const duration = 'duration' in powerUp ? powerUp.duration : 0

    // Check if stackable or if this type is already active
    if (!this.config.stackable) {
      const existingActive = Array.from(this.activePowerUps.values()).find(
        (ap) => ap.powerUp.type === powerUp.type && ap.isActive
      )

      if (existingActive) {
        // Extend duration instead of stacking
        existingActive.endTime = now + duration
        this.emit('activated', { powerUp, extended: true })
        return
      }
    }

    const activePowerUp: ActivePowerUp = {
      powerUp,
      startTime: now,
      endTime: now + duration,
      isActive: true,
    }

    this.activePowerUps.set(powerUp.id, activePowerUp)
    this.stats.active++

    this.emit('activated', { powerUp })
  }

  /**
   * Update active power-ups (check expiration)
   */
  private updateActivePowerUps(): void {
    const now = Date.now()

    for (const [id, activePowerUp] of this.activePowerUps.entries()) {
      if (now >= activePowerUp.endTime && activePowerUp.isActive) {
        activePowerUp.isActive = false
        this.stats.active--
        this.stats.expired++
        this.emit('expired', { powerUp: activePowerUp.powerUp })

        // Remove after a short delay
        setTimeout(() => {
          this.activePowerUps.delete(id)
        }, 100)
      }
    }
  }

  /**
   * Remove a power-up
   */
  remove(powerUpId: string): boolean {
    const powerUp = this.powerUps.get(powerUpId)

    if (!powerUp) {
      return false
    }

    this.powerUps.delete(powerUpId)
    this.emit('removed', { powerUp })
    return true
  }

  /**
   * Check if a power-up type is currently active
   */
  isActive(type: PowerUp['type']): boolean {
    return Array.from(this.activePowerUps.values()).some(
      (ap) => ap.powerUp.type === type && ap.isActive
    )
  }

  /**
   * Get active power-ups of a specific type
   */
  getActivePowerUps(type?: PowerUp['type']): ActivePowerUp[] {
    const active = Array.from(this.activePowerUps.values()).filter((ap) => ap.isActive)

    if (type) {
      return active.filter((ap) => ap.powerUp.type === type)
    }

    return active
  }

  /**
   * Get all power-ups (spawned but not collected)
   */
  getPowerUps(): PowerUp[] {
    return Array.from(this.powerUps.values())
  }

  /**
   * Get power-up by ID
   */
  getPowerUp(id: string): PowerUp | undefined {
    return this.powerUps.get(id)
  }

  /**
   * Get active effect multipliers
   */
  getEffectMultipliers(): {
    speed: number
    score: number
    time: number
  } {
    let speedMultiplier = 1
    let scoreMultiplier = 1
    let timeMultiplier = 1

    for (const activePowerUp of this.activePowerUps.values()) {
      if (!activePowerUp.isActive) continue

      const powerUp = activePowerUp.powerUp

      switch (powerUp.type) {
        case 'speed-boost':
          if ('multiplier' in powerUp) {
            speedMultiplier *= powerUp.multiplier
          }
          break
        case 'score-multiplier':
          if ('multiplier' in powerUp) {
            scoreMultiplier *= powerUp.multiplier
          }
          break
        case 'slow-motion':
          if ('factor' in powerUp) {
            timeMultiplier *= powerUp.factor
          }
          break
      }
    }

    return {
      speed: speedMultiplier,
      score: scoreMultiplier,
      time: timeMultiplier,
    }
  }

  /**
   * Get remaining time for active power-up
   */
  getRemainingTime(powerUpId: string): number {
    const activePowerUp = this.activePowerUps.get(powerUpId)

    if (!activePowerUp || !activePowerUp.isActive) {
      return 0
    }

    return Math.max(0, activePowerUp.endTime - Date.now())
  }

  /**
   * Get remaining time for power-up type
   */
  getRemainingTimeByType(type: PowerUp['type']): number {
    const active = this.getActivePowerUps(type)

    if (active.length === 0) {
      return 0
    }

    // Return the longest remaining time
    return Math.max(...active.map((ap) => this.getRemainingTime(ap.powerUp.id)))
  }

  /**
   * Clear all power-ups
   */
  clear(): void {
    this.powerUps.clear()
    this.activePowerUps.clear()
    this.stats.active = 0
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      collected: 0,
      active: 0,
      expired: 0,
      byType: {
        'double-jump': 0,
        invincibility: 0,
        'speed-boost': 0,
        'slow-motion': 0,
        'score-multiplier': 0,
      },
    }
  }

  /**
   * Get statistics
   */
  getStats(): PowerUpStats {
    return { ...this.stats }
  }

  /**
   * Get count of power-ups
   */
  getCount(): number {
    return this.powerUps.size
  }

  /**
   * Get count of active power-ups
   */
  getActiveCount(): number {
    return Array.from(this.activePowerUps.values()).filter((ap) => ap.isActive).length
  }

  /**
   * Get random power-up type
   */
  private getRandomType(): PowerUp['type'] {
    const types: PowerUp['type'][] = [
      'double-jump',
      'invincibility',
      'speed-boost',
      'slow-motion',
      'score-multiplier',
    ]

    // Weighted random selection
    const weights = {
      'double-jump': 20,
      invincibility: 10,
      'speed-boost': 25,
      'slow-motion': 15,
      'score-multiplier': 30,
    }

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight

    for (const type of types) {
      random -= weights[type]
      if (random <= 0) {
        return type
      }
    }

    return types[0]
  }

  /**
   * Subscribe to power-up events
   */
  on(event: PowerUpEventType, handler: PowerUpEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }

    this.eventHandlers.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler)
    }
  }

  /**
   * Emit event to subscribers
   */
  private emit(event: PowerUpEventType, data?: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in ${event} handler:`, error)
        }
      })
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PowerUpConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }

    // Restart with new config
    if (this.spawnTimer) {
      this.stop()
      this.start()
    }
  }

  /**
   * Get configuration
   */
  getConfig(): Required<PowerUpConfig> {
    return { ...this.config }
  }

  /**
   * Check collision with power-up
   */
  checkCollision(x: number, y: number, width: number, height: number): PowerUp | null {
    for (const powerUp of this.powerUps.values()) {
      if (powerUp.collected) continue

      const collision =
        x < powerUp.x + powerUp.width &&
        x + width > powerUp.x &&
        y < powerUp.y + powerUp.height &&
        y + height > powerUp.y

      if (collision) {
        return powerUp
      }
    }

    return null
  }

  /**
   * Cleanup and destroy manager
   */
  destroy(): void {
    this.stop()
    this.clear()
    this.eventHandlers.clear()
  }
}

/**
 * powerUpManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of powerUpManager.
 */
export const powerUpManager = new PowerUpManager()

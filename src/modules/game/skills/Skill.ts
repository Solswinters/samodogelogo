/**
 * Skill system for player abilities
 */

export interface SkillConfig {
  id: string
  name: string
  description: string
  cooldown: number
  manaCost?: number
  duration?: number
  damage?: number
  effect?: string
}

export class Skill {
  id: string
  name: string
  description: string
  cooldown: number
  manaCost: number
  duration: number
  damage: number
  effect: string

  private lastUsed: number
  private isActive: boolean
  private activationTime: number

  constructor(config: SkillConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.cooldown = config.cooldown
    this.manaCost = config.manaCost ?? 0
    this.duration = config.duration ?? 0
    this.damage = config.damage ?? 0
    this.effect = config.effect ?? ''

    this.lastUsed = 0
    this.isActive = false
    this.activationTime = 0
  }

  canUse(currentTime: number, currentMana: number): boolean {
    if (this.isActive) {
      return false
    }

    if (currentMana < this.manaCost) {
      return false
    }

    const timeSinceLastUse = currentTime - this.lastUsed
    return timeSinceLastUse >= this.cooldown
  }

  use(currentTime: number): boolean {
    if (this.isActive) {
      return false
    }

    this.lastUsed = currentTime
    this.isActive = this.duration > 0
    this.activationTime = currentTime

    return true
  }

  update(currentTime: number): void {
    if (this.isActive && this.duration > 0) {
      const elapsed = currentTime - this.activationTime
      if (elapsed >= this.duration) {
        this.isActive = false
      }
    }
  }

  getRemainingCooldown(currentTime: number): number {
    const timeSinceLastUse = currentTime - this.lastUsed
    return Math.max(0, this.cooldown - timeSinceLastUse)
  }

  getCooldownPercent(currentTime: number): number {
    const remaining = this.getRemainingCooldown(currentTime)
    return (remaining / this.cooldown) * 100
  }

  isReady(currentTime: number): boolean {
    return this.getRemainingCooldown(currentTime) === 0
  }

  getRemainingDuration(currentTime: number): number {
    if (!this.isActive) {
      return 0
    }

    const elapsed = currentTime - this.activationTime
    return Math.max(0, this.duration - elapsed)
  }

  deactivate(): void {
    this.isActive = false
  }
}

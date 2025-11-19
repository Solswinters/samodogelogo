/**
 * Health management system
 */

export interface HealthConfig {
  maxHealth: number
  currentHealth?: number
  shield?: number
  regeneration?: number
}

export class HealthSystem {
  private maxHealth: number
  private currentHealth: number
  private shield: number
  private regeneration: number
  private isDead: boolean

  constructor(config: HealthConfig) {
    this.maxHealth = config.maxHealth
    this.currentHealth = config.currentHealth ?? config.maxHealth
    this.shield = config.shield ?? 0
    this.regeneration = config.regeneration ?? 0
    this.isDead = false
  }

  takeDamage(amount: number): { damage: number; shieldDamage: number; healthDamage: number } {
    if (this.isDead) {
      return { damage: 0, shieldDamage: 0, healthDamage: 0 }
    }

    let remaining = amount
    let shieldDamage = 0
    let healthDamage = 0

    // Damage shield first
    if (this.shield > 0) {
      shieldDamage = Math.min(this.shield, remaining)
      this.shield -= shieldDamage
      remaining -= shieldDamage
    }

    // Then damage health
    if (remaining > 0) {
      healthDamage = Math.min(this.currentHealth, remaining)
      this.currentHealth -= healthDamage
    }

    if (this.currentHealth <= 0) {
      this.currentHealth = 0
      this.isDead = true
    }

    return { damage: amount, shieldDamage, healthDamage }
  }

  heal(amount: number): number {
    if (this.isDead) {
      return 0
    }

    const oldHealth = this.currentHealth
    this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth)
    return this.currentHealth - oldHealth
  }

  addShield(amount: number): void {
    this.shield += amount
  }

  update(deltaTime: number): void {
    if (this.isDead || this.regeneration === 0) {
      return
    }

    const regenAmount = (this.regeneration * deltaTime) / 1000
    this.heal(regenAmount)
  }

  getHealthPercent(): number {
    return (this.currentHealth / this.maxHealth) * 100
  }

  isAlive(): boolean {
    return !this.isDead
  }

  reset(): void {
    this.currentHealth = this.maxHealth
    this.shield = 0
    this.isDead = false
  }

  getStats() {
    return {
      maxHealth: this.maxHealth,
      currentHealth: this.currentHealth,
      shield: this.shield,
      regeneration: this.regeneration,
      isDead: this.isDead,
      healthPercent: this.getHealthPercent(),
    }
  }
}

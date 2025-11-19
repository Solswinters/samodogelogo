/**
 * Buff/debuff system for temporary effects
 */

export type BuffType = 'speed' | 'damage' | 'defense' | 'health' | 'invincibility'

export interface BuffConfig {
  id: string
  name: string
  type: BuffType
  duration: number // milliseconds
  value: number
  stacks?: boolean
  maxStacks?: number
}

export class Buff {
  id: string
  name: string
  type: BuffType
  duration: number
  value: number
  stacks: boolean
  maxStacks: number
  currentStacks: number
  startTime: number
  remainingTime: number

  constructor(config: BuffConfig) {
    this.id = config.id
    this.name = config.name
    this.type = config.type
    this.duration = config.duration
    this.value = config.value
    this.stacks = config.stacks ?? false
    this.maxStacks = config.maxStacks ?? 1
    this.currentStacks = 1
    this.startTime = Date.now()
    this.remainingTime = config.duration
  }

  update(deltaTime: number): boolean {
    this.remainingTime -= deltaTime

    if (this.remainingTime <= 0) {
      return false // Buff expired
    }

    return true
  }

  addStack(): boolean {
    if (!this.stacks || this.currentStacks >= this.maxStacks) {
      return false
    }

    this.currentStacks++
    // Refresh duration on stack
    this.remainingTime = this.duration
    return true
  }

  getTotalValue(): number {
    return this.value * this.currentStacks
  }

  getProgress(): number {
    return 1 - this.remainingTime / this.duration
  }

  getRemainingPercent(): number {
    return (this.remainingTime / this.duration) * 100
  }

  refresh(): void {
    this.remainingTime = this.duration
    this.startTime = Date.now()
  }
}

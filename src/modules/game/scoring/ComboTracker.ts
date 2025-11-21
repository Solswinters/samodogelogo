/**
 * Combo Tracker - Track and manage combo chains
 */

export interface ComboConfig {
  decayTime: number // Time before combo starts decaying (ms)
  decayRate: number // Combo points lost per second
  maxCombo: number // Maximum combo value
  multiplierPerCombo: number // Score multiplier per combo point
}

export interface ComboEvent {
  type: 'start' | 'increment' | 'milestone' | 'break' | 'decay'
  combo: number
  multiplier: number
  timestamp: number
}

export class ComboTracker {
  private combo: number = 0
  private maxComboReached: number = 0
  private config: ComboConfig
  private lastActionTime: number = 0
  private isActive: boolean = false
  private comboHistory: number[] = []
  private milestones: number[] = [10, 25, 50, 100, 250, 500]
  private reachedMilestones: Set<number> = new Set()
  private onComboChange?: (combo: number, multiplier: number) => void
  private onComboBreak?: (finalCombo: number) => void
  private onMilestone?: (milestone: number) => void

  constructor(config?: Partial<ComboConfig>) {
    this.config = {
      decayTime: 3000,
      decayRate: 5,
      maxCombo: 999,
      multiplierPerCombo: 0.1,
      ...config,
    }
  }

  /**
   * Increment combo
   */
  increment(amount: number = 1): void {
    const previousCombo = this.combo

    this.combo = Math.min(this.combo + amount, this.config.maxCombo)
    this.lastActionTime = Date.now()

    if (!this.isActive && this.combo > 0) {
      this.isActive = true
    }

    // Update max combo
    if (this.combo > this.maxComboReached) {
      this.maxComboReached = this.combo
    }

    // Check milestones
    for (const milestone of this.milestones) {
      if (this.combo >= milestone && !this.reachedMilestones.has(milestone)) {
        this.reachedMilestones.add(milestone)
        if (this.onMilestone) {
          this.onMilestone(milestone)
        }
      }
    }

    // Notify change
    if (this.onComboChange) {
      this.onComboChange(this.combo, this.getMultiplier())
    }
  }

  /**
   * Update combo (handles decay)
   */
  update(deltaTime: number): void {
    if (!this.isActive || this.combo === 0) return

    const timeSinceLastAction = Date.now() - this.lastActionTime

    // Check if combo should decay
    if (timeSinceLastAction > this.config.decayTime) {
      const decayAmount = (this.config.decayRate * deltaTime) / 1000

      this.combo = Math.max(0, this.combo - decayAmount)

      if (this.combo === 0) {
        this.breakCombo()
      } else if (this.onComboChange) {
        this.onComboChange(this.combo, this.getMultiplier())
      }
    }
  }

  /**
   * Break combo
   */
  breakCombo(): void {
    if (this.combo === 0 && !this.isActive) return

    const finalCombo = Math.floor(this.combo)

    if (finalCombo > 0) {
      this.comboHistory.push(finalCombo)

      // Keep only last 10 combos
      if (this.comboHistory.length > 10) {
        this.comboHistory.shift()
      }
    }

    this.combo = 0
    this.isActive = false
    this.reachedMilestones.clear()

    if (this.onComboBreak) {
      this.onComboBreak(finalCombo)
    }

    if (this.onComboChange) {
      this.onComboChange(0, 1)
    }
  }

  /**
   * Get current combo
   */
  getCombo(): number {
    return Math.floor(this.combo)
  }

  /**
   * Get combo multiplier
   */
  getMultiplier(): number {
    return 1 + this.combo * this.config.multiplierPerCombo
  }

  /**
   * Get max combo
   */
  getMaxCombo(): number {
    return this.maxComboReached
  }

  /**
   * Get combo percentage
   */
  getComboPercentage(): number {
    return (this.combo / this.config.maxCombo) * 100
  }

  /**
   * Get time remaining before decay
   */
  getTimeUntilDecay(): number {
    if (!this.isActive) return 0

    const timeSinceLastAction = Date.now() - this.lastActionTime
    return Math.max(0, this.config.decayTime - timeSinceLastAction)
  }

  /**
   * Get decay progress (0-1)
   */
  getDecayProgress(): number {
    if (!this.isActive) return 1

    const timeUntilDecay = this.getTimeUntilDecay()
    return 1 - timeUntilDecay / this.config.decayTime
  }

  /**
   * Check if combo is active
   */
  isComboActive(): boolean {
    return this.isActive
  }

  /**
   * Get combo history
   */
  getComboHistory(): number[] {
    return [...this.comboHistory]
  }

  /**
   * Get average combo
   */
  getAverageCombo(): number {
    if (this.comboHistory.length === 0) return 0
    const sum = this.comboHistory.reduce((a, b) => a + b, 0)
    return Math.floor(sum / this.comboHistory.length)
  }

  /**
   * Get next milestone
   */
  getNextMilestone(): number | null {
    for (const milestone of this.milestones) {
      if (this.combo < milestone) {
        return milestone
      }
    }
    return null
  }

  /**
   * Get reached milestones
   */
  getReachedMilestones(): number[] {
    return Array.from(this.reachedMilestones)
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks: {
    onComboChange?: (combo: number, multiplier: number) => void
    onComboBreak?: (finalCombo: number) => void
    onMilestone?: (milestone: number) => void
  }): void {
    this.onComboChange = callbacks.onComboChange
    this.onComboBreak = callbacks.onComboBreak
    this.onMilestone = callbacks.onMilestone
  }

  /**
   * Set config
   */
  setConfig(config: Partial<ComboConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Reset combo tracker
   */
  reset(): void {
    this.combo = 0
    this.maxComboReached = 0
    this.isActive = false
    this.comboHistory = []
    this.reachedMilestones.clear()
  }

  /**
   * Export stats
   */
  exportStats(): {
    currentCombo: number
    maxCombo: number
    averageCombo: number
    totalCombos: number
    milestones: number[]
  } {
    return {
      currentCombo: this.getCombo(),
      maxCombo: this.maxComboReached,
      averageCombo: this.getAverageCombo(),
      totalCombos: this.comboHistory.length,
      milestones: this.getReachedMilestones(),
    }
  }
}

export default ComboTracker

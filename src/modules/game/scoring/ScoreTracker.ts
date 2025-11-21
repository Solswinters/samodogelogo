/**
 * Score Tracker - Advanced score tracking with multipliers and bonuses
 */

export interface ScoreMultiplier {
  id: string
  value: number
  duration: number
  startTime: number
  source: string
}

export interface ScoreBonus {
  amount: number
  reason: string
  timestamp: number
}

export interface ScoreStats {
  totalScore: number
  baseScore: number
  bonusScore: number
  highestCombo: number
  totalBonuses: number
  averageMultiplier: number
  scorePerSecond: number
  timeElapsed: number
}

export class ScoreTracker {
  private score: number = 0
  private baseScore: number = 0
  private bonusScore: number = 0
  private multipliers: ScoreMultiplier[] = []
  private bonuses: ScoreBonus[] = []
  private scoreHistory: number[] = []
  private highScore: number = 0
  private startTime: number = 0
  private combo: number = 0
  private highestCombo: number = 0
  private onScoreChange?: (score: number) => void
  private onMultiplierChange?: (multiplier: number) => void

  constructor(highScore: number = 0) {
    this.highScore = highScore
    this.startTime = Date.now()
  }

  /**
   * Add score
   */
  addScore(points: number, applyMultiplier: boolean = true): void {
    const basePoints = Math.max(0, points)
    this.baseScore += basePoints

    let finalPoints = basePoints

    if (applyMultiplier) {
      const totalMultiplier = this.getTotalMultiplier()
      finalPoints = Math.floor(basePoints * totalMultiplier)
    }

    this.score += finalPoints
    this.scoreHistory.push(this.score)

    if (this.onScoreChange) {
      this.onScoreChange(this.score)
    }

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score
    }
  }

  /**
   * Add bonus score
   */
  addBonus(amount: number, reason: string): void {
    const bonus: ScoreBonus = {
      amount,
      reason,
      timestamp: Date.now(),
    }

    this.bonuses.push(bonus)
    this.bonusScore += amount
    this.addScore(amount, false)
  }

  /**
   * Add multiplier
   */
  addMultiplier(value: number, duration: number, source: string): string {
    const id = `multiplier-${Date.now()}-${Math.random().toString(36).substring(7)}`

    const multiplier: ScoreMultiplier = {
      id,
      value,
      duration,
      startTime: Date.now(),
      source,
    }

    this.multipliers.push(multiplier)

    if (this.onMultiplierChange) {
      this.onMultiplierChange(this.getTotalMultiplier())
    }

    return id
  }

  /**
   * Remove multiplier
   */
  removeMultiplier(id: string): void {
    const index = this.multipliers.findIndex((m) => m.id === id)

    if (index !== -1) {
      this.multipliers.splice(index, 1)

      if (this.onMultiplierChange) {
        this.onMultiplierChange(this.getTotalMultiplier())
      }
    }
  }

  /**
   * Get total multiplier
   */
  getTotalMultiplier(): number {
    const now = Date.now()
    let total = 1

    // Remove expired multipliers
    this.multipliers = this.multipliers.filter((m) => {
      const elapsed = now - m.startTime
      return elapsed < m.duration
    })

    // Calculate total multiplier
    for (const multiplier of this.multipliers) {
      total *= multiplier.value
    }

    return total
  }

  /**
   * Update (for cleaning up expired multipliers)
   */
  update(): void {
    const previousMultiplier = this.getTotalMultiplier()
    const currentMultiplier = this.getTotalMultiplier()

    if (previousMultiplier !== currentMultiplier && this.onMultiplierChange) {
      this.onMultiplierChange(currentMultiplier)
    }
  }

  /**
   * Get score
   */
  getScore(): number {
    return this.score
  }

  /**
   * Get high score
   */
  getHighScore(): number {
    return this.highScore
  }

  /**
   * Check if new high score
   */
  isNewHighScore(): boolean {
    return this.score === this.highScore && this.score > 0
  }

  /**
   * Increment combo
   */
  incrementCombo(): void {
    this.combo++

    if (this.combo > this.highestCombo) {
      this.highestCombo = this.combo
    }
  }

  /**
   * Reset combo
   */
  resetCombo(): void {
    this.combo = 0
  }

  /**
   * Get combo
   */
  getCombo(): number {
    return this.combo
  }

  /**
   * Get highest combo
   */
  getHighestCombo(): number {
    return this.highestCombo
  }

  /**
   * Get statistics
   */
  getStats(): ScoreStats {
    const timeElapsed = (Date.now() - this.startTime) / 1000

    return {
      totalScore: this.score,
      baseScore: this.baseScore,
      bonusScore: this.bonusScore,
      highestCombo: this.highestCombo,
      totalBonuses: this.bonuses.length,
      averageMultiplier: this.calculateAverageMultiplier(),
      scorePerSecond: timeElapsed > 0 ? this.score / timeElapsed : 0,
      timeElapsed,
    }
  }

  /**
   * Calculate average multiplier
   */
  private calculateAverageMultiplier(): number {
    if (this.scoreHistory.length < 2) {
      return 1
    }

    // Simplified calculation
    return this.score / Math.max(this.baseScore, 1)
  }

  /**
   * Get score history
   */
  getScoreHistory(): number[] {
    return [...this.scoreHistory]
  }

  /**
   * Get recent bonuses
   */
  getRecentBonuses(limit: number = 10): ScoreBonus[] {
    return this.bonuses.slice(-limit)
  }

  /**
   * Get active multipliers
   */
  getActiveMultipliers(): ScoreMultiplier[] {
    const now = Date.now()

    return this.multipliers.filter((m) => {
      const elapsed = now - m.startTime
      return elapsed < m.duration
    })
  }

  /**
   * Reset score
   */
  reset(): void {
    this.score = 0
    this.baseScore = 0
    this.bonusScore = 0
    this.multipliers = []
    this.bonuses = []
    this.scoreHistory = []
    this.combo = 0
    this.startTime = Date.now()
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks: {
    onScoreChange?: (score: number) => void
    onMultiplierChange?: (multiplier: number) => void
  }): void {
    this.onScoreChange = callbacks.onScoreChange
    this.onMultiplierChange = callbacks.onMultiplierChange
  }

  /**
   * Export data
   */
  export(): {
    score: number
    highScore: number
    highestCombo: number
    stats: ScoreStats
  } {
    return {
      score: this.score,
      highScore: this.highScore,
      highestCombo: this.highestCombo,
      stats: this.getStats(),
    }
  }
}

export default ScoreTracker

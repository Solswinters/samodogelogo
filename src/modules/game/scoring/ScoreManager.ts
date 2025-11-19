/**
 * Score tracking and combo system
 */

export interface ScoreState {
  current: number
  high: number
  combo: number
  maxCombo: number
  comboMultiplier: number
}

export class ScoreManager {
  private state: ScoreState = {
    current: 0,
    high: 0,
    combo: 0,
    maxCombo: 0,
    comboMultiplier: 1,
  }

  private comboTimeout: NodeJS.Timeout | null = null
  private comboTimeoutDuration = 3000

  addPoints(basePoints: number): void {
    const points = Math.floor(basePoints * this.state.comboMultiplier)
    this.state.current += points

    if (this.state.current > this.state.high) {
      this.state.high = this.state.current
    }

    this.incrementCombo()
  }

  private incrementCombo(): void {
    this.state.combo++

    if (this.state.combo > this.state.maxCombo) {
      this.state.maxCombo = this.state.combo
    }

    // Increase multiplier with combo
    this.state.comboMultiplier = 1 + Math.min(this.state.combo * 0.1, 4)

    // Reset combo timeout
    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout)
    }

    this.comboTimeout = setTimeout(() => {
      this.resetCombo()
    }, this.comboTimeoutDuration)
  }

  resetCombo(): void {
    this.state.combo = 0
    this.state.comboMultiplier = 1

    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout)
      this.comboTimeout = null
    }
  }

  getCurrentScore(): number {
    return this.state.current
  }

  getHighScore(): number {
    return this.state.high
  }

  getCombo(): number {
    return this.state.combo
  }

  getComboMultiplier(): number {
    return this.state.comboMultiplier
  }

  getState(): ScoreState {
    return { ...this.state }
  }

  reset(): void {
    const highScore = this.state.high
    this.state = {
      current: 0,
      high: highScore,
      combo: 0,
      maxCombo: 0,
      comboMultiplier: 1,
    }

    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout)
      this.comboTimeout = null
    }
  }

  setHighScore(score: number): void {
    this.state.high = Math.max(this.state.high, score)
  }
}

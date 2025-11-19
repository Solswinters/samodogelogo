/**
 * Detailed statistics tracking
 */

export interface GameStats {
  // Session stats
  currentScore: number
  currentTime: number
  currentCombo: number
  currentObstacles: number

  // Lifetime stats
  totalGamesPlayed: number
  totalScore: number
  totalTime: number
  totalJumps: number
  totalObstaclesPassed: number
  totalPowerUpsCollected: number

  // Records
  highestScore: number
  longestRun: number
  maxCombo: number

  // Per-mode stats
  endlessHighScore: number
  timeAttackHighScore: number
  hardcoreHighScore: number
}

export class StatsTracker {
  private stats: GameStats

  constructor() {
    this.stats = this.getDefaultStats()
  }

  private getDefaultStats(): GameStats {
    return {
      currentScore: 0,
      currentTime: 0,
      currentCombo: 0,
      currentObstacles: 0,
      totalGamesPlayed: 0,
      totalScore: 0,
      totalTime: 0,
      totalJumps: 0,
      totalObstaclesPassed: 0,
      totalPowerUpsCollected: 0,
      highestScore: 0,
      longestRun: 0,
      maxCombo: 0,
      endlessHighScore: 0,
      timeAttackHighScore: 0,
      hardcoreHighScore: 0,
    }
  }

  recordGameStart(): void {
    this.stats.totalGamesPlayed++
    this.resetSession()
  }

  recordGameEnd(score: number, time: number): void {
    this.stats.totalScore += score
    this.stats.totalTime += time

    if (score > this.stats.highestScore) {
      this.stats.highestScore = score
    }

    if (time > this.stats.longestRun) {
      this.stats.longestRun = time
    }
  }

  recordJump(): void {
    this.stats.totalJumps++
  }

  recordObstaclePassed(): void {
    this.stats.currentObstacles++
    this.stats.totalObstaclesPassed++
  }

  recordPowerUpCollected(): void {
    this.stats.totalPowerUpsCollected++
  }

  updateCombo(combo: number): void {
    this.stats.currentCombo = combo
    if (combo > this.stats.maxCombo) {
      this.stats.maxCombo = combo
    }
  }

  updateModeHighScore(mode: 'endless' | 'timeAttack' | 'hardcore', score: number): void {
    switch (mode) {
      case 'endless':
        if (score > this.stats.endlessHighScore) {
          this.stats.endlessHighScore = score
        }
        break
      case 'timeAttack':
        if (score > this.stats.timeAttackHighScore) {
          this.stats.timeAttackHighScore = score
        }
        break
      case 'hardcore':
        if (score > this.stats.hardcoreHighScore) {
          this.stats.hardcoreHighScore = score
        }
        break
    }
  }

  getStats(): GameStats {
    return { ...this.stats }
  }

  getAverageScore(): number {
    return this.stats.totalGamesPlayed > 0 ? this.stats.totalScore / this.stats.totalGamesPlayed : 0
  }

  getAverageTime(): number {
    return this.stats.totalGamesPlayed > 0 ? this.stats.totalTime / this.stats.totalGamesPlayed : 0
  }

  resetSession(): void {
    this.stats.currentScore = 0
    this.stats.currentTime = 0
    this.stats.currentCombo = 0
    this.stats.currentObstacles = 0
  }

  loadFromSave(savedStats: Partial<GameStats>): void {
    this.stats = { ...this.stats, ...savedStats }
  }
}

export const statsTracker = new StatsTracker()

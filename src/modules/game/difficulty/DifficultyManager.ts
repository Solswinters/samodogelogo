/**
 * Dynamic difficulty adjustment system
 */

export interface DifficultyConfig {
  obstacleSpeed: number
  spawnRate: number
  obstacleHeight: number
  minGap: number
  scoreMultiplier: number
}

export class DifficultyManager {
  private baseConfig: DifficultyConfig = {
    obstacleSpeed: 5,
    spawnRate: 1500,
    obstacleHeight: 1,
    minGap: 200,
    scoreMultiplier: 1,
  }

  private currentLevel: number = 1
  private survivalTime: number = 0

  update(deltaTime: number): void {
    this.survivalTime += deltaTime

    // Increase level every 30 seconds
    const newLevel = Math.floor(this.survivalTime / 30000) + 1
    if (newLevel > this.currentLevel) {
      this.currentLevel = newLevel
    }
  }

  getCurrentConfig(): DifficultyConfig {
    const level = this.currentLevel

    return {
      obstacleSpeed: this.baseConfig.obstacleSpeed + (level - 1) * 0.5,
      spawnRate: Math.max(800, this.baseConfig.spawnRate - (level - 1) * 50),
      obstacleHeight: this.baseConfig.obstacleHeight + (level - 1) * 0.1,
      minGap: Math.max(150, this.baseConfig.minGap - (level - 1) * 5),
      scoreMultiplier: 1 + (level - 1) * 0.1,
    }
  }

  getDifficultyFactor(): number {
    return Math.min(this.currentLevel / 20, 1)
  }

  getCurrentLevel(): number {
    return this.currentLevel
  }

  getSurvivalTime(): number {
    return this.survivalTime
  }

  reset(): void {
    this.currentLevel = 1
    this.survivalTime = 0
  }

  setDifficulty(preset: 'easy' | 'normal' | 'hard' | 'expert'): void {
    const presets = {
      easy: { speed: 3, spawnRate: 2000, height: 0.7, gap: 250, multiplier: 0.8 },
      normal: { speed: 5, spawnRate: 1500, height: 1, gap: 200, multiplier: 1 },
      hard: { speed: 7, spawnRate: 1200, height: 1.3, gap: 180, multiplier: 1.3 },
      expert: { speed: 10, spawnRate: 1000, height: 1.5, gap: 150, multiplier: 1.5 },
    }

    const config = presets[preset]
    this.baseConfig = {
      obstacleSpeed: config.speed,
      spawnRate: config.spawnRate,
      obstacleHeight: config.height,
      minGap: config.gap,
      scoreMultiplier: config.multiplier,
    }
  }
}

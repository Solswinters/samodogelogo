/**
 * Dynamic difficulty adjustment system with adaptive scaling
 */

export interface DifficultyConfig {
  obstacleSpeed: number
  spawnRate: number
  obstacleHeight: number
  minGap: number
  scoreMultiplier: number
  powerUpFrequency: number
}

export type DifficultyPreset = 'easy' | 'normal' | 'hard' | 'expert' | 'nightmare'

export interface DifficultyMetrics {
  level: number
  survivalTime: number
  difficultyFactor: number
  config: DifficultyConfig
  preset: DifficultyPreset
}

export class DifficultyManager {
  private baseConfig: DifficultyConfig = {
    obstacleSpeed: 5,
    spawnRate: 1500,
    obstacleHeight: 1,
    minGap: 200,
    scoreMultiplier: 1,
    powerUpFrequency: 0.2,
  }

  private currentLevel: number = 1
  private survivalTime: number = 0
  private currentPreset: DifficultyPreset = 'normal'
  private levelUpCallbacks: Set<(level: number) => void> = new Set()
  private maxLevel: number = 50
  private adaptiveScaling: boolean = true

  update(deltaTime: number): void {
    this.survivalTime += deltaTime

    // Increase level every 30 seconds
    const newLevel = Math.min(Math.floor(this.survivalTime / 30000) + 1, this.maxLevel)
    if (newLevel > this.currentLevel) {
      this.currentLevel = newLevel
      this.onLevelUp(newLevel)
    }
  }

  private onLevelUp(level: number): void {
    this.levelUpCallbacks.forEach((callback) => callback(level))
  }

  onLevelUp(callback: (level: number) => void): () => void {
    this.levelUpCallbacks.add(callback)
    return () => this.levelUpCallbacks.delete(callback)
  }

  getCurrentConfig(): DifficultyConfig {
    const level = this.currentLevel
    const scaleFactor = this.adaptiveScaling ? this.getAdaptiveScale(level) : 1

    return {
      obstacleSpeed: this.baseConfig.obstacleSpeed + (level - 1) * 0.5 * scaleFactor,
      spawnRate: Math.max(800, this.baseConfig.spawnRate - (level - 1) * 50 * scaleFactor),
      obstacleHeight: this.baseConfig.obstacleHeight + (level - 1) * 0.1 * scaleFactor,
      minGap: Math.max(150, this.baseConfig.minGap - (level - 1) * 5 * scaleFactor),
      scoreMultiplier: 1 + (level - 1) * 0.1,
      powerUpFrequency: Math.max(0.05, this.baseConfig.powerUpFrequency - (level - 1) * 0.01),
    }
  }

  private getAdaptiveScale(level: number): number {
    // Logarithmic scaling for later levels
    if (level <= 10) {
      return 1
    }
    return 1 + Math.log(level - 9) * 0.1
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

  setDifficulty(preset: DifficultyPreset): void {
    const presets: Record<
      DifficultyPreset,
      {
        speed: number
        spawnRate: number
        height: number
        gap: number
        multiplier: number
        powerUp: number
      }
    > = {
      easy: { speed: 3, spawnRate: 2000, height: 0.7, gap: 250, multiplier: 0.8, powerUp: 0.3 },
      normal: { speed: 5, spawnRate: 1500, height: 1, gap: 200, multiplier: 1, powerUp: 0.2 },
      hard: { speed: 7, spawnRate: 1200, height: 1.3, gap: 180, multiplier: 1.3, powerUp: 0.15 },
      expert: { speed: 10, spawnRate: 1000, height: 1.5, gap: 150, multiplier: 1.5, powerUp: 0.1 },
      nightmare: { speed: 15, spawnRate: 800, height: 2, gap: 120, multiplier: 2, powerUp: 0.05 },
    }

    const config = presets[preset]
    this.currentPreset = preset
    this.baseConfig = {
      obstacleSpeed: config.speed,
      spawnRate: config.spawnRate,
      obstacleHeight: config.height,
      minGap: config.gap,
      scoreMultiplier: config.multiplier,
      powerUpFrequency: config.powerUp,
    }
  }

  getMetrics(): DifficultyMetrics {
    return {
      level: this.currentLevel,
      survivalTime: this.survivalTime,
      difficultyFactor: this.getDifficultyFactor(),
      config: this.getCurrentConfig(),
      preset: this.currentPreset,
    }
  }

  setMaxLevel(level: number): void {
    this.maxLevel = Math.max(1, level)
  }

  setAdaptiveScaling(enabled: boolean): void {
    this.adaptiveScaling = enabled
  }

  getTimeToNextLevel(): number {
    const nextLevelTime = this.currentLevel * 30000
    return Math.max(0, nextLevelTime - this.survivalTime)
  }

  getProgressToNextLevel(): number {
    const currentLevelTime = (this.currentLevel - 1) * 30000
    const nextLevelTime = this.currentLevel * 30000
    const progress = (this.survivalTime - currentLevelTime) / (nextLevelTime - currentLevelTime)
    return Math.min(1, Math.max(0, progress))
  }

  setCustomConfig(config: Partial<DifficultyConfig>): void {
    this.baseConfig = { ...this.baseConfig, ...config }
  }

  getPreset(): DifficultyPreset {
    return this.currentPreset
  }

  cleanup(): void {
    this.levelUpCallbacks.clear()
  }
}

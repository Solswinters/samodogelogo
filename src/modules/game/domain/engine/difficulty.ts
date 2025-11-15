/**
 * Difficulty progression algorithm
 */

export interface DifficultyConfig {
  initialSpeed: number;
  maxSpeed: number;
  speedIncreaseRate: number;
  difficultyInterval: number;
  maxDifficulty: number;
}

export interface DifficultyLevel {
  level: number;
  speed: number;
  spawnRate: number;
  obstacleVariety: number;
  scoreMultiplier: number;
}

const DEFAULT_CONFIG: DifficultyConfig = {
  initialSpeed: 5,
  maxSpeed: 12,
  speedIncreaseRate: 0.5,
  difficultyInterval: 30000, // 30 seconds
  maxDifficulty: 10,
};

export class DifficultyManager {
  private config: DifficultyConfig;
  private currentLevel: number = 1;
  private startTime: number = 0;

  constructor(config: Partial<DifficultyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start difficulty progression
   */
  start(): void {
    this.startTime = Date.now();
    this.currentLevel = 1;
  }

  /**
   * Update difficulty based on elapsed time
   */
  update(gameTime: number): DifficultyLevel {
    // Calculate difficulty level based on time
    const timeInSeconds = gameTime / 1000;
    const intervalsElapsed = Math.floor(timeInSeconds / (this.config.difficultyInterval / 1000));
    this.currentLevel = Math.min(intervalsElapsed + 1, this.config.maxDifficulty);

    return this.getCurrentDifficulty();
  }

  /**
   * Get current difficulty level
   */
  getCurrentDifficulty(): DifficultyLevel {
    const speedProgress = Math.min(
      (this.currentLevel - 1) / (this.config.maxDifficulty - 1),
      1
    );
    const speed =
      this.config.initialSpeed +
      (this.config.maxSpeed - this.config.initialSpeed) * speedProgress;

    return {
      level: this.currentLevel,
      speed,
      spawnRate: 1 + this.currentLevel * 0.1, // Spawn rate increases with level
      obstacleVariety: Math.min(1 + Math.floor(this.currentLevel / 2), 5), // More variety
      scoreMultiplier: 1 + (this.currentLevel - 1) * 0.2, // 20% increase per level
    };
  }

  /**
   * Get difficulty level by game time
   */
  getDifficultyAt(gameTime: number): DifficultyLevel {
    const timeInSeconds = gameTime / 1000;
    const intervalsElapsed = Math.floor(timeInSeconds / (this.config.difficultyInterval / 1000));
    const level = Math.min(intervalsElapsed + 1, this.config.maxDifficulty);

    const speedProgress = Math.min((level - 1) / (this.config.maxDifficulty - 1), 1);
    const speed =
      this.config.initialSpeed +
      (this.config.maxSpeed - this.config.initialSpeed) * speedProgress;

    return {
      level,
      speed,
      spawnRate: 1 + level * 0.1,
      obstacleVariety: Math.min(1 + Math.floor(level / 2), 5),
      scoreMultiplier: 1 + (level - 1) * 0.2,
    };
  }

  /**
   * Reset difficulty
   */
  reset(): void {
    this.currentLevel = 1;
    this.startTime = 0;
  }

  /**
   * Get current level
   */
  getLevel(): number {
    return this.currentLevel;
  }

  /**
   * Set custom level (for testing)
   */
  setLevel(level: number): void {
    this.currentLevel = Math.min(Math.max(level, 1), this.config.maxDifficulty);
  }
}


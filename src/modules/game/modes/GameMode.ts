/**
 * Game mode definitions and behaviors
 */

export interface GameModeConfig {
  name: string
  description: string
  difficulty: number
  lives: number
  timeLimit?: number
  scoreMultiplier: number
  enablePowerUps: boolean
  enableObstacleVariety: boolean
}

export abstract class GameMode {
  protected config: GameModeConfig

  constructor(config: GameModeConfig) {
    this.config = config
  }

  abstract onStart(): void
  abstract onEnd(score: number): void
  abstract onDeath(): boolean // Returns true if game should continue

  getConfig(): GameModeConfig {
    return { ...this.config }
  }

  getName(): string {
    return this.config.name
  }
}

export class EndlessModeconfig extends GameMode {
  constructor() {
    super({
      name: 'Endless',
      description: 'Survive as long as possible',
      difficulty: 1,
      lives: 1,
      scoreMultiplier: 1,
      enablePowerUps: true,
      enableObstacleVariety: true,
    })
  }

  onStart(): void {
    // Endless mode setup
  }

  onEnd(score: number): void {
    // Record endless score
  }

  onDeath(): boolean {
    return false // Game ends on death
  }
}

export class TimeAttackMode extends GameMode {
  private startTime: number = 0

  constructor() {
    super({
      name: 'Time Attack',
      description: 'Score as much as possible in 2 minutes',
      difficulty: 1.2,
      lives: 3,
      timeLimit: 120000, // 2 minutes
      scoreMultiplier: 1.5,
      enablePowerUps: true,
      enableObstacleVariety: true,
    })
  }

  onStart(): void {
    this.startTime = Date.now()
  }

  onEnd(score: number): void {
    const finalTime = Date.now() - this.startTime
    // Record time attack score
  }

  onDeath(): boolean {
    return this.config.lives > 0
  }
}

export class HardcoreMode extends GameMode {
  constructor() {
    super({
      name: 'Hardcore',
      description: 'No power-ups, higher difficulty',
      difficulty: 1.5,
      lives: 1,
      scoreMultiplier: 2,
      enablePowerUps: false,
      enableObstacleVariety: true,
    })
  }

  onStart(): void {
    // Hardcore mode setup
  }

  onEnd(score: number): void {
    // Record hardcore score
  }

  onDeath(): boolean {
    return false
  }
}

/**
 * gameModes utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of gameModes.
 */
export const gameModes = {
  endless: () => new EndlessModeconfig(),
  timeAttack: () => new TimeAttackMode(),
  hardcore: () => new HardcoreMode(),
}

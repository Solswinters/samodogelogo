/**
 * Centralized game configuration
 */

export interface GameConfigData {
  canvas: {
    width: number
    height: number
    backgroundColor: string
  }
  physics: {
    gravity: number
    jumpPower: number
    terminalVelocity: number
  }
  gameplay: {
    startingLives: number
    defaultDifficulty: string
    comboTimeout: number
    scorePerObstacle: number
  }
  powerups: {
    spawnRate: number
    duration: number
  }
  rewards: {
    baseReward: number
    scoreDivisor: number
    cooldown: number
  }
  features: {
    enableParticles: boolean
    enableTrail: boolean
    enableScreenShake: boolean
    enableSoundEffects: boolean
    enableMusic: boolean
  }
}

export class GameConfig {
  private static instance: GameConfig
  private config: GameConfigData

  private constructor() {
    this.config = this.getDefaultConfig()
  }

  static getInstance(): GameConfig {
    if (!GameConfig.instance) {
      GameConfig.instance = new GameConfig()
    }
    return GameConfig.instance
  }

  private getDefaultConfig(): GameConfigData {
    return {
      canvas: {
        width: 800,
        height: 400,
        backgroundColor: '#1a1a2e',
      },
      physics: {
        gravity: 0.6,
        jumpPower: 12,
        terminalVelocity: 20,
      },
      gameplay: {
        startingLives: 3,
        defaultDifficulty: 'normal',
        comboTimeout: 3000,
        scorePerObstacle: 10,
      },
      powerups: {
        spawnRate: 5000,
        duration: 10000,
      },
      rewards: {
        baseReward: 10,
        scoreDivisor: 100,
        cooldown: 3600000,
      },
      features: {
        enableParticles: true,
        enableTrail: true,
        enableScreenShake: true,
        enableSoundEffects: true,
        enableMusic: true,
      },
    }
  }

  get<K extends keyof GameConfigData>(key: K): GameConfigData[K] {
    return this.config[key]
  }

  set<K extends keyof GameConfigData>(key: K, value: GameConfigData[K]): void {
    this.config[key] = value
  }

  getAll(): GameConfigData {
    return { ...this.config }
  }

  update(updates: Partial<GameConfigData>): void {
    this.config = { ...this.config, ...updates }
  }

  reset(): void {
    this.config = this.getDefaultConfig()
  }
}

/**
 * gameConfig utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of gameConfig.
 */
export const gameConfig = GameConfig.getInstance()

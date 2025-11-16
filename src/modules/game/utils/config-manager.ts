/**
 * Game configuration management
 */

import { GAME_CONSTANTS } from '@/constants/game'
import { storage } from '@/utils/storage'
import { logger } from '@/utils/logger'

interface GameConfig {
  canvas: {
    width: number
    height: number
  }
  player: {
    width: number
    height: number
    speed: number
    jumpForce: number
  }
  physics: {
    gravity: number
    groundY: number
  }
  obstacles: {
    minHeight: number
    maxHeight: number
    width: number
    spawnDistance: number
    speed: number
  }
  scoring: {
    pointsPerSecond: number
    pointsPerObstacle: number
  }
  difficulty: {
    initialSpeed: number
    maxSpeed: number
    speedIncrement: number
    difficultyInterval: number
  }
}

const DEFAULT_CONFIG: GameConfig = {
  canvas: {
    width: GAME_CONSTANTS.CANVAS_WIDTH,
    height: GAME_CONSTANTS.CANVAS_HEIGHT,
  },
  player: {
    width: GAME_CONSTANTS.PLAYER_WIDTH,
    height: GAME_CONSTANTS.PLAYER_HEIGHT,
    speed: GAME_CONSTANTS.PLAYER_SPEED,
    jumpForce: GAME_CONSTANTS.JUMP_FORCE,
  },
  physics: {
    gravity: GAME_CONSTANTS.GRAVITY,
    groundY: GAME_CONSTANTS.GROUND_Y,
  },
  obstacles: {
    minHeight: GAME_CONSTANTS.OBSTACLE_MIN_HEIGHT,
    maxHeight: GAME_CONSTANTS.OBSTACLE_MAX_HEIGHT,
    width: GAME_CONSTANTS.OBSTACLE_WIDTH,
    spawnDistance: GAME_CONSTANTS.OBSTACLE_SPAWN_DISTANCE,
    speed: GAME_CONSTANTS.OBSTACLE_SPEED,
  },
  scoring: {
    pointsPerSecond: GAME_CONSTANTS.BASE_SCORE_PER_SECOND,
    pointsPerObstacle: GAME_CONSTANTS.SCORE_PER_OBSTACLE,
  },
  difficulty: {
    initialSpeed: GAME_CONSTANTS.INITIAL_SPEED,
    maxSpeed: GAME_CONSTANTS.MAX_SPEED,
    speedIncrement: GAME_CONSTANTS.SPEED_INCREMENT,
    difficultyInterval: GAME_CONSTANTS.DIFFICULTY_INTERVAL,
  },
}

class ConfigManager {
  private config: GameConfig

  constructor() {
    this.config = this.loadConfig()
  }

  private loadConfig(): GameConfig {
    try {
      const saved = storage.get<Partial<GameConfig>>('game-config')
      if (saved) {
        logger.info('Loaded custom game config')
        return { ...DEFAULT_CONFIG, ...saved }
      }
    } catch (error) {
      logger.error('Failed to load game config', error)
    }
    return { ...DEFAULT_CONFIG }
  }

  private saveConfig(): void {
    try {
      storage.set('game-config', this.config)
    } catch (error) {
      logger.error('Failed to save game config', error)
    }
  }

  getConfig(): Readonly<GameConfig> {
    return this.config
  }

  getCanvasConfig() {
    return this.config.canvas
  }

  getPlayerConfig() {
    return this.config.player
  }

  getPhysicsConfig() {
    return this.config.physics
  }

  getObstaclesConfig() {
    return this.config.obstacles
  }

  getScoringConfig() {
    return this.config.scoring
  }

  getDifficultyConfig() {
    return this.config.difficulty
  }

  updateConfig(partial: Partial<GameConfig>): void {
    this.config = { ...this.config, ...partial }
    this.saveConfig()
    logger.info('Game config updated')
  }

  resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIG }
    this.saveConfig()
    logger.info('Game config reset to defaults')
  }
}

export const configManager = new ConfigManager()
export type { GameConfig }

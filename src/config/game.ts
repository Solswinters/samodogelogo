import { GAME_CONSTANTS } from '@/constants/game'

// Game configuration management system
export interface GameConfiguration {
  canvas: {
    width: number
    height: number
  }
  player: {
    width: number
    height: number
    startX: number
    color: string
  }
  physics: {
    gravity: number
    jumpForce: number
    groundY: number
  }
  gameplay: {
    initialSpeed: number
    maxSpeed: number
    speedIncrement: number
    difficultyInterval: number
    difficultyMultiplier: number
    maxDifficulty: number
  }
  obstacles: {
    width: number
    minHeight: number
    maxHeight: number
    spawnDistance: number
  }
  scoring: {
    pointsPerSecond: number
    pointsPerObstacle: number
    timeToScoreDivisor: number
  }
  rewards: {
    baseReward: number
    scoreBonusDivisor: number
    winnerMultiplier: number
    cooldownPeriod: number
  }
  multiplayer: {
    maxPlayersPerRoom: number
    roomTimeout: number
    syncInterval: number
  }
}

// Default configuration
const defaultConfig: GameConfiguration = {
  canvas: {
    width: GAME_CONSTANTS.CANVAS_WIDTH,
    height: GAME_CONSTANTS.CANVAS_HEIGHT,
  },
  player: {
    width: GAME_CONSTANTS.PLAYER_WIDTH,
    height: GAME_CONSTANTS.PLAYER_HEIGHT,
    startX: GAME_CONSTANTS.PLAYER_START_X,
    color: '#3B82F6',
  },
  physics: {
    gravity: GAME_CONSTANTS.GRAVITY,
    jumpForce: GAME_CONSTANTS.JUMP_FORCE,
    groundY: GAME_CONSTANTS.GROUND_Y,
  },
  gameplay: {
    initialSpeed: GAME_CONSTANTS.INITIAL_GAME_SPEED,
    maxSpeed: GAME_CONSTANTS.MAX_GAME_SPEED,
    speedIncrement: GAME_CONSTANTS.SPEED_INCREMENT,
    difficultyInterval: GAME_CONSTANTS.DIFFICULTY_INCREASE_INTERVAL,
    difficultyMultiplier: GAME_CONSTANTS.DIFFICULTY_MULTIPLIER,
    maxDifficulty: GAME_CONSTANTS.MAX_DIFFICULTY,
  },
  obstacles: {
    width: GAME_CONSTANTS.OBSTACLE_WIDTH,
    minHeight: GAME_CONSTANTS.OBSTACLE_MIN_HEIGHT,
    maxHeight: GAME_CONSTANTS.OBSTACLE_MAX_HEIGHT,
    spawnDistance: GAME_CONSTANTS.OBSTACLE_SPAWN_DISTANCE,
  },
  scoring: {
    pointsPerSecond: GAME_CONSTANTS.SCORE_PER_SECOND,
    pointsPerObstacle: GAME_CONSTANTS.SCORE_PER_OBSTACLE,
    timeToScoreDivisor: GAME_CONSTANTS.TIME_TO_SCORE_DIVISOR,
  },
  rewards: {
    baseReward: GAME_CONSTANTS.BASE_REWARD,
    scoreBonusDivisor: GAME_CONSTANTS.SCORE_BONUS_DIVISOR,
    winnerMultiplier: GAME_CONSTANTS.WINNER_MULTIPLIER,
    cooldownPeriod: GAME_CONSTANTS.COOLDOWN_PERIOD,
  },
  multiplayer: {
    maxPlayersPerRoom: GAME_CONSTANTS.MAX_PLAYERS_PER_ROOM,
    roomTimeout: GAME_CONSTANTS.ROOM_TIMEOUT,
    syncInterval: GAME_CONSTANTS.SYNC_INTERVAL,
  },
}

// Configuration manager
class GameConfigManager {
  private config: GameConfiguration

  constructor(initialConfig: GameConfiguration = defaultConfig) {
    this.config = { ...initialConfig }
  }

  get(): GameConfiguration {
    return { ...this.config }
  }

  set(newConfig: Partial<GameConfiguration>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    }
  }

  reset(): void {
    this.config = { ...defaultConfig }
  }

  getCanvas() {
    return this.config.canvas
  }

  getPlayer() {
    return this.config.player
  }

  getPhysics() {
    return this.config.physics
  }

  getGameplay() {
    return this.config.gameplay
  }

  getObstacles() {
    return this.config.obstacles
  }

  getScoring() {
    return this.config.scoring
  }

  getRewards() {
    return this.config.rewards
  }

  getMultiplayer() {
    return this.config.multiplayer
  }
}

// Export singleton instance
export const gameConfig = new GameConfigManager()

// Export default configuration
export { defaultConfig as defaultGameConfig }


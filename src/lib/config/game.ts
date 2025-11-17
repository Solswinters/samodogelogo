/**
 * Game configuration and constants
 */

export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  PLAYER_WIDTH: 50,
  PLAYER_HEIGHT: 50,
  PLAYER_START_X: 100,
  PLAYER_SPEED: 5,
  JUMP_FORCE: -15,
  GRAVITY: 0.8,
  OBSTACLE_MIN_HEIGHT: 30,
  OBSTACLE_MAX_HEIGHT: 150,
  OBSTACLE_WIDTH: 30,
  OBSTACLE_SPAWN_DISTANCE: 300,
  OBSTACLE_SPEED: 5,
  GROUND_Y: 500,
  BASE_SCORE_PER_SECOND: 10,
  SCORE_PER_SECOND: 10,
  SCORE_PER_OBSTACLE: 50,
  WINNER_BONUS: 1000,
  INITIAL_GAME_SPEED: 5,
  INITIAL_SPEED: 5,
  MAX_GAME_SPEED: 15,
  MAX_SPEED: 15,
  SPEED_INCREMENT: 0.5,
  DIFFICULTY_INCREASE_INTERVAL: 10000,
  DIFFICULTY_INTERVAL: 10000,
  DIFFICULTY_MULTIPLIER: 1.3,
  MAX_DIFFICULTY: 5,
  BASE_REWARD: 10,
  SCORE_BONUS_DIVISOR: 100,
  TIME_TO_SCORE_DIVISOR: 100,
  WINNER_MULTIPLIER: 1.5,
  COOLDOWN_PERIOD: 3600,
  MAX_PLAYERS_PER_ROOM: 4,
  ROOM_TIMEOUT: 300000,
  SYNC_INTERVAL: 100,
  ANIMATION_FPS: 60,
  FRAME_TIME: 1000 / 60,
  HUD_PADDING: 20,
  LEADERBOARD_WIDTH: 200,
  FONT_SIZE_LARGE: 32,
  FONT_SIZE_MEDIUM: 24,
  FONT_SIZE_SMALL: 16,
} as const

export const PLAYER_COLORS = {
  BLUE: '#3B82F6',
  RED: '#EF4444',
  GREEN: '#10B981',
  YELLOW: '#F59E0B',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  ORANGE: '#F97316',
  CYAN: '#06B6D4',
} as const

export type PlayerColor = (typeof PLAYER_COLORS)[keyof typeof PLAYER_COLORS]

export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
} as const

export const POWER_UP_TYPES = {
  SHIELD: 'shield',
  SPEED_BOOST: 'speed',
  DOUBLE_JUMP: 'double-jump',
  MAGNET: 'magnet',
} as const

export const ACHIEVEMENT_IDS = {
  FIRST_GAME: 'first-game',
  SCORE_1000: 'score-1000',
  SCORE_5000: 'score-5000',
  SCORE_10000: 'score-10000',
  WIN_10_GAMES: 'win-10-games',
  WIN_50_GAMES: 'win-50-games',
  PLAY_100_GAMES: 'play-100-games',
  PERFECT_RUN: 'perfect-run',
  SPEEDRUNNER: 'speedrunner',
  COLLECTOR: 'collector',
} as const

export const ACHIEVEMENT_NAMES: Record<string, string> = {
  [ACHIEVEMENT_IDS.FIRST_GAME]: 'First Steps',
  [ACHIEVEMENT_IDS.SCORE_1000]: 'Novice',
  [ACHIEVEMENT_IDS.SCORE_5000]: 'Skilled Player',
  [ACHIEVEMENT_IDS.SCORE_10000]: 'Master',
  [ACHIEVEMENT_IDS.WIN_10_GAMES]: 'Champion',
  [ACHIEVEMENT_IDS.WIN_50_GAMES]: 'Legend',
  [ACHIEVEMENT_IDS.PLAY_100_GAMES]: 'Dedicated',
  [ACHIEVEMENT_IDS.PERFECT_RUN]: 'Perfectionist',
  [ACHIEVEMENT_IDS.SPEEDRUNNER]: 'Speed Demon',
  [ACHIEVEMENT_IDS.COLLECTOR]: 'Token Collector',
}

export const KEYBINDINGS = {
  JUMP: [' ', 'w', 'ArrowUp'],
  PAUSE: ['p', 'Escape'],
  RESTART: ['r'],
  MUTE: ['m'],
} as const

export const STORAGE_KEYS = {
  HIGH_SCORES: 'high-scores',
  SETTINGS: 'game-settings',
  ACHIEVEMENTS: 'achievements',
  PLAYER_STATS: 'player-stats',
} as const

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

const defaultConfig: GameConfiguration = {
  canvas: {
    width: GAME_CONSTANTS.CANVAS_WIDTH,
    height: GAME_CONSTANTS.CANVAS_HEIGHT,
  },
  player: {
    width: GAME_CONSTANTS.PLAYER_WIDTH,
    height: GAME_CONSTANTS.PLAYER_HEIGHT,
    startX: GAME_CONSTANTS.PLAYER_START_X,
    color: PLAYER_COLORS.BLUE,
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

export const gameConfig = new GameConfigManager()
export { defaultConfig as defaultGameConfig }

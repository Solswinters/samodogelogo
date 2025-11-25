/**
 * Game Constants
 * Central location for all game configuration and constants
 */

// Game Configuration
/**
 * GAME_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAME_CONFIG.
 */
export const GAME_CONFIG = {
  // Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  TARGET_FPS: 60,
  PIXEL_RATIO: window.devicePixelRatio || 1,

  // Physics
  GRAVITY: 0.8,
  MAX_FALL_SPEED: 20,
  GROUND_FRICTION: 0.85,
  AIR_FRICTION: 0.95,

  // Game States
  STATES: {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    LOADING: 'loading',
    TUTORIAL: 'tutorial',
  } as const,
} as const

// Player Configuration
/**
 * PLAYER_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of PLAYER_CONFIG.
 */
export const PLAYER_CONFIG = {
  // Size
  WIDTH: 50,
  HEIGHT: 50,

  // Movement
  SPEED: 5,
  ACCELERATION: 0.5,
  DECELERATION: 0.3,
  MAX_SPEED: 10,

  // Jumping
  JUMP_FORCE: 15,
  DOUBLE_JUMP_FORCE: 12,
  MAX_JUMPS: 2,
  COYOTE_TIME: 100, // ms after leaving ground where jump is still allowed
  JUMP_BUFFER_TIME: 100, // ms before landing where jump input is buffered

  // Health
  MAX_HEALTH: 100,
  INVINCIBILITY_DURATION: 2000, // ms

  // Animation
  ANIMATION_SPEED: 150, // ms per frame

  // Spawning
  SPAWN_X: 100,
  SPAWN_Y: 450,
} as const

// Obstacle Configuration
/**
 * OBSTACLE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of OBSTACLE_CONFIG.
 */
export const OBSTACLE_CONFIG = {
  // Types
  TYPES: {
    SPIKE: 'spike',
    BLOCK: 'block',
    MOVING_PLATFORM: 'movingPlatform',
    FALLING_ROCK: 'fallingRock',
    SAWBLADE: 'sawblade',
    LASER: 'laser',
    GAP: 'gap',
  } as const,

  // Spawn Settings
  MIN_SPAWN_DISTANCE: 300,
  MAX_SPAWN_DISTANCE: 600,
  INITIAL_SPAWN_RATE: 2000, // ms
  MIN_SPAWN_RATE: 500, // ms

  // Difficulty Scaling
  SPAWN_RATE_DECREASE_FACTOR: 0.95,
  SPEED_INCREASE_FACTOR: 1.05,

  // Damage
  SPIKE_DAMAGE: 25,
  BLOCK_DAMAGE: 30,
  SAWBLADE_DAMAGE: 50,
  LASER_DAMAGE: 40,
  FALL_DAMAGE: 100, // Instant death for falling into gaps
} as const

// Power-Up Configuration
/**
 * POWERUP_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of POWERUP_CONFIG.
 */
export const POWERUP_CONFIG = {
  // Types
  TYPES: {
    SPEED_BOOST: 'speedBoost',
    SHIELD: 'shield',
    JUMP_BOOST: 'jumpBoost',
    INVINCIBILITY: 'invincibility',
    SCORE_MULTIPLIER: 'scoreMultiplier',
    MAGNET: 'magnet',
    SLOW_TIME: 'slowTime',
    EXTRA_LIFE: 'extraLife',
  } as const,

  // Spawn Settings
  SPAWN_CHANCE: 0.15, // 15% chance
  MIN_SPAWN_INTERVAL: 5000, // ms
  MAX_SPAWN_INTERVAL: 15000, // ms

  // Durations (ms)
  SPEED_BOOST_DURATION: 5000,
  SHIELD_DURATION: 8000,
  JUMP_BOOST_DURATION: 6000,
  INVINCIBILITY_DURATION: 10000,
  SCORE_MULTIPLIER_DURATION: 15000,
  MAGNET_DURATION: 7000,
  SLOW_TIME_DURATION: 5000,

  // Effects
  SPEED_BOOST_MULTIPLIER: 1.5,
  JUMP_BOOST_MULTIPLIER: 1.4,
  SCORE_MULTIPLIER_VALUE: 2,
  SLOW_TIME_FACTOR: 0.5, // 50% slower
  MAGNET_RADIUS: 150, // pixels
} as const

// Collectible Configuration
/**
 * COLLECTIBLE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of COLLECTIBLE_CONFIG.
 */
export const COLLECTIBLE_CONFIG = {
  // Types
  TYPES: {
    COIN: 'coin',
    GEM: 'gem',
    STAR: 'star',
    BONUS: 'bonus',
  } as const,

  // Values
  COIN_VALUE: 1,
  GEM_VALUE: 5,
  STAR_VALUE: 10,
  BONUS_VALUE: 25,

  // Spawn Settings
  COIN_SPAWN_CHANCE: 0.6, // 60%
  GEM_SPAWN_CHANCE: 0.25, // 25%
  STAR_SPAWN_CHANCE: 0.1, // 10%
  BONUS_SPAWN_CHANCE: 0.05, // 5%

  // Size
  COIN_SIZE: 20,
  GEM_SIZE: 25,
  STAR_SIZE: 30,
  BONUS_SIZE: 35,

  // Animation
  ROTATION_SPEED: 0.1, // radians per frame
  BOB_SPEED: 0.05, // Vertical bobbing speed
  BOB_AMPLITUDE: 5, // Vertical bobbing amplitude
} as const

// Scoring Configuration
/**
 * SCORE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SCORE_CONFIG.
 */
export const SCORE_CONFIG = {
  // Base Points
  DISTANCE_POINTS_PER_PIXEL: 0.1,
  OBSTACLE_AVOID_POINTS: 10,
  PERFECT_LANDING_POINTS: 25,
  COMBO_MULTIPLIER_INCREASE: 0.1, // 10% increase per combo
  MAX_COMBO_MULTIPLIER: 5,
  COMBO_TIMEOUT: 3000, // ms without collecting to break combo

  // Milestones
  MILESTONES: [1000, 5000, 10000, 25000, 50000, 100000],
  MILESTONE_BONUS: 500,

  // High Score
  LOCAL_STORAGE_KEY: 'samodoge_highscore',
} as const

// Difficulty Configuration
/**
 * DIFFICULTY_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DIFFICULTY_CONFIG.
 */
export const DIFFICULTY_CONFIG = {
  // Levels
  LEVELS: {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
    EXPERT: 'expert',
    INSANE: 'insane',
  } as const,

  // Thresholds (score)
  THRESHOLDS: {
    EASY: 0,
    NORMAL: 1000,
    HARD: 5000,
    EXPERT: 15000,
    INSANE: 30000,
  } as const,

  // Multipliers
  EASY_MULTIPLIER: 0.7,
  NORMAL_MULTIPLIER: 1.0,
  HARD_MULTIPLIER: 1.5,
  EXPERT_MULTIPLIER: 2.0,
  INSANE_MULTIPLIER: 3.0,
} as const

// Achievement Configuration
/**
 * ACHIEVEMENT_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ACHIEVEMENT_CONFIG.
 */
export const ACHIEVEMENT_CONFIG = {
  // Categories
  CATEGORIES: {
    DISTANCE: 'distance',
    SCORE: 'score',
    COINS: 'coins',
    SURVIVAL: 'survival',
    COMBO: 'combo',
    SPECIAL: 'special',
  } as const,

  // Rarity Levels
  RARITY: {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary',
  } as const,

  // NFT Contract (Base Network)
  NFT_CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000000', // Placeholder
  GASLESS_ENABLED: true,
} as const

// Particle Configuration
/**
 * PARTICLE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of PARTICLE_CONFIG.
 */
export const PARTICLE_CONFIG = {
  // Pool Size
  MAX_PARTICLES: 500,

  // Types
  TYPES: {
    EXPLOSION: 'explosion',
    TRAIL: 'trail',
    SPARKLE: 'sparkle',
    SMOKE: 'smoke',
    COIN_COLLECT: 'coinCollect',
    POWERUP_ACTIVATE: 'powerupActivate',
  } as const,

  // Lifetimes (ms)
  EXPLOSION_LIFETIME: 800,
  TRAIL_LIFETIME: 500,
  SPARKLE_LIFETIME: 1000,
  SMOKE_LIFETIME: 1500,
  COIN_COLLECT_LIFETIME: 600,
  POWERUP_ACTIVATE_LIFETIME: 1200,

  // Sizes
  EXPLOSION_SIZE: 30,
  TRAIL_SIZE: 8,
  SPARKLE_SIZE: 12,
  SMOKE_SIZE: 20,
} as const

// Sound Configuration
/**
 * SOUND_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SOUND_CONFIG.
 */
export const SOUND_CONFIG = {
  // Master Volume
  MASTER_VOLUME: 0.7,

  // Volume Levels
  MUSIC_VOLUME: 0.5,
  SFX_VOLUME: 0.7,

  // Sound Effects
  SFX: {
    JUMP: 'jump',
    LAND: 'land',
    COIN: 'coin',
    POWERUP: 'powerup',
    HIT: 'hit',
    GAME_OVER: 'gameOver',
    ACHIEVEMENT: 'achievement',
    BUTTON_CLICK: 'buttonClick',
    COMBO: 'combo',
    MILESTONE: 'milestone',
  } as const,

  // Music Tracks
  MUSIC: {
    MENU: 'menu',
    GAMEPLAY: 'gameplay',
    BOSS: 'boss',
  } as const,

  // Pool Size
  MAX_SIMULTANEOUS_SOUNDS: 32,
} as const

// Visual Configuration
/**
 * VISUAL_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of VISUAL_CONFIG.
 */
export const VISUAL_CONFIG = {
  // Colors
  COLORS: {
    PRIMARY: '#00D4FF',
    SECONDARY: '#FF00D4',
    ACCENT: '#FFD700',
    DANGER: '#FF0000',
    SUCCESS: '#00FF00',
    WARNING: '#FFA500',
    BACKGROUND: '#1a1a2e',
    TEXT: '#FFFFFF',
  } as const,

  // Layers (z-index)
  LAYERS: {
    BACKGROUND: 0,
    ENVIRONMENT: 1,
    OBSTACLES: 2,
    COLLECTIBLES: 3,
    PLAYER: 4,
    PARTICLES: 5,
    UI: 6,
    MENU: 7,
  } as const,

  // Effects
  SCREEN_SHAKE_DURATION: 300, // ms
  SCREEN_SHAKE_INTENSITY: 10, // pixels
  FLASH_DURATION: 200, // ms

  // Camera
  CAMERA_FOLLOW_SPEED: 0.1,
  CAMERA_LOOK_AHEAD: 100, // pixels in front of player
  CAMERA_DEADZONE_WIDTH: 150,
  CAMERA_DEADZONE_HEIGHT: 100,
} as const

// Network Configuration
/**
 * NETWORK_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of NETWORK_CONFIG.
 */
export const NETWORK_CONFIG = {
  // Blockchain
  CHAIN_ID: 8453, // Base mainnet
  CHAIN_NAME: 'Base',
  RPC_URL: 'https://mainnet.base.org',
  EXPLORER_URL: 'https://basescan.org',

  // Contracts
  GAME_TOKEN_ADDRESS: '0x0000000000000000000000000000000000000000', // Placeholder
  GAME_REWARDS_ADDRESS: '0x0000000000000000000000000000000000000000', // Placeholder
  ACHIEVEMENT_NFT_ADDRESS: '0x0000000000000000000000000000000000000000', // Placeholder

  // Leaderboard
  LEADERBOARD_SIZE: 100,
  LEADERBOARD_UPDATE_INTERVAL: 60000, // ms (1 minute)

  // Multiplayer
  WEBSOCKET_URL: 'wss://api.samodoge.game/ws',
  MAX_PLAYERS_PER_ROOM: 10,
  TICK_RATE: 30, // updates per second
} as const

// Storage Keys
/**
 * STORAGE_KEYS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of STORAGE_KEYS.
 */
export const STORAGE_KEYS = {
  HIGH_SCORE: 'samodoge_highscore',
  SETTINGS: 'samodoge_settings',
  ACHIEVEMENTS: 'samodoge_achievements',
  STATS: 'samodoge_stats',
  WALLET_ADDRESS: 'samodoge_wallet',
  LAST_REWARD_CLAIM: 'samodoge_last_reward_claim',
  TUTORIAL_COMPLETED: 'samodoge_tutorial_completed',
} as const

// Tutorial Configuration
/**
 * TUTORIAL_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TUTORIAL_CONFIG.
 */
export const TUTORIAL_CONFIG = {
  // Steps
  STEPS: [
    { id: 'welcome', title: 'Welcome to Samodoge!', duration: 3000 },
    { id: 'move', title: 'Use arrow keys or WASD to move', duration: 5000 },
    { id: 'jump', title: 'Press Space or Up Arrow to jump', duration: 5000 },
    { id: 'obstacles', title: 'Avoid obstacles', duration: 5000 },
    { id: 'coins', title: 'Collect coins for points', duration: 5000 },
    { id: 'powerups', title: 'Grab power-ups for special abilities', duration: 5000 },
    { id: 'complete', title: 'Good luck!', duration: 3000 },
  ],

  // Display
  SKIP_BUTTON_DELAY: 2000, // ms before showing skip button
  AUTO_ADVANCE: true,
} as const

// Performance Configuration
/**
 * PERFORMANCE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of PERFORMANCE_CONFIG.
 */
export const PERFORMANCE_CONFIG = {
  // Optimization
  ENABLE_OBJECT_POOLING: true,
  MAX_VISIBLE_OBSTACLES: 10,
  MAX_VISIBLE_COLLECTIBLES: 20,
  CULL_DISTANCE: 100, // pixels off-screen before culling

  // Quality Settings
  QUALITY_PRESETS: {
    LOW: {
      particles: false,
      shadows: false,
      antialiasing: false,
      particleCount: 0,
    },
    MEDIUM: {
      particles: true,
      shadows: false,
      antialiasing: true,
      particleCount: 100,
    },
    HIGH: {
      particles: true,
      shadows: true,
      antialiasing: true,
      particleCount: 500,
    },
  } as const,

  // Monitoring
  SHOW_FPS: false,
  SHOW_DEBUG_INFO: false,
  LOG_PERFORMANCE_WARNINGS: true,
} as const

// Input Configuration
/**
 * INPUT_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of INPUT_CONFIG.
 */
export const INPUT_CONFIG = {
  // Keyboard
  KEYS: {
    MOVE_LEFT: ['ArrowLeft', 'KeyA'],
    MOVE_RIGHT: ['ArrowRight', 'KeyD'],
    JUMP: ['Space', 'ArrowUp', 'KeyW'],
    PAUSE: ['Escape', 'KeyP'],
    INTERACT: ['KeyE'],
  } as const,

  // Touch/Mobile
  TOUCH_ZONES: {
    LEFT_THRESHOLD: 0.33,
    RIGHT_THRESHOLD: 0.67,
    JUMP_THRESHOLD: 0.5,
  } as const,

  // Sensitivity
  DEADZONE: 0.1,
} as const

// Debug Configuration
/**
 * DEBUG_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DEBUG_CONFIG.
 */
export const DEBUG_CONFIG = {
  ENABLED: process.env.NODE_ENV === 'development',
  SHOW_HITBOXES: false,
  SHOW_FPS: false,
  SHOW_GRID: false,
  INVINCIBLE_MODE: false,
  UNLIMITED_JUMPS: false,
  GOD_MODE: false,
  LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
} as const

// Type Exports
export type GameState = (typeof GAME_CONFIG.STATES)[keyof typeof GAME_CONFIG.STATES]
export type ObstacleType = (typeof OBSTACLE_CONFIG.TYPES)[keyof typeof OBSTACLE_CONFIG.TYPES]
export type PowerUpType = (typeof POWERUP_CONFIG.TYPES)[keyof typeof POWERUP_CONFIG.TYPES]
export type CollectibleType =
  (typeof COLLECTIBLE_CONFIG.TYPES)[keyof typeof COLLECTIBLE_CONFIG.TYPES]
export type DifficultyLevel =
  (typeof DIFFICULTY_CONFIG.LEVELS)[keyof typeof DIFFICULTY_CONFIG.LEVELS]
export type AchievementCategory =
  (typeof ACHIEVEMENT_CONFIG.CATEGORIES)[keyof typeof ACHIEVEMENT_CONFIG.CATEGORIES]
export type AchievementRarity =
  (typeof ACHIEVEMENT_CONFIG.RARITY)[keyof typeof ACHIEVEMENT_CONFIG.RARITY]
export type ParticleType = (typeof PARTICLE_CONFIG.TYPES)[keyof typeof PARTICLE_CONFIG.TYPES]
export type SoundEffect = (typeof SOUND_CONFIG.SFX)[keyof typeof SOUND_CONFIG.SFX]
export type MusicTrack = (typeof SOUND_CONFIG.MUSIC)[keyof typeof SOUND_CONFIG.MUSIC]

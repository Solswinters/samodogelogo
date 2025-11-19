/**
 * Shared application constants
 */

export const APP_NAME = 'Jump Game'
export const APP_VERSION = '1.0.0'

export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

export const STORAGE_KEYS = {
  THEME: 'theme',
  SOUND_ENABLED: 'sound_enabled',
  MUSIC_ENABLED: 'music_enabled',
  HIGH_SCORE: 'high_score',
  SETTINGS: 'game_settings',
} as const

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  STATS: '/api/stats',
  LEADERBOARD: '/api/leaderboard',
  CLAIM: '/api/claim',
} as const

export const GAME_CONSTANTS = {
  MIN_JUMP_HEIGHT: 50,
  MAX_JUMP_HEIGHT: 150,
  GRAVITY: 0.6,
  JUMP_POWER: 12,
  PLAYER_SIZE: 40,
  OBSTACLE_WIDTH: 30,
  OBSTACLE_MIN_HEIGHT: 40,
  OBSTACLE_MAX_HEIGHT: 80,
  OBSTACLE_SPEED: 5,
  SPAWN_INTERVAL: 1500,
  MAX_COMBO_MULTIPLIER: 5,
} as const

export const DURATIONS = {
  TOAST: 5000,
  ANIMATION: 300,
  DEBOUNCE: 300,
  THROTTLE: 100,
  RETRY_DELAY: 1000,
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

export const Z_INDEX = {
  MODAL: 50,
  TOAST: 60,
  TOOLTIP: 70,
  DROPDOWN: 40,
} as const

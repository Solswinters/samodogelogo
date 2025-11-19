/**
 * Store constants and configuration
 */

// Game constants
export const GAME_MODES = ['menu', 'single', 'multi', 'time-trial', 'endless', 'story'] as const
export const GAME_STATES = ['idle', 'playing', 'paused', 'ended'] as const
export const DIFFICULTY_LEVELS = ['easy', 'normal', 'hard', 'extreme'] as const

// Default settings
export const DEFAULT_SFX_VOLUME = 0.7
export const DEFAULT_MUSIC_VOLUME = 0.5
export const MAX_COMBO_MULTIPLIER = 5
export const MIN_COMBO_MULTIPLIER = 1
export const COMBO_INCREMENT = 0.1

// Wallet constants
export const CONNECTION_STATUSES = ['disconnected', 'connecting', 'connected', 'error'] as const
export const TRANSACTION_TYPES = ['claim', 'stake', 'unstake', 'approve'] as const
export const TRANSACTION_STATUSES = ['pending', 'success', 'failed'] as const
export const MAX_TRANSACTION_HISTORY = 50

// Multiplayer constants
export const CONNECTION_QUALITIES = ['excellent', 'good', 'fair', 'poor'] as const
export const ROOM_STATUSES = ['idle', 'searching', 'in-room', 'in-game', 'ended'] as const
export const MATCHMAKING_MODES = ['casual', 'ranked', 'tournament', 'private'] as const
export const MAX_CHAT_MESSAGES = 100
export const MAX_PLAYERS_PER_ROOM = 4
export const GAME_SYNC_INTERVAL = 50

// Ping thresholds for connection quality
export const PING_EXCELLENT = 50
export const PING_GOOD = 100
export const PING_FAIR = 200

// UI constants
export const THEMES = ['light', 'dark', 'auto'] as const
export const TOAST_TYPES = ['success', 'error', 'warning', 'info'] as const
export const MODAL_TYPES = ['game-over', 'settings', 'leaderboard', 'wallet', 'tutorial'] as const
export const DEFAULT_TOAST_DURATION = 5000
export const MAX_NOTIFICATIONS = 50

// Store persistence keys
export const STORE_KEYS = {
  GAME: 'game-store',
  UI: 'ui-store',
} as const

// Reconnection settings
export const MAX_RECONNECT_ATTEMPTS = 5
export const RECONNECT_DELAY = 1000
export const RECONNECT_BACKOFF = 2

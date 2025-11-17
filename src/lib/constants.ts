/**
 * Application-wide constants
 */

export const APP_NAME = 'Jump Game'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Onchain Rewards on Base'

export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  LEADERBOARD: '/leaderboard',
  STATS: '/stats',
} as const

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

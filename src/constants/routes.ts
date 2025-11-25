/**
 * Application routes constants
 */

/**
 * ROUTES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ROUTES.
 */
export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  LEADERBOARD: '/leaderboard',
  PROFILE: '/profile',
  REWARDS: '/rewards',
  MULTIPLAYER: '/multiplayer',
  SETTINGS: '/settings',
  ABOUT: '/about',
} as const

/**
 * API_ROUTES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_ROUTES.
 */
export const API_ROUTES = {
  HEALTH: '/api/health',
  STATS: '/api/stats',
  LEADERBOARD: '/api/leaderboard',
  PLAYER: '/api/player',
  CLAIM: '/api/claim',
  SIGNATURE: '/api/signature',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
export type ApiRoute = (typeof API_ROUTES)[keyof typeof API_ROUTES]

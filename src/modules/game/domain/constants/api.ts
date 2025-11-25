/**
 * API endpoints for game module
 */

/**
 * GAME_API_ENDPOINTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAME_API_ENDPOINTS.
 */
export const GAME_API_ENDPOINTS = {
  // Game endpoints
  CLAIM: '/api/game/claim',
  VERIFY: '/api/game/verify',
  ESTIMATE: '/api/game/estimate',
  STATS: '/api/game/stats',
  LEADERBOARD: '/api/game/leaderboard',

  // Health
  HEALTH: '/api/health',

  // Documentation
  DOCS: '/api/docs',
} as const

/**
 * API_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_CONFIG.
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

/**
 * API endpoints for game module
 */

export const GAME_API_ENDPOINTS = {
  // Game endpoints
  CLAIM: "/api/game/claim",
  VERIFY: "/api/game/verify",
  ESTIMATE: "/api/game/estimate",
  STATS: "/api/game/stats",
  LEADERBOARD: "/api/game/leaderboard",

  // Health
  HEALTH: "/api/health",

  // Documentation
  DOCS: "/api/docs",
} as const;

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;


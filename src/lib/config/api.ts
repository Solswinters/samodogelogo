/**
 * API configuration and constants
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  DOCS: '/api/docs',
  STATS: '/api/stats',
  GAME: {
    CLAIM: '/api/game/claim',
    ESTIMATE: '/api/game/estimate',
    LEADERBOARD: '/api/game/leaderboard',
    STATS: '/api/game/stats',
    VERIFY: '/api/game/verify',
  },
} as const

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`
}

export const API_CONFIG = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const

export const WS_CONFIG = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const

export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  X_FORWARDED_FOR: 'X-Forwarded-For',
  X_REAL_IP: 'X-Real-IP',
  X_API_KEY: 'X-API-Key',
  X_WALLET_ADDRESS: 'X-Wallet-Address',
  X_WALLET_SIGNATURE: 'X-Wallet-Signature',
  X_WALLET_MESSAGE: 'X-Wallet-Message',
  X_RATE_LIMIT_LIMIT: 'X-RateLimit-Limit',
  X_RATE_LIMIT_REMAINING: 'X-RateLimit-Remaining',
  X_RATE_LIMIT_RESET: 'X-RateLimit-Reset',
  CACHE_CONTROL: 'Cache-Control',
  X_CACHE: 'X-Cache',
} as const

export const CACHE_DURATIONS = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
  DAY: 86400,
  WEEK: 604800,
} as const

export const RATE_LIMITS = {
  STRICT: {
    requests: 10,
    window: 60 * 1000,
  },
  DEFAULT: {
    requests: 100,
    window: 15 * 60 * 1000,
  },
  GENEROUS: {
    requests: 1000,
    window: 60 * 60 * 1000,
  },
} as const

export const TIMEOUTS = {
  DEFAULT: 30000,
  LONG: 60000,
  SHORT: 10000,
} as const

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  BASE_DELAY: 1000,
  MAX_DELAY: 10000,
} as const

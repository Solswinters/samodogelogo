// API-related constants

// HTTP status codes
export const HTTP_STATUS = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirection messages
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

// API endpoint paths
export const API_ENDPOINTS = {
  GAME: {
    CLAIM: '/api/game/claim',
    LEADERBOARD: '/api/game/leaderboard',
    STATS: '/api/game/stats',
    VERIFY: '/api/game/verify',
  },
  HEALTH: '/api/health',
  DOCS: '/api/docs',
} as const

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const

// Content types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
} as const

// Common headers
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

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const

// Rate limit configurations
export const RATE_LIMITS = {
  STRICT: {
    requests: 10,
    window: 60 * 1000, // 1 minute
  },
  DEFAULT: {
    requests: 100,
    window: 15 * 60 * 1000, // 15 minutes
  },
  GENEROUS: {
    requests: 1000,
    window: 60 * 60 * 1000, // 1 hour
  },
} as const

// Request timeouts (in milliseconds)
export const TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  LONG: 60000, // 1 minute
  SHORT: 10000, // 10 seconds
} as const

// Retry configurations
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  BASE_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
} as const

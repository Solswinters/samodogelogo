/**
 * Rate limiting utilities for API protection
 */

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

/**
 * Token bucket rate limiter
 */
export class TokenBucketRateLimiter {
  private tokens: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(private config: RateLimitConfig) {}

  /**
   * Check if request is allowed
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const entry = this.tokens.get(identifier)

    // No entry or expired window
    if (!entry || now >= entry.resetTime) {
      const resetTime = now + this.config.windowMs
      this.tokens.set(identifier, {
        count: this.config.maxRequests - 1,
        resetTime,
      })

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime,
      }
    }

    // Has tokens available
    if (entry.count > 0) {
      entry.count--
      this.tokens.set(identifier, entry)

      return {
        allowed: true,
        remaining: entry.count,
        resetTime: entry.resetTime,
      }
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  /**
   * Reset tokens for identifier
   */
  reset(identifier: string): void {
    this.tokens.delete(identifier)
  }

  /**
   * Clear all tokens
   */
  clear(): void {
    this.tokens.clear()
  }
}

/**
 * Sliding window rate limiter
 */
export class SlidingWindowRateLimiter {
  private requests: Map<string, number[]> = new Map()

  constructor(private config: RateLimitConfig) {}

  /**
   * Check if request is allowed
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Get request timestamps within window
    const timestamps = this.requests.get(identifier) || []
    const validTimestamps = timestamps.filter(ts => ts > windowStart)

    // Check if limit exceeded
    if (validTimestamps.length >= this.config.maxRequests) {
      const oldestTimestamp = Math.min(...validTimestamps)
      const resetTime = oldestTimestamp + this.config.windowMs

      return {
        allowed: false,
        remaining: 0,
        resetTime,
      }
    }

    // Add current request
    validTimestamps.push(now)
    this.requests.set(identifier, validTimestamps)

    return {
      allowed: true,
      remaining: this.config.maxRequests - validTimestamps.length,
      resetTime: now + this.config.windowMs,
    }
  }

  /**
   * Reset requests for identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Clear all requests
   */
  clear(): void {
    this.requests.clear()
  }
}

/**
 * Create a rate limiter
 */
export function createRateLimiter(
  config: RateLimitConfig,
  type: 'token-bucket' | 'sliding-window' = 'token-bucket'
): TokenBucketRateLimiter | SlidingWindowRateLimiter {
  return type === 'token-bucket'
    ? new TokenBucketRateLimiter(config)
    : new SlidingWindowRateLimiter(config)
}

/**
 * Client-side rate limiting
 */

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export class RateLimiter {
  private requests = new Map<string, number[]>()

  constructor(private config: RateLimitConfig) {}

  check(key: string): boolean {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Get existing requests for this key
    const keyRequests = this.requests.get(key) || []

    // Filter out old requests
    const recentRequests = keyRequests.filter(time => time > windowStart)

    // Check if limit exceeded
    if (recentRequests.length >= this.config.maxRequests) {
      return false
    }

    // Add new request
    recentRequests.push(now)
    this.requests.set(key, recentRequests)

    return true
  }

  reset(key: string) {
    this.requests.delete(key)
  }

  getRemainingRequests(key: string): number {
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    const keyRequests = this.requests.get(key) || []
    const recentRequests = keyRequests.filter(time => time > windowStart)

    return Math.max(0, this.config.maxRequests - recentRequests.length)
  }
}

// Global rate limiters
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000, // 1 minute
})

export const gameActionRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 1000, // 1 second
})

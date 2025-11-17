import type { NextRequest } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (request: NextRequest) => string
}

export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000,
}

export const STRICT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000,
}

export const GENEROUS_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 1000,
  windowMs: 60 * 60 * 1000,
}

function getClientId(
  request: NextRequest,
  keyGenerator?: (request: NextRequest) => string
): string {
  if (keyGenerator) {
    return keyGenerator(request)
  }

  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnecting = request.headers.get('cf-connecting-ip')

  const ip = forwarded?.split(',')[0] ?? realIp ?? cfConnecting ?? 'unknown'

  return `ip:${ip}`
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  let entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(identifier, entry)
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  entry.count++
  rateLimitStore.set(identifier, entry)

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

export function rateLimit(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
  return async (request: NextRequest, handler: () => Promise<Response>): Promise<Response> => {
    const clientId = getClientId(request, config.keyGenerator)
    const result = checkRateLimit(clientId, config)

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000)
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
          },
        }
      )
    }

    const response = await handler()

    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString())

    return response
  }
}

export function rateLimitByAddress(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
  return rateLimit({
    ...config,
    keyGenerator: (request: NextRequest) => {
      const url = new URL(request.url)
      const address = url.searchParams.get('address')
      return address ? `address:${address.toLowerCase()}` : getClientId(request)
    },
  })
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

export function cleanupExpiredEntries(): number {
  const now = Date.now()
  let cleaned = 0

  const entries = Array.from(rateLimitStore.entries())
  for (const [key, entry] of entries) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
      cleaned++
    }
  }

  return cleaned
}

// Cleanup expired entries periodically
setInterval(
  () => {
    cleanupExpiredEntries()
  },
  5 * 60 * 1000
)

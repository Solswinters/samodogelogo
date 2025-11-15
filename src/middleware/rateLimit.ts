/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { NextRequest } from 'next/server'
import { tooManyRequestsResponse } from './response'

// Simple in-memory rate limiter
// TODO: Replace with Redis in production for distributed systems

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (request: NextRequest) => string
}

// Default rate limit: 100 requests per 15 minutes
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
}

// Strict rate limit: 10 requests per minute
export const STRICT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
}

// Generous rate limit: 1000 requests per hour
export const GENEROUS_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
}

// Get client identifier
function getClientId(
  request: NextRequest,
  keyGenerator?: (request: NextRequest) => string
): string {
  if (keyGenerator) {
    return keyGenerator(request)
  }

  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnecting = request.headers.get('cf-connecting-ip')

  const ip = forwarded?.split(',')[0] ?? realIp ?? cfConnecting ?? 'unknown'

  return `ip:${ip}`
}

// Rate limit middleware
export function rateLimit(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
  return async (request: NextRequest, handler: () => Promise<Response>): Promise<Response> => {
    const clientId = getClientId(request, config.keyGenerator)
    const now = Date.now()

    let entry = rateLimitStore.get(clientId)

    // Initialize or reset if window expired
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      }
      rateLimitStore.set(clientId, entry)
    }

    // Increment counter
    entry.count++

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)

      return tooManyRequestsResponse(`Rate limit exceeded. Try again in ${retryAfter} seconds.`, {
        retryAfter,
        limit: config.maxRequests,
        windowMs: config.windowMs,
      })
    }

    // Add rate limit headers
    const response = await handler()

    const remaining = Math.max(0, config.maxRequests - entry.count)
    const reset = Math.ceil(entry.resetTime / 1000)

    // Add standard rate limit headers
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', reset.toString())

    return response
  }
}

// Rate limit by wallet address
export function rateLimitByAddress(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
  return rateLimit({
    ...config,
    keyGenerator: (request: NextRequest) => {
      // Try to get address from query params or body
      const url = new URL(request.url)
      const address = url.searchParams.get('address')
      return address ? `address:${address.toLowerCase()}` : getClientId(request)
    },
  })
}

// Rate limit by user agent
export function rateLimitByUserAgent(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
  return rateLimit({
    ...config,
    keyGenerator: (request: NextRequest) => {
      const userAgent = request.headers.get('user-agent') ?? 'unknown'
      return `ua:${userAgent}`
    },
  })
}

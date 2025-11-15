/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

// Cache entry interface
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

// In-memory cache store
// TODO: Replace with Redis in production
const cacheStore = new Map<string, CacheEntry<unknown>>()

// Cache configuration
export interface CacheConfig {
  ttl: number // Time to live in milliseconds
  keyGenerator?: (request: NextRequest) => string
}

// Default cache configuration (5 minutes)
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000,
}

// Clean expired cache entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cacheStore.entries()) {
    if (now > entry.expiresAt) {
      cacheStore.delete(key)
    }
  }
}, 60000) // Clean every minute

// Generate cache key from request
function generateCacheKey(
  request: NextRequest,
  keyGenerator?: (request: NextRequest) => string
): string {
  if (keyGenerator) {
    return keyGenerator(request)
  }

  const { pathname, searchParams } = new URL(request.url)
  const sortedParams = Array.from(searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${request.method}:${pathname}${sortedParams ? `?${sortedParams}` : ''}`
}

// Cache middleware
export function cache<T>(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
  return async (
    request: NextRequest,
    handler: () => Promise<NextResponse<T>>
  ): Promise<NextResponse<T>> => {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return await handler()
    }

    const cacheKey = generateCacheKey(request, config.keyGenerator)
    const now = Date.now()

    // Check if cached response exists and is not expired
    const cachedEntry = cacheStore.get(cacheKey) as CacheEntry<T> | undefined

    if (cachedEntry && now < cachedEntry.expiresAt) {
      // Return cached response with cache headers
      const response = NextResponse.json(cachedEntry.data)
      response.headers.set('X-Cache', 'HIT')
      response.headers.set(
        'X-Cache-Age',
        Math.floor((now - cachedEntry.timestamp) / 1000).toString()
      )

      return response
    }

    // No cache or expired - fetch fresh data
    const response = await handler()

    // Cache successful responses
    if (response.status === 200) {
      try {
        const data = await response.json()

        cacheStore.set(cacheKey, {
          data,
          timestamp: now,
          expiresAt: now + config.ttl,
        })

        // Create new response with cache headers
        const cachedResponse = NextResponse.json(data, { status: response.status })
        cachedResponse.headers.set('X-Cache', 'MISS')
        cachedResponse.headers.set(
          'Cache-Control',
          `public, max-age=${Math.floor(config.ttl / 1000)}`
        )

        return cachedResponse
      } catch {
        // If response is not JSON, return as is
        return response
      }
    }

    return response
  }
}

// Cache presets
export const SHORT_CACHE: CacheConfig = {
  ttl: 1 * 60 * 1000, // 1 minute
}

export const MEDIUM_CACHE: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
}

export const LONG_CACHE: CacheConfig = {
  ttl: 60 * 60 * 1000, // 1 hour
}

// Clear cache by key pattern
export function clearCache(pattern?: string): number {
  if (!pattern) {
    const size = cacheStore.size
    cacheStore.clear()
    return size
  }

  let cleared = 0
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key)
      cleared++
    }
  }

  return cleared
}

// Get cache stats
export function getCacheStats(): {
  size: number
  entries: Array<{ key: string; age: number; ttl: number }>
} {
  const now = Date.now()
  const entries: Array<{ key: string; age: number; ttl: number }> = []

  for (const [key, entry] of cacheStore.entries()) {
    entries.push({
      key,
      age: Math.floor((now - entry.timestamp) / 1000),
      ttl: Math.floor((entry.expiresAt - now) / 1000),
    })
  }

  return {
    size: cacheStore.size,
    entries,
  }
}

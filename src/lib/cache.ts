import type { NextRequest, NextResponse } from 'next/server'

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class CacheManager {
  private cache: Map<string, CacheEntry<unknown>> = new Map()
  private defaultTTL = 300000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (ttl ?? this.defaultTTL),
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (!entry) {
      return null
    }

    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(pattern?: string): number {
    if (!pattern) {
      const size = this.cache.size
      this.cache.clear()
      return size
    }

    let cleared = 0
    for (const key of this.cache.keys()) {
      if (typeof key === 'string' && key.includes(pattern)) {
        this.cache.delete(key)
        cleared++
      }
    }

    return cleared
  }

  cleanup(): void {
    const now = Date.now()
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    })
  }

  getStats(): {
    size: number
    entries: Array<{ key: string; age: number; ttl: number }>
  } {
    const now = Date.now()
    const entries: Array<{ key: string; age: number; ttl: number }> = []

    this.cache.forEach((entry, key) => {
      const cacheEntry = entry
      entries.push({
        key: String(key),
        age: Math.floor((now - cacheEntry.timestamp) / 1000),
        ttl: Math.floor((cacheEntry.expiresAt - now) / 1000),
      })
    })

    return {
      size: this.cache.size,
      entries,
    }
  }
}

/**
 * cache utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of cache.
 */
export const cache = new CacheManager()

// Clean expired cache entries periodically
setInterval(() => {
  cache.cleanup()
}, 60000)

export interface CacheConfig {
  ttl: number
  keyGenerator?: (request: NextRequest) => string
}

/**
 * DEFAULT_CACHE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DEFAULT_CACHE_CONFIG.
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000,
}

/**
 * SHORT_CACHE utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SHORT_CACHE.
 */
export const SHORT_CACHE: CacheConfig = {
  ttl: 1 * 60 * 1000,
}

/**
 * MEDIUM_CACHE utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of MEDIUM_CACHE.
 */
export const MEDIUM_CACHE: CacheConfig = {
  ttl: 5 * 60 * 1000,
}

/**
 * LONG_CACHE utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LONG_CACHE.
 */
export const LONG_CACHE: CacheConfig = {
  ttl: 60 * 60 * 1000,
}

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

/**
 * cacheMiddleware utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of cacheMiddleware.
 */
export function cacheMiddleware<T>(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
  return async (
    request: NextRequest,
    handler: () => Promise<NextResponse<T>>
  ): Promise<NextResponse<T>> => {
    if (request.method !== 'GET') {
      return await handler()
    }

    const cacheKey = generateCacheKey(request, config.keyGenerator)

    const cachedData = cache.get<T>(cacheKey)

    if (cachedData) {
      const response = NextResponse.json(cachedData)
      response.headers.set('X-Cache', 'HIT')
      return response as NextResponse<T>
    }

    const response = await handler()

    if (response.status === 200) {
      try {
        const data = (await response.json()) as T
        cache.set(cacheKey, data, config.ttl)

        const cachedResponse = NextResponse.json(data, { status: response.status })
        cachedResponse.headers.set('X-Cache', 'MISS')
        cachedResponse.headers.set(
          'Cache-Control',
          `public, max-age=${Math.floor(config.ttl / 1000)}`
        )

        return cachedResponse
      } catch {
        return response
      }
    }

    return response
  }
}

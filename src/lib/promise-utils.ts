/**
 * Promise utilities
 */

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Promise timed out after ${ms}ms`)), ms)
  })

  return Promise.race([promise, timeoutPromise])
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxAttempts) {
        await sleep(delay * attempt)
      }
    }
  }

  throw lastError
}

export async function allSettled<T>(
  promises: Promise<T>[]
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: Error }>> {
  return Promise.allSettled(promises).then((results) =>
    results.map((result) =>
      result.status === 'fulfilled'
        ? { status: 'fulfilled' as const, value: result.value }
        : { status: 'rejected' as const, reason: result.reason as Error }
    )
  )
}

export function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise || (typeof value === 'object' && value !== null && 'then' in value)
  )
}

export async function parallel<T>(promises: Promise<T>[], limit: number): Promise<T[]> {
  const results: T[] = []
  const executing: Promise<void>[] = []

  for (let i = 0; i < promises.length; i++) {
    const promise = promises[i].then((result) => {
      results[i] = result
    })

    executing.push(promise)

    if (executing.length >= limit) {
      await Promise.race(executing)
      const index = executing.findIndex((p) => p !== promise)
      if (index !== -1) {
        executing.splice(index, 1)
      }
    }
  }

  await Promise.all(executing)
  return results
}

export function debouncePromise<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null
  type Resolver = {
    resolve: (value: Awaited<ReturnType<T>>) => void
    reject: (reason?: unknown) => void
  }
  let resolvers: Resolver[] = []

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      resolvers.push({ resolve, reject })

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(async () => {
        const currentResolvers = [...resolvers]
        resolvers = []

        try {
          const result = await fn(...args)
          currentResolvers.forEach((r) => r.resolve(result as Awaited<ReturnType<T>>))
        } catch (error) {
          currentResolvers.forEach((r) => r.reject(error))
        }
      }, delay)
    })
  }
}

export async function sequential<T>(fns: Array<() => Promise<T>>): Promise<T[]> {
  const results: T[] = []

  for (const fn of fns) {
    results.push(await fn())
  }

  return results
}

export async function waterfall<T>(
  initialValue: T,
  fns: Array<(value: T) => Promise<T>>
): Promise<T> {
  let value = initialValue

  for (const fn of fns) {
    value = await fn(value)
  }

  return value
}

export function defer<T>(): {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
} {
  let resolve: (value: T) => void = () => {}
  let reject: (reason?: unknown) => void = () => {}

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

export async function raceSuccess<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let rejections = 0
    const errors: Error[] = []

    promises.forEach((promise) => {
      promise.then(resolve).catch((error) => {
        rejections++
        errors.push(error)
        if (rejections === promises.length) {
          reject(new Error(`All promises rejected: ${errors.map((e) => e.message).join(', ')}`))
        }
      })
    })
  })
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutError?: Error
): Promise<T> {
  return timeout(promise, ms).catch((error) => {
    throw timeoutError || error
  })
}

export function memoizePromise<T extends (...args: unknown[]) => Promise<unknown>>(fn: T): T {
  const cache = new Map<string, Promise<ReturnType<T>>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const promise = fn(...args)
    cache.set(key, promise)

    promise.catch(() => {
      cache.delete(key)
    })

    return promise
  }) as T
}

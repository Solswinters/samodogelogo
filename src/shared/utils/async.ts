/**
 * Shared async utilities
 */

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delay?: number
    backoff?: number
    onRetry?: (error: Error, attempt: number) => void
  } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = 2, onRetry } = options

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < maxAttempts) {
        onRetry?.(lastError, attempt)
        await sleep(delay * Math.pow(backoff, attempt - 1))
      }
    }
  }

  throw lastError ?? new Error('Unknown error occurred')
}

export async function timeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutError?: Error
): Promise<T> {
  let timeoutId: NodeJS.Timeout

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(timeoutError ?? new Error(`Operation timed out after ${ms}ms`))
    }, ms)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

export function debounceAsync<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  delay: number
): (...args: T) => Promise<R> {
  let timeoutId: NodeJS.Timeout | null = null
  let pendingPromise: Promise<R> | null = null

  return (...args: T): Promise<R> => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (pendingPromise) {
      return pendingPromise
    }

    pendingPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        void fn(...args)
          .then(result => {
            resolve(result)
          })
          .catch((error: unknown) => {
            reject(error instanceof Error ? error : new Error(String(error)))
          })
          .finally(() => {
            pendingPromise = null
            timeoutId = null
          })
      }, delay)
    })

    return pendingPromise
  }
}

export async function parallel<T>(
  tasks: Array<() => Promise<T>>,
  concurrency = Infinity
): Promise<T[]> {
  const results: T[] = []
  const executing: Set<Promise<void>> = new Set()

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]
    if (!task) {continue}

    const promise = task()
      .then(result => {
        results[i] = result
      })
      .finally(() => {
        executing.delete(promise)
      })

    executing.add(promise)

    if (executing.size >= concurrency) {
      await Promise.race(executing)
    }
  }

  await Promise.all(Array.from(executing))
  return results
}

export async function allSettled<T>(
  promises: Promise<T>[]
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: Error }>> {
  return Promise.all(
    promises.map(promise =>
      promise
        .then(value => ({ status: 'fulfilled' as const, value }))
        .catch((reason: unknown) => ({
          status: 'rejected' as const,
          reason: reason instanceof Error ? reason : new Error(String(reason)),
        }))
    )
  )
}

export function createAbortable<T>(fn: (signal: AbortSignal) => Promise<T>): {
  promise: Promise<T>
  abort: () => void
} {
  const controller = new AbortController()

  return {
    promise: fn(controller.signal),
    abort: () => controller.abort(),
  }
}

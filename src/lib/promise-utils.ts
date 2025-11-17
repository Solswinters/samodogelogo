/**
 * Promise utilities
 */

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
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
  return Promise.allSettled(promises).then(results =>
    results.map(result =>
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

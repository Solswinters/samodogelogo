/**
 * Retry logic with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  maxDelayMs?: number
  backoffFactor?: number
  shouldRetry?: (error: Error, attempt: number) => boolean
  onRetry?: (error: Error, attempt: number) => void
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  maxDelayMs: 30000,
  backoffFactor: 2,
  shouldRetry: () => true,
  onRetry: () => {},
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const opts = { ...defaultOptions, ...options }
  let lastError: Error

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === opts.maxAttempts) {
        throw lastError
      }

      if (!opts.shouldRetry(lastError, attempt)) {
        throw lastError
      }

      opts.onRetry(lastError, attempt)

      const delay = Math.min(
        opts.delayMs * Math.pow(opts.backoffFactor, attempt - 1),
        opts.maxDelayMs
      )

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error('Max retry attempts reached')
}

export function retryWithJitter<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  return retry(fn, {
    ...options,
    delayMs: (options.delayMs ?? 1000) * (0.5 + Math.random() * 0.5),
  })
}

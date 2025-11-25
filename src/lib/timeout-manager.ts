/**
 * Timeout management for handling async operations with timeout limits
 */

export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export class TimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Execute an async operation with a timeout
   */
  async withTimeout<T>(fn: () => Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new TimeoutError(errorMessage))
      }, timeoutMs)

      fn()
        .then((result) => {
          clearTimeout(timeout)
          resolve(result)
        })
        .catch((error: Error) => {
          clearTimeout(timeout)
          reject(error)
        })
    })
  }

  /**
   * Set a named timeout that can be cancelled later
   */
  set(id: string, fn: () => void, delay: number): void {
    this.clear(id)
    const timeout = setTimeout(() => {
      fn()
      this.timeouts.delete(id)
    }, delay)
    this.timeouts.set(id, timeout)
  }

  /**
   * Clear a specific timeout
   */
  clear(id: string): void {
    const timeout = this.timeouts.get(id)
    if (timeout) {
      clearTimeout(timeout)
      this.timeouts.delete(id)
    }
  }

  /**
   * Clear all timeouts
   */
  clearAll(): void {
    for (const timeout of Array.from(this.timeouts.values())) {
      clearTimeout(timeout)
    }
    this.timeouts.clear()
  }

  /**
   * Check if a timeout exists
   */
  has(id: string): boolean {
    return this.timeouts.has(id)
  }

  /**
   * Get number of active timeouts
   */
  getActiveCount(): number {
    return this.timeouts.size
  }
}

// Singleton instance
/**
 * timeoutManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of timeoutManager.
 */
export const timeoutManager = new TimeoutManager()

/**
 * Promise-based delay utility
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Execute a function with timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<T> {
  return timeoutManager.withTimeout(fn, timeoutMs, errorMessage)
}

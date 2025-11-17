/**
 * Request deduplication to prevent duplicate simultaneous requests
 */

type PendingRequest<T> = {
  promise: Promise<T>
  timestamp: number
}

export class RequestDeduplicator {
  private pending: Map<string, PendingRequest<unknown>> = new Map()
  private readonly ttl: number

  constructor(ttl: number = 30000) {
    this.ttl = ttl
  }

  /**
   * Execute a request with deduplication
   */
  async execute<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Check for existing pending request
    const existing = this.pending.get(key)
    if (existing) {
      const age = Date.now() - existing.timestamp
      if (age < this.ttl) {
        return existing.promise as Promise<T>
      }
      this.pending.delete(key)
    }

    // Create new request
    const promise = fn()
      .then(result => {
        this.pending.delete(key)
        return result
      })
      .catch((error: Error) => {
        this.pending.delete(key)
        throw error
      })

    this.pending.set(key, { promise, timestamp: Date.now() })
    return promise
  }

  /**
   * Clear a specific pending request
   */
  clear(key: string): void {
    this.pending.delete(key)
  }

  /**
   * Clear all pending requests
   */
  clearAll(): void {
    this.pending.clear()
  }

  /**
   * Check if a request is pending
   */
  isPending(key: string): boolean {
    return this.pending.has(key)
  }

  /**
   * Get number of pending requests
   */
  getPendingCount(): number {
    return this.pending.size
  }
}

// Singleton instance
export const requestDeduplicator = new RequestDeduplicator()

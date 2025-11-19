/**
 * Buffer utilities for state synchronization
 */

export class StateBuffer<T> {
  private buffer: Array<{ state: T; timestamp: number }> = []
  private maxSize: number

  constructor(maxSize = 60) {
    this.maxSize = maxSize
  }

  add(state: T, timestamp: number): void {
    this.buffer.push({ state, timestamp })

    // Keep buffer sorted by timestamp
    this.buffer.sort((a, b) => a.timestamp - b.timestamp)

    // Remove old states
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift()
    }
  }

  get(timestamp: number): T | null {
    if (this.buffer.length === 0) return null

    // Find exact match
    const exact = this.buffer.find(item => item.timestamp === timestamp)
    if (exact) return exact.state

    // Find closest state
    let closest = this.buffer[0]
    let minDiff = Math.abs(timestamp - closest.timestamp)

    for (const item of this.buffer) {
      const diff = Math.abs(timestamp - item.timestamp)
      if (diff < minDiff) {
        minDiff = diff
        closest = item
      }
    }

    return closest.state
  }

  getInterpolated(timestamp: number, interpolate: (a: T, b: T, t: number) => T): T | null {
    if (this.buffer.length < 2) {
      return this.buffer.length === 1 ? this.buffer[0].state : null
    }

    // Find states to interpolate between
    let before: { state: T; timestamp: number } | null = null
    let after: { state: T; timestamp: number } | null = null

    for (let i = 0; i < this.buffer.length - 1; i++) {
      if (this.buffer[i].timestamp <= timestamp && this.buffer[i + 1].timestamp >= timestamp) {
        before = this.buffer[i]
        after = this.buffer[i + 1]
        break
      }
    }

    if (!before || !after) {
      // Use closest state
      return this.get(timestamp)
    }

    const duration = after.timestamp - before.timestamp
    const elapsed = timestamp - before.timestamp
    const t = duration > 0 ? elapsed / duration : 0

    return interpolate(before.state, after.state, t)
  }

  getLatest(): T | null {
    if (this.buffer.length === 0) return null
    return this.buffer[this.buffer.length - 1].state
  }

  getOldest(): T | null {
    if (this.buffer.length === 0) return null
    return this.buffer[0].state
  }

  clear(): void {
    this.buffer = []
  }

  size(): number {
    return this.buffer.length
  }

  getAll(): Array<{ state: T; timestamp: number }> {
    return [...this.buffer]
  }

  removeOlderThan(timestamp: number): void {
    this.buffer = this.buffer.filter(item => item.timestamp >= timestamp)
  }
}

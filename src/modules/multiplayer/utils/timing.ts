/**
 * Timing utilities for multiplayer synchronization
 */

export class ServerTime {
  private offset = 0
  private lastSyncTime = 0
  private syncSamples: number[] = []
  private maxSamples = 10

  sync(serverTimestamp: number, clientSendTime: number, clientReceiveTime: number): void {
    const rtt = clientReceiveTime - clientSendTime
    const estimatedServerTime = serverTimestamp + rtt / 2
    const offset = estimatedServerTime - clientReceiveTime

    this.syncSamples.push(offset)
    if (this.syncSamples.length > this.maxSamples) {
      this.syncSamples.shift()
    }

    this.offset = this.calculateMedianOffset()
    this.lastSyncTime = Date.now()
  }

  now(): number {
    return Date.now() + this.offset
  }

  getOffset(): number {
    return this.offset
  }

  getLastSyncAge(): number {
    return Date.now() - this.lastSyncTime
  }

  needsSync(maxAge = 30000): boolean {
    return this.getLastSyncAge() > maxAge
  }

  private calculateMedianOffset(): number {
    if (this.syncSamples.length === 0) return 0

    const sorted = [...this.syncSamples].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2
    }
    return sorted[mid]
  }

  reset(): void {
    this.offset = 0
    this.lastSyncTime = 0
    this.syncSamples = []
  }
}

export function calculateServerTick(timestamp: number, tickRate: number): number {
  return Math.floor(timestamp / (1000 / tickRate))
}

export function calculateTickProgress(timestamp: number, tickRate: number): number {
  const tickDuration = 1000 / tickRate
  return (timestamp % tickDuration) / tickDuration
}

export function waitForNextTick(tickRate: number): Promise<void> {
  const tickDuration = 1000 / tickRate
  const now = Date.now()
  const nextTick = Math.ceil(now / tickDuration) * tickDuration
  const delay = nextTick - now

  return new Promise(resolve => setTimeout(resolve, delay))
}

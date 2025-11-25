/**
 * Performance metrics tracking
 */

interface MetricEntry {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, unknown>
}

class MetricsCollector {
  private metrics: MetricEntry[] = []
  private maxSize = 1000

  record(name: string, value: number, metadata?: Record<string, unknown>): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      metadata,
    })

    if (this.metrics.length > this.maxSize) {
      this.metrics.shift()
    }
  }

  timing(name: string, fn: () => void): void {
    const start = performance.now()
    fn()
    const duration = performance.now() - start
    this.record(name, duration, { type: 'timing' })
  }

  async timingAsync(name: string, fn: () => Promise<void>): Promise<void> {
    const start = performance.now()
    await fn()
    const duration = performance.now() - start
    this.record(name, duration, { type: 'timing' })
  }

  getMetrics(name?: string): MetricEntry[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name)
    }
    return [...this.metrics]
  }

  getAverage(name: string): number {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) {
      return 0
    }

    const sum = metrics.reduce((acc, m) => acc + m.value, 0)
    return sum / metrics.length
  }

  getLatest(name: string): MetricEntry | null {
    const metrics = this.getMetrics(name)
    return metrics[metrics.length - 1] ?? null
  }

  clear(): void {
    this.metrics = []
  }
}

/**
 * metrics utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of metrics.
 */
export const metrics = new MetricsCollector()

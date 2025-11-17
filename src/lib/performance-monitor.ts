/**
 * Performance monitoring and metrics collection
 */

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, unknown>
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private timers: Map<string, number> = new Map()

  /**
   * Start timing an operation
   */
  start(name: string): void {
    this.timers.set(name, performance.now())
  }

  /**
   * End timing and record metric
   */
  end(name: string, metadata?: Record<string, unknown>): number {
    const startTime = this.timers.get(name)
    if (!startTime) {
      console.warn(`No start time found for metric: ${name}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.timers.delete(name)

    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    })

    return duration
  }

  /**
   * Measure function execution time
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name)
    try {
      const result = await fn()
      this.end(name)
      return result
    } catch (error) {
      this.end(name, { error: true })
      throw error
    }
  }

  /**
   * Measure synchronous function execution time
   */
  measureSync<T>(name: string, fn: () => T): T {
    this.start(name)
    try {
      const result = fn()
      this.end(name)
      return result
    } catch (error) {
      this.end(name, { error: true })
      throw error
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name)
  }

  /**
   * Get average duration for a metric
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetricsByName(name)
    if (metrics.length === 0) {return 0}

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<
    string,
    {
      count: number
      avg: number
      min: number
      max: number
      total: number
    }
  > {
    const summary: Record<
      string,
      { count: number; avg: number; min: number; max: number; total: number }
    > = {}

    for (const metric of this.metrics) {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          avg: 0,
          min: Infinity,
          max: -Infinity,
          total: 0,
        }
      }

      const s = summary[metric.name]
      if (s) {
        s.count++
        s.total += metric.duration
        s.min = Math.min(s.min, metric.duration)
        s.max = Math.max(s.max, metric.duration)
        s.avg = s.total / s.count
      }
    }

    return summary
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    this.timers.clear()
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    return JSON.stringify({
      metrics: this.metrics,
      summary: this.getSummary(),
      exportedAt: new Date().toISOString(),
    })
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Decorator for automatic performance measurement
 */
export function Measure(name?: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown

    descriptor.value = async function (...args: unknown[]) {
      const metricName = name ?? `${String(propertyKey)}`
      return performanceMonitor.measure(metricName, () =>
        Promise.resolve(originalMethod.apply(this, args))
      )
    }

    return descriptor
  }
}

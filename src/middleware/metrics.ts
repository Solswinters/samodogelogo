/**
 * Metrics collection middleware
 */

export interface Metric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

export class MetricsCollector {
  private metrics: Metric[] = []
  private counters: Map<string, number> = new Map()
  private gauges: Map<string, number> = new Map()

  /**
   * Increment counter
   */
  increment(name: string, value: number = 1, tags?: Record<string, string>): void {
    const current = this.counters.get(name) ?? 0
    this.counters.set(name, current + value)

    this.recordMetric({
      name,
      value: current + value,
      timestamp: Date.now(),
      tags,
    })
  }

  /**
   * Set gauge value
   */
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    this.gauges.set(name, value)

    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
    })
  }

  /**
   * Record timing
   */
  timing(name: string, duration: number, tags?: Record<string, string>): void {
    this.recordMetric({
      name: `${name}.duration`,
      value: duration,
      timestamp: Date.now(),
      tags,
    })
  }

  /**
   * Get counter value
   */
  getCounter(name: string): number {
    return this.counters.get(name) ?? 0
  }

  /**
   * Get gauge value
   */
  getGauge(name: string): number {
    return this.gauges.get(name) ?? 0
  }

  /**
   * Get all metrics
   */
  getMetrics(): Metric[] {
    return [...this.metrics]
  }

  /**
   * Record metric
   */
  private recordMetric(metric: Metric): void {
    this.metrics.push(metric)
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    this.counters.clear()
    this.gauges.clear()
  }
}

/**
 * metrics utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of metrics.
 */
export const metrics = new MetricsCollector()

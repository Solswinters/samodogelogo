/**
 * Performance monitoring
 */

export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  timestamp: Date
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private marks = new Map<string, number>()

  mark(name: string) {
    this.marks.set(name, performance.now())
  }

  measure(name: string, startMark: string, endMark?: string) {
    const start = this.marks.get(startMark)
    if (!start) return

    const end = endMark ? this.marks.get(endMark) : performance.now()
    if (!end) return

    const duration = end - start

    this.recordMetric({
      name,
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
    })

    return duration
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric)
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name)
    }
    return [...this.metrics]
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return null

    const sum = metrics.reduce((acc, m) => acc + m.value, 0)
    return sum / metrics.length
  }

  // Specific monitors
  monitorRenderTime(componentName: string, callback: () => void) {
    this.mark(`${componentName}-start`)
    callback()
    this.mark(`${componentName}-end`)
    this.measure(`render-${componentName}`, `${componentName}-start`, `${componentName}-end`)
  }

  monitorAPICall(endpoint: string, callback: () => Promise<unknown>) {
    this.mark(`api-${endpoint}-start`)

    return callback().finally(() => {
      this.mark(`api-${endpoint}-end`)
      this.measure(`api-${endpoint}`, `api-${endpoint}-start`, `api-${endpoint}-end`)
    })
  }
}

/**
 * performanceMonitor utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of performanceMonitor.
 */
export const performanceMonitor = new PerformanceMonitor()

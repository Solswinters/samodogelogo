/**
 * Performance monitoring utilities
 */

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 100

  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name)
    }
  }

  measure(name: string, startMark: string, endMark?: string): number | null {
    if (typeof window === 'undefined' || !window.performance) {
      return null
    }

    try {
      if (endMark) {
        window.performance.measure(name, startMark, endMark)
      } else {
        window.performance.measure(name, startMark)
      }

      const entries = window.performance.getEntriesByName(name, 'measure')
      const lastEntry = entries[entries.length - 1]

      if (lastEntry) {
        const metric: PerformanceMetric = {
          name,
          duration: lastEntry.duration,
          timestamp: Date.now(),
        }

        this.metrics.push(metric)

        if (this.metrics.length > this.maxMetrics) {
          this.metrics.shift()
        }

        return lastEntry.duration
      }
    } catch (error) {
      console.error('Failed to measure performance:', error)
    }

    return null
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name)
    }
    return [...this.metrics]
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics = this.metrics.filter(m => m.name !== name)
    } else {
      this.metrics = []
    }

    if (typeof window !== 'undefined' && window.performance) {
      if (name) {
        window.performance.clearMarks(name)
        window.performance.clearMeasures(name)
      } else {
        window.performance.clearMarks()
        window.performance.clearMeasures()
      }
    }
  }

  getAveragedurations(name: string): number | null {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) {
      return null
    }

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }
}

export const performanceMonitor = new PerformanceMonitor()

export function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const startMark = `${name}-start`
  const endMark = `${name}-end`

  performanceMonitor.mark(startMark)

  return fn().finally(() => {
    performanceMonitor.mark(endMark)
    performanceMonitor.measure(name, startMark, endMark)
  })
}

export function measureSync<T>(name: string, fn: () => T): T {
  const startMark = `${name}-start`
  const endMark = `${name}-end`

  performanceMonitor.mark(startMark)

  try {
    return fn()
  } finally {
    performanceMonitor.mark(endMark)
    performanceMonitor.measure(name, startMark, endMark)
  }
}

export default performanceMonitor

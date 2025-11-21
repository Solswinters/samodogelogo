/**
 * Performance monitoring and optimization utilities
 * Provides tools for measuring and improving game performance
 */

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  drawCalls: number
  entityCount: number
}

export interface PerformanceSample {
  timestamp: number
  metrics: PerformanceMetrics
}

export class GamePerformanceUtils {
  private static frameCount = 0
  private static lastFrameTime = 0
  private static fps = 60
  private static frameTimes: number[] = []
  private static samples: PerformanceSample[] = []
  private static maxSamples = 300 // 5 seconds at 60 FPS

  /**
   * Start frame timing
   */
  static startFrame(): void {
    this.lastFrameTime = performance.now()
  }

  /**
   * End frame timing and calculate FPS
   */
  static endFrame(): void {
    const currentTime = performance.now()
    const frameTime = currentTime - this.lastFrameTime

    this.frameTimes.push(frameTime)

    // Keep last 60 samples
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift()
    }

    // Calculate average FPS
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    this.fps = 1000 / avgFrameTime

    this.frameCount++
  }

  /**
   * Get current FPS
   */
  static getFPS(): number {
    return Math.round(this.fps)
  }

  /**
   * Get average frame time
   */
  static getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
  }

  /**
   * Get min frame time
   */
  static getMinFrameTime(): number {
    return Math.min(...this.frameTimes)
  }

  /**
   * Get max frame time
   */
  static getMaxFrameTime(): number {
    return Math.max(...this.frameTimes)
  }

  /**
   * Get memory usage (if available)
   */
  static getMemoryUsage(): number {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory
      return memory.usedJSHeapSize / (1024 * 1024) // Convert to MB
    }
    return 0
  }

  /**
   * Record performance sample
   */
  static recordSample(drawCalls: number, entityCount: number): void {
    const sample: PerformanceSample = {
      timestamp: Date.now(),
      metrics: {
        fps: this.getFPS(),
        frameTime: this.getAverageFrameTime(),
        memoryUsage: this.getMemoryUsage(),
        drawCalls,
        entityCount,
      },
    }

    this.samples.push(sample)

    // Keep only recent samples
    if (this.samples.length > this.maxSamples) {
      this.samples.shift()
    }
  }

  /**
   * Get performance samples
   */
  static getSamples(): PerformanceSample[] {
    return [...this.samples]
  }

  /**
   * Get performance statistics
   */
  static getStatistics(): {
    avgFPS: number
    minFPS: number
    maxFPS: number
    avgFrameTime: number
    avgMemory: number
    avgDrawCalls: number
    avgEntities: number
  } {
    if (this.samples.length === 0) {
      return {
        avgFPS: 0,
        minFPS: 0,
        maxFPS: 0,
        avgFrameTime: 0,
        avgMemory: 0,
        avgDrawCalls: 0,
        avgEntities: 0,
      }
    }

    const fps = this.samples.map((s) => s.metrics.fps)
    const frameTimes = this.samples.map((s) => s.metrics.frameTime)
    const memory = this.samples.map((s) => s.metrics.memoryUsage)
    const drawCalls = this.samples.map((s) => s.metrics.drawCalls)
    const entities = this.samples.map((s) => s.metrics.entityCount)

    return {
      avgFPS: fps.reduce((a, b) => a + b, 0) / fps.length,
      minFPS: Math.min(...fps),
      maxFPS: Math.max(...fps),
      avgFrameTime: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
      avgMemory: memory.reduce((a, b) => a + b, 0) / memory.length,
      avgDrawCalls: drawCalls.reduce((a, b) => a + b, 0) / drawCalls.length,
      avgEntities: entities.reduce((a, b) => a + b, 0) / entities.length,
    }
  }

  /**
   * Check if performance is low
   */
  static isLowPerformance(): boolean {
    return this.getFPS() < 30
  }

  /**
   * Get performance level
   */
  static getPerformanceLevel(): 'low' | 'medium' | 'high' {
    const fps = this.getFPS()
    if (fps < 30) return 'low'
    if (fps < 50) return 'medium'
    return 'high'
  }

  /**
   * Measure function execution time
   */
  static measure<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return result
  }

  /**
   * Measure async function execution time
   */
  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return result
  }

  /**
   * Create performance marker
   */
  static mark(name: string): void {
    if ('mark' in performance) {
      performance.mark(name)
    }
  }

  /**
   * Measure between markers
   */
  static measureBetween(name: string, startMark: string, endMark: string): void {
    if ('measure' in performance) {
      try {
        performance.measure(name, startMark, endMark)
        const measures = performance.getEntriesByName(name, 'measure')
        if (measures.length > 0) {
          console.log(`[Performance] ${name}: ${measures[0].duration.toFixed(2)}ms`)
        }
      } catch (error) {
        console.error('Failed to measure:', error)
      }
    }
  }

  /**
   * Clear performance data
   */
  static clear(): void {
    this.frameCount = 0
    this.frameTimes = []
    this.samples = []
  }

  /**
   * Object pool for reusing objects
   */
  static createObjectPool<T>(
    create: () => T,
    reset: (obj: T) => void,
    initialSize: number = 10
  ): {
    acquire: () => T
    release: (obj: T) => void
    size: () => number
  } {
    const pool: T[] = []

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      pool.push(create())
    }

    return {
      acquire: (): T => {
        return pool.length > 0 ? pool.pop()! : create()
      },
      release: (obj: T): void => {
        reset(obj)
        pool.push(obj)
      },
      size: (): number => pool.length,
    }
  }

  /**
   * Throttle function calls
   */
  static throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
    let lastCall = 0
    return ((...args: any[]) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        return fn(...args)
      }
    }) as T
  }

  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
    let timeoutId: NodeJS.Timeout | null = null
    return ((...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }) as T
  }

  /**
   * Request animation frame with fallback
   */
  static requestFrame(callback: (time: number) => void): number {
    if (typeof requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame(callback)
    }
    return setTimeout(() => callback(Date.now()), 16) as any
  }

  /**
   * Cancel animation frame with fallback
   */
  static cancelFrame(id: number): void {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(id)
    } else {
      clearTimeout(id)
    }
  }

  /**
   * Batch updates to reduce reflows
   */
  static batchUpdate(updates: Array<() => void>): void {
    this.requestFrame(() => {
      updates.forEach((update) => update())
    })
  }

  /**
   * Check if code is running in production
   */
  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  }

  /**
   * Log performance warning
   */
  static warnIfSlow(duration: number, threshold: number = 16): void {
    if (duration > threshold && !this.isProduction()) {
      console.warn(
        `Performance warning: Operation took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
      )
    }
  }

  /**
   * Get suggested quality settings based on performance
   */
  static getSuggestedQuality(): {
    particleLimit: number
    shadowQuality: 'low' | 'medium' | 'high'
    textureQuality: 'low' | 'medium' | 'high'
    antialiasing: boolean
    postProcessing: boolean
  } {
    const level = this.getPerformanceLevel()

    switch (level) {
      case 'low':
        return {
          particleLimit: 50,
          shadowQuality: 'low',
          textureQuality: 'low',
          antialiasing: false,
          postProcessing: false,
        }
      case 'medium':
        return {
          particleLimit: 150,
          shadowQuality: 'medium',
          textureQuality: 'medium',
          antialiasing: true,
          postProcessing: false,
        }
      case 'high':
        return {
          particleLimit: 500,
          shadowQuality: 'high',
          textureQuality: 'high',
          antialiasing: true,
          postProcessing: true,
        }
    }
  }

  /**
   * Format memory size
   */
  static formatMemory(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  /**
   * Get performance report
   */
  static getReport(): string {
    const stats = this.getStatistics()
    const memory = this.getMemoryUsage()

    return `
Performance Report:
- Average FPS: ${stats.avgFPS.toFixed(2)}
- FPS Range: ${stats.minFPS.toFixed(0)} - ${stats.maxFPS.toFixed(0)}
- Average Frame Time: ${stats.avgFrameTime.toFixed(2)}ms
- Memory Usage: ${memory.toFixed(2)}MB
- Average Draw Calls: ${stats.avgDrawCalls.toFixed(0)}
- Average Entities: ${stats.avgEntities.toFixed(0)}
- Performance Level: ${this.getPerformanceLevel()}
    `.trim()
  }
}

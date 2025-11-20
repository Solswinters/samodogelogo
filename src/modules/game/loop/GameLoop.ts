/**
 * Main game loop with fixed timestep and performance monitoring
 */

export interface GameLoopConfig {
  targetFPS: number
  maxFrameTime: number
  enableProfiling: boolean
  adaptiveTimestep: boolean
  maxUpdatesPerFrame: number
}

export interface PerformanceMetrics {
  fps: number
  averageFPS: number
  minFPS: number
  maxFPS: number
  frameTime: number
  updateTime: number
  renderTime: number
  totalFrames: number
  droppedFrames: number
  timestamp: number
}

export interface LoopStats {
  isRunning: boolean
  currentFPS: number
  targetFPS: number
  frameCount: number
  totalTime: number
  updateCount: number
  renderCount: number
}

export class GameLoop {
  private isRunning: boolean = false
  private isPaused: boolean = false
  private lastTime: number = 0
  private accumulator: number = 0
  private fixedTimeStep: number = 16.67 // 60 FPS
  private maxFrameTime: number = 250 // Max 250ms per frame
  private rafId: number | null = null
  private frameCount: number = 0
  private updateCount: number = 0
  private renderCount: number = 0
  private startTime: number = 0
  private fpsBuffer: number[] = []
  private readonly FPS_BUFFER_SIZE = 60

  // Performance tracking
  private lastFpsUpdate: number = 0
  private fpsAccumulator: number = 0
  private currentFPS: number = 0
  private minFPS: number = Infinity
  private maxFPS: number = 0
  private droppedFrames: number = 0
  private lastUpdateTime: number = 0
  private lastRenderTime: number = 0

  // Config
  private config: GameLoopConfig

  // Callbacks
  private updateCallback: (deltaTime: number) => void
  private renderCallback: (alpha: number) => void
  private beforeUpdateCallback?: () => void
  private afterUpdateCallback?: () => void
  private beforeRenderCallback?: () => void
  private afterRenderCallback?: () => void
  private onFrameCallback?: (metrics: PerformanceMetrics) => void

  constructor(
    update: (deltaTime: number) => void,
    render: (alpha: number) => void,
    config?: Partial<GameLoopConfig>
  ) {
    this.updateCallback = update
    this.renderCallback = render

    this.config = {
      targetFPS: 60,
      maxFrameTime: 250,
      enableProfiling: false,
      adaptiveTimestep: false,
      maxUpdatesPerFrame: 5,
      ...config,
    }

    this.fixedTimeStep = 1000 / this.config.targetFPS
    this.maxFrameTime = this.config.maxFrameTime
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    this.isPaused = false
    this.lastTime = performance.now()
    this.startTime = this.lastTime
    this.lastFpsUpdate = this.lastTime
    this.accumulator = 0
    this.frameCount = 0
    this.updateCount = 0
    this.renderCount = 0
    this.fpsAccumulator = 0
    this.droppedFrames = 0

    this.loop(this.lastTime)
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /**
   * Pause the game loop
   */
  pause(): void {
    this.isPaused = true
  }

  /**
   * Resume the game loop
   */
  resume(): void {
    if (this.isPaused) {
      this.isPaused = false
      this.lastTime = performance.now()
      this.accumulator = 0
    }
  }

  /**
   * Main loop function
   */
  private loop = (currentTime: number): void => {
    if (!this.isRunning) {
      return
    }

    this.rafId = requestAnimationFrame(this.loop)

    if (this.isPaused) {
      return
    }

    const frameStart = performance.now()
    this.frameCount++

    let frameTime = currentTime - this.lastTime
    this.lastTime = currentTime

    // Cap frame time to prevent spiral of death
    if (frameTime > this.maxFrameTime) {
      frameTime = this.maxFrameTime
      this.droppedFrames++
    }

    // Adaptive timestep
    if (this.config.adaptiveTimestep && this.currentFPS > 0) {
      const targetFrameTime = 1000 / this.config.targetFPS
      const fpsRatio = this.currentFPS / this.config.targetFPS

      if (fpsRatio < 0.8) {
        // Running slow, adjust timestep
        frameTime *= 1.1
      }
    }

    this.accumulator += frameTime

    // Fixed timestep updates
    let updateIterations = 0
    const updateStart = performance.now()

    this.beforeUpdateCallback?.()

    while (
      this.accumulator >= this.fixedTimeStep &&
      updateIterations < this.config.maxUpdatesPerFrame
    ) {
      this.updateCallback(this.fixedTimeStep)
      this.accumulator -= this.fixedTimeStep
      this.updateCount++
      updateIterations++
    }

    this.afterUpdateCallback?.()

    this.lastUpdateTime = performance.now() - updateStart

    // If we exceeded max updates, drop the remaining accumulator
    if (updateIterations >= this.config.maxUpdatesPerFrame) {
      this.accumulator = 0
      this.droppedFrames++
    }

    // Interpolation factor for smooth rendering
    const alpha = this.accumulator / this.fixedTimeStep

    const renderStart = performance.now()

    this.beforeRenderCallback?.()

    this.renderCallback(alpha)
    this.renderCount++

    this.afterRenderCallback?.()

    this.lastRenderTime = performance.now() - renderStart

    // Update FPS
    this.fpsAccumulator += frameTime

    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.currentFPS = Math.round(
        (1000 * (this.frameCount - this.fpsAccumulator / frameTime)) /
          (currentTime - this.lastFpsUpdate)
      )

      // Update FPS buffer
      this.fpsBuffer.push(this.currentFPS)
      if (this.fpsBuffer.length > this.FPS_BUFFER_SIZE) {
        this.fpsBuffer.shift()
      }

      // Update min/max FPS
      this.minFPS = Math.min(this.minFPS, this.currentFPS)
      this.maxFPS = Math.max(this.maxFPS, this.currentFPS)

      this.lastFpsUpdate = currentTime
      this.fpsAccumulator = 0
    }

    // Performance metrics callback
    if (this.config.enableProfiling && this.onFrameCallback) {
      const totalFrameTime = performance.now() - frameStart

      const metrics: PerformanceMetrics = {
        fps: this.currentFPS,
        averageFPS: this.getAverageFPS(),
        minFPS: this.minFPS,
        maxFPS: this.maxFPS,
        frameTime: totalFrameTime,
        updateTime: this.lastUpdateTime,
        renderTime: this.lastRenderTime,
        totalFrames: this.frameCount,
        droppedFrames: this.droppedFrames,
        timestamp: currentTime,
      }

      this.onFrameCallback(metrics)
    }
  }

  /**
   * Check if loop is running
   */
  isActive(): boolean {
    return this.isRunning
  }

  /**
   * Check if loop is paused
   */
  isPausedState(): boolean {
    return this.isPaused
  }

  /**
   * Set fixed timestep
   */
  setFixedTimeStep(timeStep: number): void {
    this.fixedTimeStep = timeStep
  }

  /**
   * Set target FPS
   */
  setTargetFPS(fps: number): void {
    this.config.targetFPS = fps
    this.fixedTimeStep = 1000 / fps
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.currentFPS
  }

  /**
   * Get average FPS
   */
  getAverageFPS(): number {
    if (this.fpsBuffer.length === 0) return 0
    return this.fpsBuffer.reduce((sum, fps) => sum + fps, 0) / this.fpsBuffer.length
  }

  /**
   * Get loop statistics
   */
  getStats(): LoopStats {
    return {
      isRunning: this.isRunning,
      currentFPS: this.currentFPS,
      targetFPS: this.config.targetFPS,
      frameCount: this.frameCount,
      totalTime: performance.now() - this.startTime,
      updateCount: this.updateCount,
      renderCount: this.renderCount,
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.currentFPS,
      averageFPS: this.getAverageFPS(),
      minFPS: this.minFPS,
      maxFPS: this.maxFPS,
      frameTime: this.lastUpdateTime + this.lastRenderTime,
      updateTime: this.lastUpdateTime,
      renderTime: this.lastRenderTime,
      totalFrames: this.frameCount,
      droppedFrames: this.droppedFrames,
      timestamp: performance.now(),
    }
  }

  /**
   * Set before update callback
   */
  setBeforeUpdate(callback: () => void): void {
    this.beforeUpdateCallback = callback
  }

  /**
   * Set after update callback
   */
  setAfterUpdate(callback: () => void): void {
    this.afterUpdateCallback = callback
  }

  /**
   * Set before render callback
   */
  setBeforeRender(callback: () => void): void {
    this.beforeRenderCallback = callback
  }

  /**
   * Set after render callback
   */
  setAfterRender(callback: () => void): void {
    this.afterRenderCallback = callback
  }

  /**
   * Set frame metrics callback
   */
  setOnFrame(callback: (metrics: PerformanceMetrics) => void): void {
    this.onFrameCallback = callback
  }

  /**
   * Enable/disable profiling
   */
  setProfiling(enabled: boolean): void {
    this.config.enableProfiling = enabled
  }

  /**
   * Enable/disable adaptive timestep
   */
  setAdaptiveTimestep(enabled: boolean): void {
    this.config.adaptiveTimestep = enabled
  }

  /**
   * Set max updates per frame
   */
  setMaxUpdatesPerFrame(max: number): void {
    this.config.maxUpdatesPerFrame = Math.max(1, max)
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.frameCount = 0
    this.updateCount = 0
    this.renderCount = 0
    this.droppedFrames = 0
    this.minFPS = Infinity
    this.maxFPS = 0
    this.fpsBuffer = []
    this.startTime = performance.now()
  }

  /**
   * Get uptime in milliseconds
   */
  getUptime(): number {
    return performance.now() - this.startTime
  }

  /**
   * Get configuration
   */
  getConfig(): GameLoopConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<GameLoopConfig>): void {
    Object.assign(this.config, config)

    if (config.targetFPS) {
      this.fixedTimeStep = 1000 / config.targetFPS
    }

    if (config.maxFrameTime) {
      this.maxFrameTime = config.maxFrameTime
    }
  }
}

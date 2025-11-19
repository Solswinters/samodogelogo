/**
 * Main game loop with fixed timestep
 */

export class GameLoop {
  private isRunning: boolean = false
  private lastTime: number = 0
  private accumulator: number = 0
  private fixedTimeStep: number = 16.67 // 60 FPS
  private maxFrameTime: number = 250 // Max 250ms per frame
  private rafId: number | null = null

  private updateCallback: (deltaTime: number) => void
  private renderCallback: (alpha: number) => void

  constructor(update: (deltaTime: number) => void, render: (alpha: number) => void) {
    this.updateCallback = update
    this.renderCallback = render
  }

  start(): void {
    if (this.isRunning) {
      return
    }

    this.isRunning = true
    this.lastTime = performance.now()
    this.accumulator = 0
    this.loop(this.lastTime)
  }

  stop(): void {
    this.isRunning = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private loop = (currentTime: number): void => {
    if (!this.isRunning) {
      return
    }

    this.rafId = requestAnimationFrame(this.loop)

    let frameTime = currentTime - this.lastTime
    this.lastTime = currentTime

    // Cap frame time to prevent spiral of death
    if (frameTime > this.maxFrameTime) {
      frameTime = this.maxFrameTime
    }

    this.accumulator += frameTime

    // Fixed timestep updates
    while (this.accumulator >= this.fixedTimeStep) {
      this.updateCallback(this.fixedTimeStep)
      this.accumulator -= this.fixedTimeStep
    }

    // Interpolation factor for smooth rendering
    const alpha = this.accumulator / this.fixedTimeStep
    this.renderCallback(alpha)
  }

  isActive(): boolean {
    return this.isRunning
  }

  setFixedTimeStep(timeStep: number): void {
    this.fixedTimeStep = timeStep
  }
}

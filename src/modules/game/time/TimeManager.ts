/**
 * Time management with slow-motion support
 */

export class TimeManager {
  private timeScale: number = 1
  private elapsedTime: number = 0
  private pausedTime: number = 0
  private isPaused: boolean = false

  update(deltaTime: number): void {
    if (!this.isPaused) {
      const scaledDelta = deltaTime * this.timeScale
      this.elapsedTime += scaledDelta
    } else {
      this.pausedTime += deltaTime
    }
  }

  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, Math.min(scale, 2))
  }

  getTimeScale(): number {
    return this.timeScale
  }

  pause(): void {
    this.isPaused = true
  }

  resume(): void {
    this.isPaused = false
  }

  isPausedState(): boolean {
    return this.isPaused
  }

  getElapsedTime(): number {
    return this.elapsedTime
  }

  getPausedTime(): number {
    return this.pausedTime
  }

  getActiveTime(): number {
    return this.elapsedTime
  }

  reset(): void {
    this.elapsedTime = 0
    this.pausedTime = 0
    this.timeScale = 1
    this.isPaused = false
  }

  slowMotion(factor: number = 0.5, duration: number): void {
    const originalScale = this.timeScale
    this.setTimeScale(factor)

    setTimeout(() => {
      this.setTimeScale(originalScale)
    }, duration / factor)
  }
}

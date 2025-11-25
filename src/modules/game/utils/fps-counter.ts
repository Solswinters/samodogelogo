/**
 * FPS counter for performance monitoring
 */

export class FPSCounter {
  private frames: number = 0
  private lastTime: number = 0
  private fps: number = 0
  private fpsHistory: number[] = []
  private historySize: number = 60 // Store last 60 FPS readings

  constructor(private updateInterval: number = 1000) {
    this.lastTime = performance.now()
  }

  update(): void {
    this.frames++
    const currentTime = performance.now()
    const delta = currentTime - this.lastTime

    if (delta >= this.updateInterval) {
      this.fps = Math.round((this.frames * 1000) / delta)
      this.frames = 0
      this.lastTime = currentTime

      // Add to history
      this.fpsHistory.push(this.fps)
      if (this.fpsHistory.length > this.historySize) {
        this.fpsHistory.shift()
      }
    }
  }

  getFPS(): number {
    return this.fps
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) {return 0}
    const sum = this.fpsHistory.reduce((acc, fps) => acc + fps, 0)
    return Math.round(sum / this.fpsHistory.length)
  }

  getMinFPS(): number {
    if (this.fpsHistory.length === 0) {return 0}
    return Math.min(...this.fpsHistory)
  }

  getMaxFPS(): number {
    if (this.fpsHistory.length === 0) {return 0}
    return Math.max(...this.fpsHistory)
  }

  reset(): void {
    this.frames = 0
    this.lastTime = performance.now()
    this.fps = 0
    this.fpsHistory = []
  }

  getHistory(): number[] {
    return [...this.fpsHistory]
  }

  isStable(threshold: number = 5): boolean {
    if (this.fpsHistory.length < this.historySize) {return true}

    const avgFPS = this.getAverageFPS()
    const variance =
      this.fpsHistory.reduce((acc, fps) => {
        return acc + Math.abs(fps - avgFPS)
      }, 0) / this.fpsHistory.length

    return variance < threshold
  }

  getPerformanceRating(): 'excellent' | 'good' | 'fair' | 'poor' {
    const avgFPS = this.getAverageFPS()
    if (avgFPS >= 55) {return 'excellent'}
    if (avgFPS >= 45) {return 'good'}
    if (avgFPS >= 30) {return 'fair'}
    return 'poor'
  }
}

// Singleton instance
/**
 * fpsCounter utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of fpsCounter.
 */
export const fpsCounter = new FPSCounter()

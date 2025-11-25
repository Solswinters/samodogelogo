/**
 * Time management utilities for game timing
 */

export class TimeManager {
  private startTime: number = 0
  private pausedTime: number = 0
  private isPaused: boolean = false
  private pauseStartTime: number = 0

  start(): void {
    this.startTime = Date.now()
    this.pausedTime = 0
    this.isPaused = false
  }

  pause(): void {
    if (!this.isPaused) {
      this.isPaused = true
      this.pauseStartTime = Date.now()
    }
  }

  resume(): void {
    if (this.isPaused) {
      this.pausedTime += Date.now() - this.pauseStartTime
      this.isPaused = false
    }
  }

  getElapsedTime(): number {
    if (this.startTime === 0) {
      return 0
    }

    let elapsed = Date.now() - this.startTime - this.pausedTime

    if (this.isPaused) {
      elapsed -= Date.now() - this.pauseStartTime
    }

    return Math.max(0, elapsed)
  }

  getElapsedSeconds(): number {
    return Math.floor(this.getElapsedTime() / 1000)
  }

  getElapsedMinutes(): number {
    return Math.floor(this.getElapsedSeconds() / 60)
  }

  getFormattedTime(): string {
    const totalSeconds = this.getElapsedSeconds()
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  isRunning(): boolean {
    return this.startTime > 0 && !this.isPaused
  }

  reset(): void {
    this.startTime = 0
    this.pausedTime = 0
    this.isPaused = false
    this.pauseStartTime = 0
  }
}

/**
 * gameTimer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of gameTimer.
 */
export const gameTimer = new TimeManager()

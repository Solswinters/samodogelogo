/**
 * Animation helper utilities
 */

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export function easeIn(t: number): number {
  return t * t
}

export function easeOut(t: number): number {
  return t * (2 - t)
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function smoothStep(t: number): number {
  return t * t * (3 - 2 * t)
}

export interface AnimationFrame {
  timestamp: number
  deltaTime: number
  fps: number
}

export class FrameRateMonitor {
  private frames: number[] = []
  private readonly maxFrames = 60

  update(timestamp: number): AnimationFrame {
    this.frames.push(timestamp)

    if (this.frames.length > this.maxFrames) {
      this.frames.shift()
    }

    const deltaTime =
      this.frames.length > 1 ? timestamp - this.frames[this.frames.length - 2] : 16.67

    const fps = this.frames.length > 1 ? 1000 / deltaTime : 60

    return {
      timestamp,
      deltaTime,
      fps,
    }
  }

  getAverageFPS(): number {
    if (this.frames.length < 2) {
      return 60
    }

    const totalTime = this.frames[this.frames.length - 1] - this.frames[0]
    const averageDelta = totalTime / (this.frames.length - 1)

    return 1000 / averageDelta
  }

  reset(): void {
    this.frames = []
  }
}

export function requestAnimationFrameWithFallback(callback: FrameRequestCallback): number {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback)
  }
  return setTimeout(() => callback(Date.now()), 16) as unknown as number
}

export function cancelAnimationFrameWithFallback(id: number): void {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id)
  } else {
    clearTimeout(id)
  }
}

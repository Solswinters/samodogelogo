/**
 * Interpolation utilities for smooth multiplayer movement
 */

export interface Position {
  x: number
  y: number
}

/**
 * lerp utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of lerp.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * lerpPosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of lerpPosition.
 */
export function lerpPosition(start: Position, end: Position, t: number): Position {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
  }
}

/**
 * smoothStep utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of smoothStep.
 */
export function smoothStep(t: number): number {
  return t * t * (3 - 2 * t)
}

/**
 * smootherStep utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of smootherStep.
 */
export function smootherStep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/**
 * easeInQuad utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of easeInQuad.
 */
export function easeInQuad(t: number): number {
  return t * t
}

/**
 * easeOutQuad utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of easeOutQuad.
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t)
}

/**
 * easeInOutQuad utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of easeInOutQuad.
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * calculateInterpolationFactor utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateInterpolationFactor.
 */
export function calculateInterpolationFactor(
  currentTime: number,
  startTime: number,
  duration: number
): number {
  const elapsed = currentTime - startTime
  return Math.min(1, Math.max(0, elapsed / duration))
}

export class PositionInterpolator {
  private history: Array<{ position: Position; timestamp: number }> = []
  private maxHistorySize = 10

  addPosition(position: Position, timestamp: number): void {
    this.history.push({ position, timestamp })
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }

  interpolate(currentTime: number, delay = 100): Position | null {
    if (this.history.length < 2) return null

    const targetTime = currentTime - delay

    for (let i = 0; i < this.history.length - 1; i++) {
      const current = this.history[i]
      const next = this.history[i + 1]

      if (current.timestamp <= targetTime && targetTime <= next.timestamp) {
        const duration = next.timestamp - current.timestamp
        const elapsed = targetTime - current.timestamp
        const t = duration > 0 ? elapsed / duration : 1

        return lerpPosition(current.position, next.position, t)
      }
    }

    return this.history[this.history.length - 1].position
  }

  clear(): void {
    this.history = []
  }
}

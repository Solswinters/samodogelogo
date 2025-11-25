/**
 * Camera system for game viewport
 */

export interface CameraConfig {
  x: number
  y: number
  width: number
  height: number
  followTarget: boolean
  targetX?: number
  targetY?: number
  smoothing: number
}

export class Camera {
  private x: number = 0
  private y: number = 0
  private width: number
  private height: number
  private followTarget: boolean = false
  private targetX: number = 0
  private targetY: number = 0
  private smoothing: number = 0.1

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getX(): number {
    return this.x
  }

  getY(): number {
    return this.y
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  setTarget(x: number, y: number): void {
    this.targetX = x
    this.targetY = y
    this.followTarget = true
  }

  clearTarget(): void {
    this.followTarget = false
  }

  setSmoothing(smoothing: number): void {
    this.smoothing = Math.max(0, Math.min(1, smoothing))
  }

  update(): void {
    if (this.followTarget) {
      // Smooth camera movement toward target
      const targetCameraX = this.targetX - this.width / 2
      const targetCameraY = this.targetY - this.height / 2

      this.x += (targetCameraX - this.x) * this.smoothing
      this.y += (targetCameraY - this.y) * this.smoothing
    }
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.x,
      y: worldY - this.y,
    }
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.x,
      y: screenY + this.y,
    }
  }

  isInView(x: number, y: number, width: number, height: number): boolean {
    return (
      x + width > this.x &&
      x < this.x + this.width &&
      y + height > this.y &&
      y < this.y + this.height
    )
  }

  getViewBounds(): { left: number; right: number; top: number; bottom: number } {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    }
  }

  shake(intensity: number = 10, duration: number = 300): void {
    const startTime = Date.now()
    const originalX = this.x
    const originalY = this.y

    const shakeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      if (elapsed > duration) {
        clearInterval(shakeInterval)
        this.x = originalX
        this.y = originalY
        return
      }

      const progress = 1 - elapsed / duration
      const currentIntensity = intensity * progress

      this.x = originalX + (Math.random() - 0.5) * currentIntensity
      this.y = originalY + (Math.random() - 0.5) * currentIntensity
    }, 16)
  }

  zoom(factor: number): void {
    this.width *= factor
    this.height *= factor
  }

  reset(): void {
    this.x = 0
    this.y = 0
    this.followTarget = false
  }
}

/**
 * gameCamera utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of gameCamera.
 */
export const gameCamera = new Camera(800, 600)

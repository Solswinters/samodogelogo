/**
 * Camera system for viewport control
 */

export interface CameraConfig {
  x: number
  y: number
  width: number
  height: number
  followSpeed: number
}

export class Camera {
  private x: number = 0
  private y: number = 0
  private targetX: number = 0
  private targetY: number = 0
  private width: number
  private height: number
  private followSpeed: number

  constructor(config: CameraConfig) {
    this.x = config.x
    this.y = config.y
    this.width = config.width
    this.height = config.height
    this.followSpeed = config.followSpeed
  }

  setTarget(x: number, y: number): void {
    this.targetX = x
    this.targetY = y
  }

  update(deltaTime: number): void {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y

    this.x += dx * this.followSpeed * (deltaTime / 16.67)
    this.y += dy * this.followSpeed * (deltaTime / 16.67)
  }

  getX(): number {
    return this.x
  }

  getY(): number {
    return this.y
  }

  getViewport(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
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
}

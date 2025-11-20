/**
 * Camera system for viewport management
 */

export interface CameraConfig {
  width: number
  height: number
  followSpeed: number
  deadZone: {
    x: number
    y: number
  }
}

export class Camera {
  x = 0
  y = 0
  private config: CameraConfig
  private targetX = 0
  private targetY = 0

  constructor(config: Partial<CameraConfig> = {}) {
    this.config = {
      width: 800,
      height: 600,
      followSpeed: 0.1,
      deadZone: {
        x: 100,
        y: 50,
      },
      ...config,
    }
  }

  follow(targetX: number, targetY: number): void {
    this.targetX = targetX - this.config.width / 2
    this.targetY = targetY - this.config.height / 2
  }

  update(): void {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y

    // Apply dead zone
    if (Math.abs(dx) > this.config.deadZone.x) {
      this.x += dx * this.config.followSpeed
    }
    if (Math.abs(dy) > this.config.deadZone.y) {
      this.y += dy * this.config.followSpeed
    }
  }

  apply(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.x, -this.y)
  }

  restore(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y)
  }

  worldToScreen(x: number, y: number): { x: number; y: number } {
    return {
      x: x - this.x,
      y: y - this.y,
    }
  }

  screenToWorld(x: number, y: number): { x: number; y: number } {
    return {
      x: x + this.x,
      y: y + this.y,
    }
  }

  isVisible(x: number, y: number, width: number, height: number): boolean {
    return (
      x + width >= this.x &&
      x <= this.x + this.config.width &&
      y + height >= this.y &&
      y <= this.y + this.config.height
    )
  }

  shake(intensity: number, duration: number): void {
    // Camera shake implementation
    // This would typically be handled by the ScreenShake effect
  }
}

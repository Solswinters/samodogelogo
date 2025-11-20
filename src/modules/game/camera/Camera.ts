/**
 * Camera system for viewport management with advanced features
 */

export interface CameraConfig {
  width: number
  height: number
  followSpeed: number
  deadZone: {
    x: number
    y: number
  }
  minZoom: number
  maxZoom: number
  zoomSpeed: number
  smoothing: boolean
  bounds?: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

export interface CameraShake {
  intensity: number
  duration: number
  elapsed: number
  offsetX: number
  offsetY: number
}

export interface CameraEffect {
  type: 'fade' | 'flash' | 'zoom'
  progress: number
  duration: number
  params: any
}

export class Camera {
  x = 0
  y = 0
  private config: CameraConfig
  private targetX = 0
  private targetY = 0
  private zoom = 1
  private targetZoom = 1
  private rotation = 0
  private targetRotation = 0
  private shake: CameraShake | null = null
  private effects: CameraEffect[] = []
  private locked = false
  private velocity = { x: 0, y: 0 }
  private lookAhead = { x: 0, y: 0 }

  constructor(config: Partial<CameraConfig> = {}) {
    this.config = {
      width: 800,
      height: 600,
      followSpeed: 0.1,
      deadZone: {
        x: 100,
        y: 50,
      },
      minZoom: 0.5,
      maxZoom: 2.0,
      zoomSpeed: 0.05,
      smoothing: true,
      ...config,
    }
  }

  /**
   * Set target to follow with velocity prediction
   */
  follow(targetX: number, targetY: number, velocityX?: number, velocityY?: number): void {
    if (this.locked) return

    // Add look-ahead based on velocity
    if (velocityX !== undefined && velocityY !== undefined) {
      const lookAheadFactor = 50
      this.lookAhead.x = velocityX * lookAheadFactor
      this.lookAhead.y = velocityY * lookAheadFactor
    }

    this.targetX = targetX - this.config.width / 2 / this.zoom + this.lookAhead.x
    this.targetY = targetY - this.config.height / 2 / this.zoom + this.lookAhead.y
  }

  /**
   * Update camera position and effects
   */
  update(deltaTime: number = 16): void {
    if (this.locked) return

    // Update shake
    if (this.shake) {
      this.shake.elapsed += deltaTime

      if (this.shake.elapsed >= this.shake.duration) {
        this.shake = null
      } else {
        const intensity = this.shake.intensity * (1 - this.shake.elapsed / this.shake.duration)
        this.shake.offsetX = (Math.random() - 0.5) * intensity * 2
        this.shake.offsetY = (Math.random() - 0.5) * intensity * 2
      }
    }

    // Update position with dead zone
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y

    if (this.config.smoothing) {
      if (Math.abs(dx) > this.config.deadZone.x) {
        this.x += dx * this.config.followSpeed
      }
      if (Math.abs(dy) > this.config.deadZone.y) {
        this.y += dy * this.config.followSpeed
      }
    } else {
      this.x = this.targetX
      this.y = this.targetY
    }

    // Update zoom
    if (this.targetZoom !== this.zoom) {
      const zoomDiff = this.targetZoom - this.zoom
      this.zoom += zoomDiff * this.config.zoomSpeed

      if (Math.abs(zoomDiff) < 0.001) {
        this.zoom = this.targetZoom
      }
    }

    // Update rotation
    if (this.targetRotation !== this.rotation) {
      const rotDiff = this.targetRotation - this.rotation
      this.rotation += rotDiff * 0.1

      if (Math.abs(rotDiff) < 0.001) {
        this.rotation = this.targetRotation
      }
    }

    // Apply bounds
    if (this.config.bounds) {
      this.x = Math.max(
        this.config.bounds.minX,
        Math.min(this.x, this.config.bounds.maxX - this.config.width)
      )
      this.y = Math.max(
        this.config.bounds.minY,
        Math.min(this.y, this.config.bounds.maxY - this.config.height)
      )
    }

    // Update effects
    this.effects = this.effects.filter((effect) => {
      effect.progress += deltaTime / effect.duration
      return effect.progress < 1
    })
  }

  /**
   * Apply camera transform to context
   */
  apply(ctx: CanvasRenderingContext2D): void {
    ctx.save()

    // Move to center
    ctx.translate(this.config.width / 2, this.config.height / 2)

    // Apply rotation
    if (this.rotation !== 0) {
      ctx.rotate(this.rotation)
    }

    // Apply zoom
    if (this.zoom !== 1) {
      ctx.scale(this.zoom, this.zoom)
    }

    // Apply shake
    let shakeX = 0
    let shakeY = 0
    if (this.shake) {
      shakeX = this.shake.offsetX
      shakeY = this.shake.offsetY
    }

    // Move to camera position
    ctx.translate(
      -this.x + shakeX - this.config.width / 2,
      -this.y + shakeY - this.config.height / 2
    )
  }

  /**
   * Restore context to pre-camera state
   */
  restore(ctx: CanvasRenderingContext2D): void {
    ctx.restore()
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(x: number, y: number): { x: number; y: number } {
    const shakeX = this.shake?.offsetX || 0
    const shakeY = this.shake?.offsetY || 0

    return {
      x: (x - this.x + shakeX) * this.zoom + this.config.width / 2,
      y: (y - this.y + shakeY) * this.zoom + this.config.height / 2,
    }
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(x: number, y: number): { x: number; y: number } {
    const shakeX = this.shake?.offsetX || 0
    const shakeY = this.shake?.offsetY || 0

    return {
      x: (x - this.config.width / 2) / this.zoom + this.x - shakeX,
      y: (y - this.config.height / 2) / this.zoom + this.y - shakeY,
    }
  }

  /**
   * Check if object is visible in camera view
   */
  isVisible(x: number, y: number, width: number, height: number): boolean {
    const padding = 100
    return (
      x + width >= this.x - padding &&
      x <= this.x + this.config.width / this.zoom + padding &&
      y + height >= this.y - padding &&
      y <= this.y + this.config.height / this.zoom + padding
    )
  }

  /**
   * Trigger camera shake
   */
  shake(intensity: number, duration: number): void {
    this.shake = {
      intensity,
      duration,
      elapsed: 0,
      offsetX: 0,
      offsetY: 0,
    }
  }

  /**
   * Stop camera shake
   */
  stopShake(): void {
    this.shake = null
  }

  /**
   * Set camera zoom
   */
  setZoom(zoom: number, instant: boolean = false): void {
    zoom = Math.max(this.config.minZoom, Math.min(zoom, this.config.maxZoom))

    if (instant) {
      this.zoom = zoom
    }

    this.targetZoom = zoom
  }

  /**
   * Zoom in
   */
  zoomIn(amount: number = 0.1): void {
    this.setZoom(this.targetZoom + amount)
  }

  /**
   * Zoom out
   */
  zoomOut(amount: number = 0.1): void {
    this.setZoom(this.targetZoom - amount)
  }

  /**
   * Reset zoom to default
   */
  resetZoom(): void {
    this.setZoom(1)
  }

  /**
   * Get current zoom level
   */
  getZoom(): number {
    return this.zoom
  }

  /**
   * Set camera rotation
   */
  setRotation(rotation: number, instant: boolean = false): void {
    if (instant) {
      this.rotation = rotation
    }

    this.targetRotation = rotation
  }

  /**
   * Rotate camera
   */
  rotate(angle: number): void {
    this.setRotation(this.targetRotation + angle)
  }

  /**
   * Reset rotation
   */
  resetRotation(): void {
    this.setRotation(0)
  }

  /**
   * Get camera bounds
   */
  getBounds(): {
    left: number
    right: number
    top: number
    bottom: number
    width: number
    height: number
  } {
    return {
      left: this.x,
      right: this.x + this.config.width / this.zoom,
      top: this.y,
      bottom: this.y + this.config.height / this.zoom,
      width: this.config.width / this.zoom,
      height: this.config.height / this.zoom,
    }
  }

  /**
   * Set camera bounds
   */
  setBounds(minX: number, maxX: number, minY: number, maxY: number): void {
    this.config.bounds = { minX, maxX, minY, maxY }
  }

  /**
   * Clear camera bounds
   */
  clearBounds(): void {
    this.config.bounds = undefined
  }

  /**
   * Lock camera movement
   */
  lock(): void {
    this.locked = true
  }

  /**
   * Unlock camera movement
   */
  unlock(): void {
    this.locked = false
  }

  /**
   * Check if camera is locked
   */
  isLocked(): boolean {
    return this.locked
  }

  /**
   * Move camera instantly to position
   */
  setPosition(x: number, y: number, instant: boolean = false): void {
    if (instant) {
      this.x = x
      this.y = y
    }

    this.targetX = x
    this.targetY = y
  }

  /**
   * Center camera on position
   */
  centerOn(x: number, y: number, instant: boolean = false): void {
    this.setPosition(
      x - this.config.width / 2 / this.zoom,
      y - this.config.height / 2 / this.zoom,
      instant
    )
  }

  /**
   * Pan camera by offset
   */
  pan(dx: number, dy: number): void {
    this.targetX += dx
    this.targetY += dy
  }

  /**
   * Get camera center
   */
  getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.config.width / 2 / this.zoom,
      y: this.y + this.config.height / 2 / this.zoom,
    }
  }

  /**
   * Get camera position
   */
  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y }
  }

  /**
   * Get target position
   */
  getTargetPosition(): { x: number; y: number } {
    return { x: this.targetX, y: this.targetY }
  }

  /**
   * Set follow speed
   */
  setFollowSpeed(speed: number): void {
    this.config.followSpeed = Math.max(0, Math.min(1, speed))
  }

  /**
   * Set dead zone
   */
  setDeadZone(x: number, y: number): void {
    this.config.deadZone.x = x
    this.config.deadZone.y = y
  }

  /**
   * Enable/disable smoothing
   */
  setSmoothing(enabled: boolean): void {
    this.config.smoothing = enabled
  }

  /**
   * Reset camera to defaults
   */
  reset(): void {
    this.x = 0
    this.y = 0
    this.targetX = 0
    this.targetY = 0
    this.zoom = 1
    this.targetZoom = 1
    this.rotation = 0
    this.targetRotation = 0
    this.shake = null
    this.effects = []
    this.locked = false
    this.velocity = { x: 0, y: 0 }
    this.lookAhead = { x: 0, y: 0 }
  }

  /**
   * Add camera effect
   */
  addEffect(type: CameraEffect['type'], duration: number, params?: any): void {
    this.effects.push({
      type,
      progress: 0,
      duration,
      params,
    })
  }

  /**
   * Get active effects
   */
  getEffects(): CameraEffect[] {
    return [...this.effects]
  }

  /**
   * Clear all effects
   */
  clearEffects(): void {
    this.effects = []
  }
}

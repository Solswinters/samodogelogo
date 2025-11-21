/**
 * Minimap System - Small map overlay showing game area
 */

export interface MinimapConfig {
  width: number
  height: number
  x: number
  y: number
  scale: number
  backgroundColor: string
  borderColor: string
}

export interface MinimapEntity {
  id: string
  x: number
  y: number
  color: string
  size: number
  type: 'player' | 'obstacle' | 'coin' | 'powerup'
}

export class MinimapSystem {
  private config: MinimapConfig
  private entities: Map<string, MinimapEntity> = new Map()
  private enabled: boolean = true
  private worldWidth: number
  private worldHeight: number

  constructor(worldWidth: number, worldHeight: number, config?: Partial<MinimapConfig>) {
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight

    this.config = {
      width: 150,
      height: 100,
      x: 10,
      y: 10,
      scale: 0.1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderColor: '#FFFFFF',
      ...config,
    }
  }

  /**
   * Add entity to minimap
   */
  addEntity(entity: MinimapEntity): void {
    this.entities.set(entity.id, entity)
  }

  /**
   * Update entity position
   */
  updateEntity(id: string, x: number, y: number): void {
    const entity = this.entities.get(id)
    if (entity) {
      entity.x = x
      entity.y = y
    }
  }

  /**
   * Remove entity
   */
  removeEntity(id: string): void {
    this.entities.delete(id)
  }

  /**
   * Render minimap
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.enabled) return

    ctx.save()

    // Draw background
    ctx.fillStyle = this.config.backgroundColor
    ctx.fillRect(this.config.x, this.config.y, this.config.width, this.config.height)

    // Draw border
    ctx.strokeStyle = this.config.borderColor
    ctx.lineWidth = 2
    ctx.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height)

    // Draw entities
    for (const entity of this.entities.values()) {
      const mapX = this.config.x + (entity.x / this.worldWidth) * this.config.width
      const mapY = this.config.y + (entity.y / this.worldHeight) * this.config.height

      ctx.fillStyle = entity.color
      ctx.beginPath()
      ctx.arc(mapX, mapY, entity.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  /**
   * Set enabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Check if enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Set position
   */
  setPosition(x: number, y: number): void {
    this.config.x = x
    this.config.y = y
  }

  /**
   * Set size
   */
  setSize(width: number, height: number): void {
    this.config.width = width
    this.config.height = height
  }

  /**
   * Clear all entities
   */
  clear(): void {
    this.entities.clear()
  }

  /**
   * Get entity count
   */
  getEntityCount(): number {
    return this.entities.size
  }

  /**
   * Set world size
   */
  setWorldSize(width: number, height: number): void {
    this.worldWidth = width
    this.worldHeight = height
  }
}

export default MinimapSystem

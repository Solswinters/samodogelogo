/**
 * Minimap system for navigation
 */

interface MinimapEntity {
  id: string
  x: number
  y: number
  type: 'player' | 'enemy' | 'objective' | 'powerup'
  color: string
}

export interface MinimapConfig {
  width: number
  height: number
  worldWidth: number
  worldHeight: number
  backgroundColor?: string
  borderColor?: string
}

export class Minimap {
  private width: number
  private height: number
  private worldWidth: number
  private worldHeight: number
  private backgroundColor: string
  private borderColor: string
  private entities: Map<string, MinimapEntity>
  private scaleX: number
  private scaleY: number

  constructor(config: MinimapConfig) {
    this.width = config.width
    this.height = config.height
    this.worldWidth = config.worldWidth
    this.worldHeight = config.worldHeight
    this.backgroundColor = config.backgroundColor ?? '#000000'
    this.borderColor = config.borderColor ?? '#ffffff'
    this.entities = new Map()

    this.scaleX = this.width / this.worldWidth
    this.scaleY = this.height / this.worldHeight
  }

  addEntity(entity: MinimapEntity): void {
    this.entities.set(entity.id, entity)
  }

  removeEntity(id: string): void {
    this.entities.delete(id)
  }

  updateEntity(id: string, x: number, y: number): void {
    const entity = this.entities.get(id)
    if (entity) {
      entity.x = x
      entity.y = y
    }
  }

  render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
    ctx.save()
    ctx.translate(offsetX, offsetY)

    // Draw background
    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(0, 0, this.width, this.height)

    // Draw border
    ctx.strokeStyle = this.borderColor
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, this.width, this.height)

    // Draw entities
    for (const entity of this.entities.values()) {
      const x = entity.x * this.scaleX
      const y = entity.y * this.scaleY

      ctx.fillStyle = entity.color
      ctx.beginPath()

      switch (entity.type) {
        case 'player':
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          break
        case 'enemy':
          ctx.rect(x - 3, y - 3, 6, 6)
          break
        case 'objective':
          this.drawStar(ctx, x, y, 5, 4, 2)
          break
        case 'powerup':
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          break
      }

      ctx.fill()
    }

    ctx.restore()
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }

    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
  }

  clear(): void {
    this.entities.clear()
  }

  resize(worldWidth: number, worldHeight: number): void {
    this.worldWidth = worldWidth
    this.worldHeight = worldHeight
    this.scaleX = this.width / this.worldWidth
    this.scaleY = this.height / this.worldHeight
  }
}

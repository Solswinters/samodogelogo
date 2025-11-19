/**
 * Parallax background system
 */

export interface BackgroundLayer {
  id: string
  y: number
  speed: number
  offset: number
  color: string
  height: number
}

export class Background {
  private layers: BackgroundLayer[] = []

  constructor() {
    this.initializeLayers()
  }

  private initializeLayers(): void {
    this.layers = [
      {
        id: 'sky',
        y: 0,
        speed: 0,
        offset: 0,
        color: '#1a1a2e',
        height: 300,
      },
      {
        id: 'mountains',
        y: 250,
        speed: 0.2,
        offset: 0,
        color: '#2a2a3e',
        height: 100,
      },
      {
        id: 'hills',
        y: 300,
        speed: 0.5,
        offset: 0,
        color: '#3a3a4e',
        height: 50,
      },
    ]
  }

  update(gameSpeed: number, deltaTime: number): void {
    for (const layer of this.layers) {
      layer.offset += gameSpeed * layer.speed * (deltaTime / 16.67)

      // Wrap around
      if (layer.offset > 800) {
        layer.offset -= 800
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number): void {
    for (const layer of this.layers) {
      ctx.fillStyle = layer.color
      ctx.fillRect(0, layer.y, width, layer.height)

      // Add visual elements based on layer
      if (layer.id === 'mountains') {
        this.drawMountains(ctx, width, layer)
      } else if (layer.id === 'hills') {
        this.drawHills(ctx, width, layer)
      }
    }
  }

  private drawMountains(
    ctx: CanvasRenderingContext2D,
    width: number,
    layer: BackgroundLayer
  ): void {
    ctx.save()
    ctx.fillStyle = '#252535'

    for (let i = -1; i < 3; i++) {
      const x = i * 400 - layer.offset
      const y = layer.y + layer.height

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 100, y - 60)
      ctx.lineTo(x + 200, y)
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()
  }

  private drawHills(ctx: CanvasRenderingContext2D, width: number, layer: BackgroundLayer): void {
    ctx.save()
    ctx.fillStyle = '#35354e'

    for (let i = -1; i < 4; i++) {
      const x = i * 300 - layer.offset
      const y = layer.y + layer.height

      ctx.beginPath()
      ctx.arc(x + 150, y, 80, Math.PI, 0)
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()
  }

  reset(): void {
    for (const layer of this.layers) {
      layer.offset = 0
    }
  }
}

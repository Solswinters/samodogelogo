/**
 * Particle class for visual effects
 */

export interface ParticleConfig {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  color: string
  decay: number
}

export class Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  decay: number
  alpha: number

  constructor(config: ParticleConfig) {
    this.x = config.x
    this.y = config.y
    this.vx = config.vx
    this.vy = config.vy
    this.life = config.life
    this.maxLife = config.life
    this.size = config.size
    this.color = config.color
    this.decay = config.decay
    this.alpha = 1
  }

  update(deltaTime: number): void {
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
    this.life -= this.decay * deltaTime
    this.alpha = this.life / this.maxLife
  }

  isAlive(): boolean {
    return this.life > 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

/**
 * Particle Pool - Object pooling for particles to reduce GC pressure
 * HIGH PRIORITY: Performance optimization through object reuse
 */

export interface PooledParticle {
  x: number
  y: number
  vx: number
  vy: number
  ax: number
  ay: number
  life: number
  maxLife: number
  size: number
  startSize: number
  endSize: number
  color: string
  startColor: string
  endColor: string
  alpha: number
  rotation: number
  rotationSpeed: number
  shape: 'circle' | 'square' | 'triangle' | 'star'
  active: boolean
}

export interface ParticlePoolConfig {
  initialSize: number
  maxSize: number
  growthFactor: number
}

export class ParticlePool {
  private pool: PooledParticle[] = []
  private config: ParticlePoolConfig
  private activeCount = 0

  constructor(config: Partial<ParticlePoolConfig> = {}) {
    this.config = {
      initialSize: config.initialSize || 100,
      maxSize: config.maxSize || 1000,
      growthFactor: config.growthFactor || 1.5,
    }

    this.initialize()
  }

  /**
   * Initialize pool with inactive particles
   */
  private initialize(): void {
    for (let i = 0; i < this.config.initialSize; i++) {
      this.pool.push(this.createParticle())
    }
  }

  /**
   * Create a new particle
   */
  private createParticle(): PooledParticle {
    return {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      life: 0,
      maxLife: 1,
      size: 1,
      startSize: 1,
      endSize: 0,
      color: '#ffffff',
      startColor: '#ffffff',
      endColor: '#000000',
      alpha: 1,
      rotation: 0,
      rotationSpeed: 0,
      shape: 'circle',
      active: false,
    }
  }

  /**
   * Get a particle from the pool
   */
  public acquire(config?: Partial<PooledParticle>): PooledParticle | null {
    // Find inactive particle
    let particle = this.pool.find((p) => !p.active)

    // If no inactive particles and can grow, create new
    if (!particle && this.pool.length < this.config.maxSize) {
      const growthSize = Math.floor(this.pool.length * (this.config.growthFactor - 1))
      const newSize = Math.min(this.pool.length + Math.max(1, growthSize), this.config.maxSize)

      for (let i = this.pool.length; i < newSize; i++) {
        this.pool.push(this.createParticle())
      }

      particle = this.pool[this.pool.length - growthSize]
    }

    if (!particle) {
      return null // Pool exhausted
    }

    // Reset and configure particle
    this.resetParticle(particle, config)
    particle.active = true
    this.activeCount++

    return particle
  }

  /**
   * Return particle to pool
   */
  public release(particle: PooledParticle): void {
    if (particle.active) {
      particle.active = false
      this.activeCount--
    }
  }

  /**
   * Reset particle to default state
   */
  private resetParticle(particle: PooledParticle, config?: Partial<PooledParticle>): void {
    particle.x = config?.x ?? 0
    particle.y = config?.y ?? 0
    particle.vx = config?.vx ?? 0
    particle.vy = config?.vy ?? 0
    particle.ax = config?.ax ?? 0
    particle.ay = config?.ay ?? 0
    particle.life = 0
    particle.maxLife = config?.maxLife ?? 1
    particle.size = config?.size ?? 1
    particle.startSize = config?.startSize ?? particle.size
    particle.endSize = config?.endSize ?? 0
    particle.color = config?.color ?? '#ffffff'
    particle.startColor = config?.startColor ?? particle.color
    particle.endColor = config?.endColor ?? '#000000'
    particle.alpha = config?.alpha ?? 1
    particle.rotation = config?.rotation ?? 0
    particle.rotationSpeed = config?.rotationSpeed ?? 0
    particle.shape = config?.shape ?? 'circle'
  }

  /**
   * Update all active particles
   */
  public update(deltaTime: number): void {
    for (const particle of this.pool) {
      if (!particle.active) continue

      // Update physics
      particle.vx += particle.ax * deltaTime
      particle.vy += particle.ay * deltaTime
      particle.x += particle.vx * deltaTime
      particle.y += particle.vy * deltaTime

      // Update rotation
      particle.rotation += particle.rotationSpeed * deltaTime

      // Update life
      particle.life += deltaTime

      // Interpolate size
      const lifeRatio = particle.life / particle.maxLife
      particle.size = particle.startSize + (particle.endSize - particle.startSize) * lifeRatio

      // Interpolate alpha
      particle.alpha = 1 - lifeRatio

      // Deactivate if expired
      if (particle.life >= particle.maxLife) {
        this.release(particle)
      }
    }
  }

  /**
   * Render all active particles
   */
  public render(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.pool) {
      if (!particle.active) continue

      ctx.save()
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color

      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)

      switch (particle.shape) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'square':
          ctx.fillRect(-particle.size, -particle.size, particle.size * 2, particle.size * 2)
          break

        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -particle.size)
          ctx.lineTo(particle.size, particle.size)
          ctx.lineTo(-particle.size, particle.size)
          ctx.closePath()
          ctx.fill()
          break

        case 'star':
          this.renderStar(ctx, particle.size)
          break
      }

      ctx.restore()
    }
  }

  /**
   * Render star shape
   */
  private renderStar(ctx: CanvasRenderingContext2D, size: number): void {
    const spikes = 5
    const outerRadius = size
    const innerRadius = size * 0.5

    ctx.beginPath()

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * i) / spikes

      const x = radius * Math.cos(angle - Math.PI / 2)
      const y = radius * Math.sin(angle - Math.PI / 2)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.closePath()
    ctx.fill()
  }

  /**
   * Get active particle count
   */
  public getActiveCount(): number {
    return this.activeCount
  }

  /**
   * Get total pool size
   */
  public getPoolSize(): number {
    return this.pool.length
  }

  /**
   * Get pool statistics
   */
  public getStats(): {
    active: number
    total: number
    utilization: number
  } {
    return {
      active: this.activeCount,
      total: this.pool.length,
      utilization: this.activeCount / this.pool.length,
    }
  }

  /**
   * Clear all particles
   */
  public clear(): void {
    for (const particle of this.pool) {
      particle.active = false
    }
    this.activeCount = 0
  }

  /**
   * Emit burst of particles
   */
  public emitBurst(x: number, y: number, count: number, config?: Partial<PooledParticle>): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = config?.vx ?? 50

      this.acquire({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ...config,
      })
    }
  }

  /**
   * Emit particles in a cone
   */
  public emitCone(
    x: number,
    y: number,
    angle: number,
    spread: number,
    count: number,
    config?: Partial<PooledParticle>
  ): void {
    for (let i = 0; i < count; i++) {
      const particleAngle = angle + (Math.random() - 0.5) * spread
      const speed = config?.vx ?? 50

      this.acquire({
        x,
        y,
        vx: Math.cos(particleAngle) * speed,
        vy: Math.sin(particleAngle) * speed,
        ...config,
      })
    }
  }
}

export default ParticlePool

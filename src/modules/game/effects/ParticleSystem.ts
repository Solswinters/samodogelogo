/**
 * Particle System for visual effects
 */

export interface Particle {
  id: string
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
}

export interface ParticleSystemConfig {
  maxParticles: number
  emissionRate: number
  particleLife: number
  particleSize: number
  gravity: number
  friction: number
  windX: number
  windY: number
  useObjectPool: boolean
}

export interface EmitterConfig {
  x: number
  y: number
  rate: number
  angle: number
  angleSpread: number
  speed: number
  speedSpread: number
  lifeSpan: number
  lifeSpanSpread: number
  size: number
  sizeSpread: number
  colors: string[]
  shape: Particle['shape']
  continuous: boolean
}

export class ParticleSystem {
  private particles: Particle[] = []
  private particlePool: Particle[] = []
  private config: ParticleSystemConfig
  private nextId = 0
  private timeSinceLastEmission = 0
  private emitters: Map<string, EmitterConfig> = new Map()
  private isActive = true

  constructor(config: Partial<ParticleSystemConfig> = {}) {
    this.config = {
      maxParticles: 1000,
      emissionRate: 10,
      particleLife: 2000,
      particleSize: 4,
      gravity: 0.2,
      friction: 0.98,
      windX: 0,
      windY: 0,
      useObjectPool: true,
      ...config,
    }

    // Initialize object pool
    if (this.config.useObjectPool) {
      this.initializePool()
    }
  }

  private initializePool(): void {
    for (let i = 0; i < this.config.maxParticles; i++) {
      this.particlePool.push(this.createParticle(0, 0))
    }
  }

  private createParticle(x: number, y: number, options: Partial<Particle> = {}): Particle {
    return {
      id: `particle-${this.nextId++}`,
      x,
      y,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      life: this.config.particleLife,
      maxLife: this.config.particleLife,
      size: this.config.particleSize,
      startSize: this.config.particleSize,
      endSize: this.config.particleSize * 0.5,
      color: '#ffffff',
      startColor: '#ffffff',
      endColor: '#ffffff',
      alpha: 1,
      rotation: 0,
      rotationSpeed: 0,
      shape: 'circle',
      ...options,
    }
  }

  private getParticleFromPool(): Particle | null {
    if (this.particlePool.length > 0) {
      return this.particlePool.pop() || null
    }
    return null
  }

  private returnParticleToPool(particle: Particle): void {
    if (this.config.useObjectPool && this.particlePool.length < this.config.maxParticles) {
      this.particlePool.push(particle)
    }
  }

  emit(x: number, y: number, count: number, options: Partial<Particle> = {}): void {
    if (!this.isActive) return

    for (let i = 0; i < count && this.particles.length < this.config.maxParticles; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 3

      let particle: Particle

      if (this.config.useObjectPool) {
        const pooled = this.getParticleFromPool()
        if (pooled) {
          particle = pooled
          Object.assign(particle, {
            id: `particle-${this.nextId++}`,
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            ax: 0,
            ay: 0,
            life: this.config.particleLife,
            maxLife: this.config.particleLife,
            size: this.config.particleSize,
            startSize: this.config.particleSize,
            endSize: this.config.particleSize * 0.5,
            color: '#ffffff',
            startColor: '#ffffff',
            endColor: '#ffffff',
            alpha: 1,
            rotation: 0,
            rotationSpeed: 0,
            shape: 'circle' as const,
            ...options,
          })
        } else {
          continue
        }
      } else {
        particle = this.createParticle(x, y, {
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          ...options,
        })
      }

      this.particles.push(particle)
    }
  }

  /**
   * Create an emitter at a specific position
   */
  addEmitter(id: string, config: EmitterConfig): void {
    this.emitters.set(id, config)
  }

  /**
   * Remove an emitter
   */
  removeEmitter(id: string): void {
    this.emitters.delete(id)
  }

  /**
   * Update emitter position
   */
  updateEmitter(id: string, x: number, y: number): void {
    const emitter = this.emitters.get(id)
    if (emitter) {
      emitter.x = x
      emitter.y = y
    }
  }

  /**
   * Emit burst of particles
   */
  emitBurst(x: number, y: number, count: number, options: Partial<Particle> = {}): void {
    this.emit(x, y, count, options)
  }

  /**
   * Create explosion effect
   */
  createExplosion(x: number, y: number, intensity: number = 1, color: string = '#ff6600'): void {
    const particleCount = Math.floor(20 * intensity)

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const speed = 5 + Math.random() * 5 * intensity

      this.emit(x, y, 1, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        startColor: color,
        endColor: '#000000',
        size: 4 + Math.random() * 4 * intensity,
        life: 500 + Math.random() * 500,
        maxLife: 1000,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      })
    }
  }

  /**
   * Create trail effect
   */
  createTrail(x: number, y: number, vx: number, vy: number, color: string = '#ffffff'): void {
    this.emit(x, y, 1, {
      vx: vx * 0.5 + (Math.random() - 0.5) * 2,
      vy: vy * 0.5 + (Math.random() - 0.5) * 2,
      color,
      startColor: color,
      endColor: '#000000',
      size: 2 + Math.random() * 2,
      life: 300 + Math.random() * 200,
      maxLife: 500,
      shape: 'circle',
    })
  }

  /**
   * Create sparkle effect
   */
  createSparkle(x: number, y: number, color: string = '#ffff00'): void {
    const count = 5 + Math.floor(Math.random() * 10)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 3

      this.emit(x, y, 1, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        startColor: color,
        endColor: '#ffffff',
        size: 1 + Math.random() * 2,
        life: 200 + Math.random() * 300,
        maxLife: 500,
        shape: 'star',
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      })
    }
  }

  update(deltaTime: number): void {
    if (!this.isActive) return

    this.timeSinceLastEmission += deltaTime

    // Update emitters
    this.emitters.forEach((emitter) => {
      if (emitter.continuous) {
        const particlesToEmit = Math.floor((emitter.rate * deltaTime) / 1000)

        for (let i = 0; i < particlesToEmit; i++) {
          const angle = emitter.angle + (Math.random() - 0.5) * emitter.angleSpread
          const speed = emitter.speed + (Math.random() - 0.5) * emitter.speedSpread
          const life = emitter.lifeSpan + (Math.random() - 0.5) * emitter.lifeSpanSpread
          const size = emitter.size + (Math.random() - 0.5) * emitter.sizeSpread
          const color = emitter.colors[Math.floor(Math.random() * emitter.colors.length)]

          this.emit(emitter.x, emitter.y, 1, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life,
            maxLife: life,
            size,
            color: color || '#ffffff',
            shape: emitter.shape,
          })
        }
      }
    })

    // Update particles
    const deadParticles: Particle[] = []

    this.particles = this.particles.filter((particle) => {
      // Apply forces
      particle.ax = this.config.windX
      particle.ay = this.config.gravity + this.config.windY

      // Update velocity
      particle.vx += (particle.ax * deltaTime) / 16
      particle.vy += (particle.ay * deltaTime) / 16
      particle.vx *= this.config.friction
      particle.vy *= this.config.friction

      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Update rotation
      particle.rotation += particle.rotationSpeed

      // Update life
      particle.life -= deltaTime
      const lifeRatio = particle.life / particle.maxLife
      particle.alpha = lifeRatio

      // Interpolate size
      particle.size = particle.startSize + (particle.endSize - particle.startSize) * (1 - lifeRatio)

      // Interpolate color (simplified - just use start color)
      particle.color = particle.startColor

      const isAlive = particle.life > 0

      if (!isAlive) {
        deadParticles.push(particle)
      }

      return isAlive
    })

    // Return dead particles to pool
    if (this.config.useObjectPool) {
      deadParticles.forEach((particle) => this.returnParticleToPool(particle))
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) return

    this.particles.forEach((particle) => {
      ctx.save()
      ctx.globalAlpha = particle.alpha
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)

      ctx.fillStyle = particle.color

      switch (particle.shape) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'square':
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
          break

        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(0, -particle.size / 2)
          ctx.lineTo(particle.size / 2, particle.size / 2)
          ctx.lineTo(-particle.size / 2, particle.size / 2)
          ctx.closePath()
          ctx.fill()
          break

        case 'star':
          this.drawStar(ctx, 0, 0, 5, particle.size / 2, particle.size / 4)
          ctx.fill()
          break
      }

      ctx.restore()
    })
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    points: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    ctx.beginPath()

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (Math.PI * i) / points
      const px = x + Math.cos(angle - Math.PI / 2) * radius
      const py = y + Math.sin(angle - Math.PI / 2) * radius

      if (i === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }

    ctx.closePath()
  }

  /**
   * Clear all particles
   */
  clear(): void {
    if (this.config.useObjectPool) {
      this.particles.forEach((particle) => this.returnParticleToPool(particle))
    }
    this.particles = []
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.particles.length
  }

  /**
   * Set gravity
   */
  setGravity(gravity: number): void {
    this.config.gravity = gravity
  }

  /**
   * Set wind
   */
  setWind(x: number, y: number): void {
    this.config.windX = x
    this.config.windY = y
  }

  /**
   * Set friction
   */
  setFriction(friction: number): void {
    this.config.friction = Math.max(0, Math.min(1, friction))
  }

  /**
   * Pause particle system
   */
  pause(): void {
    this.isActive = false
  }

  /**
   * Resume particle system
   */
  resume(): void {
    this.isActive = true
  }

  /**
   * Check if particle system is active
   */
  getIsActive(): boolean {
    return this.isActive
  }

  /**
   * Get all particles
   */
  getParticles(): Particle[] {
    return [...this.particles]
  }

  /**
   * Get particles in area
   */
  getParticlesInArea(x: number, y: number, radius: number): Particle[] {
    return this.particles.filter((particle) => {
      const dx = particle.x - x
      const dy = particle.y - y
      return Math.sqrt(dx * dx + dy * dy) <= radius
    })
  }

  /**
   * Remove particles in area
   */
  removeParticlesInArea(x: number, y: number, radius: number): number {
    const before = this.particles.length

    this.particles = this.particles.filter((particle) => {
      const dx = particle.x - x
      const dy = particle.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance <= radius) {
        if (this.config.useObjectPool) {
          this.returnParticleToPool(particle)
        }
        return false
      }

      return true
    })

    return before - this.particles.length
  }

  /**
   * Get configuration
   */
  getConfig(): ParticleSystemConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ParticleSystemConfig>): void {
    Object.assign(this.config, config)
  }
}

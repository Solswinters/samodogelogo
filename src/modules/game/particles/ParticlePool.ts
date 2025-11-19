/**
 * Enhanced particle pool for efficient memory management
 */

import { Particle } from '../effects/particles/Particle'

export class ParticlePool {
  private pool: Particle[]
  private activeParticles: Set<Particle>
  private maxSize: number

  constructor(maxSize = 1000) {
    this.pool = []
    this.activeParticles = new Set()
    this.maxSize = maxSize
  }

  acquire(
    x: number,
    y: number,
    vx: number,
    vy: number,
    lifetime: number,
    color: string
  ): Particle | null {
    let particle: Particle

    if (this.pool.length > 0) {
      particle = this.pool.pop()!
      particle.x = x
      particle.y = y
      particle.vx = vx
      particle.vy = vy
      particle.lifetime = lifetime
      particle.age = 0
      particle.color = color
      particle.active = true
    } else if (this.activeParticles.size < this.maxSize) {
      particle = new Particle(x, y, vx, vy, lifetime, color)
    } else {
      return null
    }

    this.activeParticles.add(particle)
    return particle
  }

  release(particle: Particle): void {
    particle.active = false
    this.activeParticles.delete(particle)
    if (this.pool.length < this.maxSize / 2) {
      this.pool.push(particle)
    }
  }

  update(deltaTime: number): void {
    const toRelease: Particle[] = []

    for (const particle of this.activeParticles) {
      particle.update(deltaTime)
      if (!particle.active) {
        toRelease.push(particle)
      }
    }

    toRelease.forEach(p => this.release(p))
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.activeParticles) {
      particle.render(ctx)
    }
  }

  clear(): void {
    this.activeParticles.forEach(p => (p.active = false))
    this.pool.push(...this.activeParticles)
    this.activeParticles.clear()
  }

  getStats() {
    return {
      active: this.activeParticles.size,
      pooled: this.pool.length,
      capacity: this.maxSize,
    }
  }
}

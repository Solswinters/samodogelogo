/**
 * Particle system for managing multiple particles
 */

import { Particle, type ParticleConfig } from './Particle'
import { randomFloat } from '@/shared/math'

export interface EmitterConfig {
  x: number
  y: number
  count: number
  speedMin: number
  speedMax: number
  angleMin: number
  angleMax: number
  lifeMin: number
  lifeMax: number
  sizeMin: number
  sizeMax: number
  colors: string[]
  decay: number
}

export class ParticleSystem {
  private particles: Particle[] = []
  private maxParticles: number

  constructor(maxParticles: number = 1000) {
    this.maxParticles = maxParticles
  }

  emit(config: EmitterConfig): void {
    for (let i = 0; i < config.count; i++) {
      if (this.particles.length >= this.maxParticles) {
        break
      }

      const angle = randomFloat(config.angleMin, config.angleMax)
      const speed = randomFloat(config.speedMin, config.speedMax)

      const particle = new Particle({
        x: config.x,
        y: config.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: randomFloat(config.lifeMin, config.lifeMax),
        size: randomFloat(config.sizeMin, config.sizeMax),
        color: config.colors[Math.floor(Math.random() * config.colors.length)] as string,
        decay: config.decay,
      })

      this.particles.push(particle)
    }
  }

  update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]
      if (particle) {
        particle.update(deltaTime)

        if (!particle.isAlive()) {
          this.particles.splice(i, 1)
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => particle.draw(ctx))
  }

  clear(): void {
    this.particles = []
  }

  getParticleCount(): number {
    return this.particles.length
  }
}

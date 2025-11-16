/**
 * Particle effects for visual feedback
 */

import type { Particle } from '@/types/game'
import { v4 as uuidv4 } from 'uuid'

class ParticleSystem {
  private particles: Map<string, Particle> = new Map()

  createExplosion(
    x: number,
    y: number,
    count: number = 20,
    color: string = '#FF6B6B',
    speedMultiplier: number = 1
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = (Math.random() * 3 + 2) * speedMultiplier
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      this.addParticle({
        id: uuidv4(),
        x,
        y,
        vx,
        vy,
        life: 60,
        maxLife: 60,
        color,
        size: Math.random() * 4 + 2,
      })
    }
  }

  createTrail(x: number, y: number, count: number = 5, color: string = '#4ECDC4'): void {
    for (let i = 0; i < count; i++) {
      this.addParticle({
        id: uuidv4(),
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 30,
        maxLife: 30,
        color,
        size: Math.random() * 3 + 1,
      })
    }
  }

  createCollisionEffect(x: number, y: number): void {
    this.createExplosion(x, y, 15, '#FF4444', 1.5)
  }

  createPowerUpEffect(x: number, y: number): void {
    this.createExplosion(x, y, 25, '#FFD700', 1)
  }

  createJumpEffect(x: number, y: number): void {
    const count = 8
    for (let i = 0; i < count; i++) {
      this.addParticle({
        id: uuidv4(),
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * -3,
        life: 30,
        maxLife: 30,
        color: '#00D9FF',
        size: Math.random() * 3 + 2,
      })
    }
  }

  addParticle(particle: Particle): void {
    this.particles.set(particle.id, particle)
  }

  update(deltaTime: number = 16): void {
    const scaledDelta = deltaTime / 16 // Normalize to 60 FPS

    this.particles.forEach((particle, id) => {
      // Update position
      particle.x += particle.vx * scaledDelta
      particle.y += particle.vy * scaledDelta

      // Apply gravity
      particle.vy += 0.2 * scaledDelta

      // Decrease life
      particle.life -= scaledDelta

      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.delete(id)
      }
    })
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }

  clear(): void {
    this.particles.clear()
  }

  getParticleCount(): number {
    return this.particles.size
  }

  getParticles(): Particle[] {
    return Array.from(this.particles.values())
  }
}

export const particleSystem = new ParticleSystem()

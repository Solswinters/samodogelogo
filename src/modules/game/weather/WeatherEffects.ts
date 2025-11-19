/**
 * Visual weather effects for rendering
 */

interface WeatherParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export class WeatherEffects {
  private particles: WeatherParticle[]
  private maxParticles: number

  constructor(maxParticles = 100) {
    this.particles = []
    this.maxParticles = maxParticles
  }

  update(deltaTime: number, density: number, width: number, height: number): void {
    const targetParticles = Math.floor(this.maxParticles * density)

    // Add particles if needed
    while (this.particles.length < targetParticles) {
      this.particles.push(this.createParticle(width, height))
    }

    // Remove excess particles
    while (this.particles.length > targetParticles) {
      this.particles.pop()
    }

    // Update existing particles
    this.particles.forEach(particle => {
      particle.x += particle.vx * (deltaTime / 1000)
      particle.y += particle.vy * (deltaTime / 1000)

      // Wrap around
      if (particle.y > height) {
        particle.y = 0
        particle.x = Math.random() * width
      }
      if (particle.x > width) {
        particle.x = 0
      }
      if (particle.x < 0) {
        particle.x = width
      }
    })
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save()

    this.particles.forEach(particle => {
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }

  private createParticle(width: number, height: number): WeatherParticle {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 50,
      vy: Math.random() * 200 + 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }
  }

  clear(): void {
    this.particles = []
  }
}

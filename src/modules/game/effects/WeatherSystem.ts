/**
 * Weather System - Dynamic weather effects for the game
 */

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog' | 'storm'

export interface WeatherParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
}

export interface WeatherConfig {
  type: WeatherType
  intensity: number // 0-1
  windSpeed: number
  particleCount: number
}

export class WeatherSystem {
  private config: WeatherConfig
  private particles: WeatherParticle[] = []
  private canvasWidth: number
  private canvasHeight: number
  private enabled: boolean = true

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.config = {
      type: 'clear',
      intensity: 0,
      windSpeed: 0,
      particleCount: 0,
    }
  }

  /**
   * Set weather
   */
  setWeather(type: WeatherType, intensity: number = 0.5): void {
    this.config.type = type
    this.config.intensity = Math.max(0, Math.min(1, intensity))

    switch (type) {
      case 'clear':
        this.config.particleCount = 0
        this.config.windSpeed = 0
        break
      case 'rain':
        this.config.particleCount = Math.floor(100 * intensity)
        this.config.windSpeed = 2 * intensity
        break
      case 'snow':
        this.config.particleCount = Math.floor(50 * intensity)
        this.config.windSpeed = 1 * intensity
        break
      case 'fog':
        this.config.particleCount = 0
        this.config.windSpeed = 0
        break
      case 'storm':
        this.config.particleCount = Math.floor(200 * intensity)
        this.config.windSpeed = 5 * intensity
        break
    }

    this.initializeParticles()
  }

  /**
   * Initialize particles
   */
  private initializeParticles(): void {
    this.particles = []

    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.createParticle())
    }
  }

  /**
   * Create particle
   */
  private createParticle(): WeatherParticle {
    const particle: WeatherParticle = {
      x: Math.random() * this.canvasWidth,
      y: Math.random() * this.canvasHeight,
      vx: 0,
      vy: 0,
      size: 1,
      alpha: 1,
    }

    switch (this.config.type) {
      case 'rain':
        particle.vx = this.config.windSpeed
        particle.vy = 10 + Math.random() * 5
        particle.size = 1 + Math.random()
        particle.alpha = 0.5 + Math.random() * 0.5
        break
      case 'snow':
        particle.vx = this.config.windSpeed * (Math.random() - 0.5)
        particle.vy = 2 + Math.random() * 2
        particle.size = 2 + Math.random() * 3
        particle.alpha = 0.7 + Math.random() * 0.3
        break
      case 'storm':
        particle.vx = this.config.windSpeed + Math.random() * 2
        particle.vy = 15 + Math.random() * 10
        particle.size = 1 + Math.random() * 2
        particle.alpha = 0.3 + Math.random() * 0.5
        break
    }

    return particle
  }

  /**
   * Update weather
   */
  update(deltaTime: number): void {
    if (!this.enabled) return

    for (const particle of this.particles) {
      // Update position
      particle.x += particle.vx * deltaTime * 0.06
      particle.y += particle.vy * deltaTime * 0.06

      // Wrap around screen
      if (particle.y > this.canvasHeight) {
        particle.y = -10
        particle.x = Math.random() * this.canvasWidth
      }

      if (particle.x > this.canvasWidth) {
        particle.x = 0
      } else if (particle.x < 0) {
        particle.x = this.canvasWidth
      }
    }
  }

  /**
   * Render weather
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.enabled) return

    ctx.save()

    // Render fog
    if (this.config.type === 'fog') {
      const gradient = ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight)
      gradient.addColorStop(0, `rgba(200, 200, 200, ${0.3 * this.config.intensity})`)
      gradient.addColorStop(1, `rgba(150, 150, 150, ${0.2 * this.config.intensity})`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    }

    // Render particles
    for (const particle of this.particles) {
      ctx.globalAlpha = particle.alpha

      switch (this.config.type) {
        case 'rain':
          ctx.strokeStyle = '#ADD8E6'
          ctx.lineWidth = particle.size
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2)
          ctx.stroke()
          break

        case 'snow':
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case 'storm':
          ctx.strokeStyle = '#778899'
          ctx.lineWidth = particle.size
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3)
          ctx.stroke()
          break
      }
    }

    ctx.restore()
  }

  /**
   * Get weather type
   */
  getWeatherType(): WeatherType {
    return this.config.type
  }

  /**
   * Get intensity
   */
  getIntensity(): number {
    return this.config.intensity
  }

  /**
   * Set intensity
   */
  setIntensity(intensity: number): void {
    this.setWeather(this.config.type, intensity)
  }

  /**
   * Enable/disable weather
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
   * Set canvas size
   */
  setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width
    this.canvasHeight = height
  }

  /**
   * Clear weather
   */
  clear(): void {
    this.setWeather('clear', 0)
  }
}

export default WeatherSystem

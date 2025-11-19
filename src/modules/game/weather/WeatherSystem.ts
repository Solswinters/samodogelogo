/**
 * Weather system for dynamic environmental effects
 */

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog' | 'storm'

export interface WeatherConfig {
  type: WeatherType
  intensity: number // 0-1
  duration: number // milliseconds
  effects?: {
    visibility?: number
    speedModifier?: number
    particleDensity?: number
  }
}

export class WeatherSystem {
  private currentWeather: WeatherType
  private intensity: number
  private transitionProgress: number
  private isTransitioning: boolean
  private targetWeather: WeatherType | null
  private duration: number
  private elapsed: number

  constructor() {
    this.currentWeather = 'clear'
    this.intensity = 0
    this.transitionProgress = 0
    this.isTransitioning = false
    this.targetWeather = null
    this.duration = 0
    this.elapsed = 0
  }

  setWeather(config: WeatherConfig): void {
    if (config.type === this.currentWeather) {
      this.intensity = config.intensity
      return
    }

    this.targetWeather = config.type
    this.duration = config.duration
    this.elapsed = 0
    this.isTransitioning = true
    this.transitionProgress = 0
  }

  update(deltaTime: number): void {
    if (!this.isTransitioning || !this.targetWeather) {
      return
    }

    this.elapsed += deltaTime
    this.transitionProgress = Math.min(this.elapsed / this.duration, 1)

    if (this.transitionProgress >= 1) {
      this.currentWeather = this.targetWeather
      this.isTransitioning = false
      this.targetWeather = null
    }
  }

  getCurrentWeather(): WeatherType {
    return this.currentWeather
  }

  getIntensity(): number {
    return this.intensity
  }

  getTransitionProgress(): number {
    return this.transitionProgress
  }

  getVisibilityModifier(): number {
    switch (this.currentWeather) {
      case 'clear':
        return 1
      case 'rain':
        return 0.8
      case 'snow':
        return 0.7
      case 'fog':
        return 0.5
      case 'storm':
        return 0.6
      default:
        return 1
    }
  }

  getSpeedModifier(): number {
    switch (this.currentWeather) {
      case 'clear':
        return 1
      case 'rain':
        return 0.95
      case 'snow':
        return 0.85
      case 'fog':
        return 0.9
      case 'storm':
        return 0.8
      default:
        return 1
    }
  }

  getParticleDensity(): number {
    return this.intensity * (this.isTransitioning ? this.transitionProgress : 1)
  }
}

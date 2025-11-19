/**
 * Zone system for area-based game mechanics
 */

export interface ZoneConfig {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  properties?: Record<string, unknown>
}

export class Zone {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  properties: Record<string, unknown>

  constructor(config: ZoneConfig) {
    this.id = config.id
    this.name = config.name
    this.x = config.x
    this.y = config.y
    this.width = config.width
    this.height = config.height
    this.properties = config.properties ?? {}
  }

  contains(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height
  }

  intersects(x: number, y: number, width: number, height: number): boolean {
    return (
      x < this.x + this.width &&
      x + width > this.x &&
      y < this.y + this.height &&
      y + height > this.y
    )
  }

  getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
  }

  getProperty<T>(key: string): T | undefined {
    return this.properties[key] as T | undefined
  }

  setProperty<T>(key: string, value: T): void {
    this.properties[key] = value
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }
}

/**
 * Manager for game zones
 */

import { Zone, ZoneConfig } from './Zone'

export class ZoneManager {
  private zones: Map<string, Zone>

  constructor() {
    this.zones = new Map()
  }

  addZone(config: ZoneConfig): Zone {
    const zone = new Zone(config)
    this.zones.set(config.id, zone)
    return zone
  }

  removeZone(id: string): void {
    this.zones.delete(id)
  }

  getZone(id: string): Zone | undefined {
    return this.zones.get(id)
  }

  getAllZones(): Zone[] {
    return Array.from(this.zones.values())
  }

  getZonesAtPoint(x: number, y: number): Zone[] {
    return this.getAllZones().filter(zone => zone.contains(x, y))
  }

  getZonesIntersecting(x: number, y: number, width: number, height: number): Zone[] {
    return this.getAllZones().filter(zone => zone.intersects(x, y, width, height))
  }

  getZonesByProperty<T>(key: string, value: T): Zone[] {
    return this.getAllZones().filter(zone => zone.getProperty(key) === value)
  }

  clear(): void {
    this.zones.clear()
  }

  getStats() {
    return {
      totalZones: this.zones.size,
      zoneNames: this.getAllZones().map(z => z.name),
    }
  }
}

/**
 * Manager for multiple spawners
 */

import { Spawner, SpawnConfig } from './Spawner'

export class SpawnerManager<T> {
  private spawners: Map<string, Spawner<T>>

  constructor() {
    this.spawners = new Map()
  }

  addSpawner(config: SpawnConfig<T>): Spawner<T> {
    const spawner = new Spawner(config)
    this.spawners.set(config.id, spawner)
    return spawner
  }

  removeSpawner(id: string): void {
    this.spawners.delete(id)
  }

  getSpawner(id: string): Spawner<T> | undefined {
    return this.spawners.get(id)
  }

  update(deltaTime: number): T[] {
    const allSpawned: T[] = []

    for (const spawner of this.spawners.values()) {
      const spawned = spawner.update(deltaTime)
      allSpawned.push(...spawned)
    }

    return allSpawned
  }

  setAllEnabled(enabled: boolean): void {
    for (const spawner of this.spawners.values()) {
      spawner.setEnabled(enabled)
    }
  }

  reset(): void {
    for (const spawner of this.spawners.values()) {
      spawner.reset()
    }
  }

  clear(): void {
    this.spawners.clear()
  }

  getTotalActive(): number {
    return Array.from(this.spawners.values()).reduce(
      (sum, spawner) => sum + spawner.getActiveCount(),
      0
    )
  }

  getStats() {
    return {
      spawnerCount: this.spawners.size,
      totalActive: this.getTotalActive(),
      enabled: Array.from(this.spawners.values()).filter(s => s.enabled).length,
    }
  }
}

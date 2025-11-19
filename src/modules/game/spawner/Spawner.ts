/**
 * Entity spawner system
 */

export interface SpawnConfig<T> {
  id: string
  factory: () => T
  spawnRate: number // per second
  maxActive: number
  spawnArea: {
    x: number
    y: number
    width: number
    height: number
  }
  enabled?: boolean
}

export class Spawner<T> {
  id: string
  factory: () => T
  spawnRate: number
  maxActive: number
  spawnArea: {
    x: number
    y: number
    width: number
    height: number
  }
  enabled: boolean

  private timeSinceLastSpawn: number
  private spawnInterval: number
  private activeEntities: Set<T>

  constructor(config: SpawnConfig<T>) {
    this.id = config.id
    this.factory = config.factory
    this.spawnRate = config.spawnRate
    this.maxActive = config.maxActive
    this.spawnArea = config.spawnArea
    this.enabled = config.enabled ?? true

    this.timeSinceLastSpawn = 0
    this.spawnInterval = 1000 / this.spawnRate
    this.activeEntities = new Set()
  }

  update(deltaTime: number): T[] {
    if (!this.enabled) {
      return []
    }

    const spawned: T[] = []
    this.timeSinceLastSpawn += deltaTime

    while (
      this.timeSinceLastSpawn >= this.spawnInterval &&
      this.activeEntities.size < this.maxActive
    ) {
      const entity = this.factory()
      this.activeEntities.add(entity)
      spawned.push(entity)
      this.timeSinceLastSpawn -= this.spawnInterval
    }

    return spawned
  }

  removeEntity(entity: T): void {
    this.activeEntities.delete(entity)
  }

  getRandomPosition(): { x: number; y: number } {
    return {
      x: this.spawnArea.x + Math.random() * this.spawnArea.width,
      y: this.spawnArea.y + Math.random() * this.spawnArea.height,
    }
  }

  setSpawnRate(rate: number): void {
    this.spawnRate = rate
    this.spawnInterval = 1000 / rate
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  reset(): void {
    this.timeSinceLastSpawn = 0
    this.activeEntities.clear()
  }

  getActiveCount(): number {
    return this.activeEntities.size
  }

  canSpawn(): boolean {
    return this.enabled && this.activeEntities.size < this.maxActive
  }
}

/**
 * Object pool for efficient obstacle management
 */

import type { Obstacle, ObstaclePool } from './types'
import { obstacleFactory } from './factory'

export class ObstaclePoolManager {
  private pool: ObstaclePool
  private maxPoolSize: number

  constructor(maxPoolSize: number = 50) {
    this.maxPoolSize = maxPoolSize
    this.pool = {
      available: [],
      active: [],
    }
  }

  acquire(x: number, type?: Obstacle['type']): Obstacle {
    let obstacle: Obstacle

    if (this.pool.available.length > 0 && !type) {
      obstacle = this.pool.available.pop() as Obstacle
      obstacle.x = x
      obstacle.passed = false
    } else {
      obstacle = type ? this.createByType(x, type) : obstacleFactory.createRandom(x)
    }

    this.pool.active.push(obstacle)
    return obstacle
  }

  private createByType(x: number, type: Obstacle['type']): Obstacle {
    switch (type) {
      case 'static':
        return obstacleFactory.createStatic(x)
      case 'moving':
        return obstacleFactory.createMoving(x)
      case 'rotating':
        return obstacleFactory.createRotating(x)
      case 'spikes':
        return obstacleFactory.createSpikes(x)
      case 'laser':
        return obstacleFactory.createLaser(x)
      case 'breakable':
        return obstacleFactory.createBreakable(x)
    }
  }

  release(obstacle: Obstacle): void {
    const index = this.pool.active.indexOf(obstacle)
    if (index !== -1) {
      this.pool.active.splice(index, 1)

      if (this.pool.available.length < this.maxPoolSize) {
        this.pool.available.push(obstacle)
      }
    }
  }

  getActive(): Obstacle[] {
    return this.pool.active
  }

  clear(): void {
    this.pool.available.push(...this.pool.active)
    this.pool.active = []
  }

  reset(): void {
    this.pool = {
      available: [],
      active: [],
    }
  }

  getStats(): { active: number; available: number; total: number } {
    return {
      active: this.pool.active.length,
      available: this.pool.available.length,
      total: this.pool.active.length + this.pool.available.length,
    }
  }
}

/**
 * Procedural level generation
 */

import { obstacleFactory } from '../obstacles/factory'
import type { Obstacle } from '../obstacles/types'
import { randomInt } from '@/shared/math'

export interface LevelConfig {
  difficulty: number
  length: number
  obstacleFrequency: number
  minGap: number
  maxGap: number
}

export class LevelGenerator {
  generate(config: LevelConfig): Obstacle[] {
    const obstacles: Obstacle[] = []
    let currentX = 800

    while (currentX < config.length) {
      const gap = randomInt(config.minGap, config.maxGap)
      currentX += gap

      const obstacleType = this.selectObstacleType(config.difficulty)
      const obstacle = this.createObstacle(currentX, obstacleType)
      obstacles.push(obstacle)
    }

    return obstacles
  }

  private selectObstacleType(difficulty: number): Obstacle['type'] {
    const types: Obstacle['type'][] = ['static']

    if (difficulty >= 0.3) {
      types.push('moving', 'spikes')
    }

    if (difficulty >= 0.5) {
      types.push('rotating')
    }

    if (difficulty >= 0.7) {
      types.push('laser', 'breakable')
    }

    return types[randomInt(0, types.length - 1)] as Obstacle['type']
  }

  private createObstacle(x: number, type: Obstacle['type']): Obstacle {
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

  generateChunk(startX: number, difficulty: number, chunkLength: number = 2000): Obstacle[] {
    return this.generate({
      difficulty,
      length: chunkLength,
      obstacleFrequency: 1,
      minGap: 200 - difficulty * 100,
      maxGap: 400 - difficulty * 150,
    })
  }
}

export const levelGenerator = new LevelGenerator()

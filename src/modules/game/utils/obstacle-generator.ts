/**
 * Obstacle generation utilities
 */

import type { Obstacle } from '@/modules/game/domain/engine'
import { GAME_CONFIG } from '@/modules/game/domain/engine/config'

let obstacleIdCounter = 0

export function generateObstacleId(): string {
  obstacleIdCounter++
  return `obstacle-${Date.now()}-${obstacleIdCounter}`
}

export function createRandomObstacle(x: number): Obstacle {
  const minHeight = GAME_CONFIG.OBSTACLE_MIN_HEIGHT
  const maxHeight = GAME_CONFIG.OBSTACLE_MAX_HEIGHT
  const height = minHeight + Math.random() * (maxHeight - minHeight)

  return {
    id: generateObstacleId(),
    x,
    y: GAME_CONFIG.GROUND_Y + GAME_CONFIG.PLAYER_HEIGHT - height,
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    height,
  }
}

export function createObstaclePattern(
  startX: number,
  pattern: 'single' | 'double' | 'triple'
): Obstacle[] {
  const obstacles: Obstacle[] = []
  const spacing = 200

  switch (pattern) {
    case 'single':
      obstacles.push(createRandomObstacle(startX))
      break
    case 'double':
      obstacles.push(createRandomObstacle(startX))
      obstacles.push(createRandomObstacle(startX + spacing))
      break
    case 'triple':
      obstacles.push(createRandomObstacle(startX))
      obstacles.push(createRandomObstacle(startX + spacing))
      obstacles.push(createRandomObstacle(startX + spacing * 2))
      break
  }

  return obstacles
}

export function getRandomPattern(): 'single' | 'double' | 'triple' {
  const rand = Math.random()
  if (rand < 0.6) {
    return 'single'
  }
  if (rand < 0.9) {
    return 'double'
  }
  return 'triple'
}

export function shouldSpawnObstacle(
  lastObstacleX: number,
  canvasWidth: number,
  difficulty: number
): boolean {
  const baseDistance = GAME_CONFIG.OBSTACLE_SPAWN_DISTANCE
  const adjustedDistance = baseDistance / difficulty
  return canvasWidth - lastObstacleX > adjustedDistance
}

export function getMinimumGap(difficulty: number): number {
  const baseGap = 300
  return Math.max(200, baseGap - difficulty * 20)
}

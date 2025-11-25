/**
 * Obstacle generation utilities
 */

import type { Obstacle } from '@/modules/game/domain/engine'
import { GAME_CONFIG } from '@/modules/game/domain/engine/config'

let obstacleIdCounter = 0

/**
 * generateObstacleId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateObstacleId.
 */
export function generateObstacleId(): string {
  obstacleIdCounter++
  return `obstacle-${Date.now()}-${obstacleIdCounter}`
}

/**
 * createRandomObstacle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createRandomObstacle.
 */
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

/**
 * createObstaclePattern utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createObstaclePattern.
 */
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

/**
 * getRandomPattern utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getRandomPattern.
 */
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

/**
 * shouldSpawnObstacle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of shouldSpawnObstacle.
 */
export function shouldSpawnObstacle(
  lastObstacleX: number,
  canvasWidth: number,
  difficulty: number
): boolean {
  const baseDistance = GAME_CONFIG.OBSTACLE_SPAWN_DISTANCE
  const adjustedDistance = baseDistance / difficulty
  return canvasWidth - lastObstacleX > adjustedDistance
}

/**
 * getMinimumGap utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getMinimumGap.
 */
export function getMinimumGap(difficulty: number): number {
  const baseGap = 300
  return Math.max(200, baseGap - difficulty * 20)
}

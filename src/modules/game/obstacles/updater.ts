/**
 * Obstacle update logic
 */

import type { Obstacle, MovingObstacle, RotatingObstacle, LaserObstacle } from './types'

/**
 * updateObstacle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of updateObstacle.
 */
export function updateObstacle(obstacle: Obstacle, deltaTime: number): void {
  // Move all obstacles left
  obstacle.x -= obstacle.speed

  // Type-specific updates
  switch (obstacle.type) {
    case 'moving':
      updateMovingObstacle(obstacle, deltaTime)
      break
    case 'rotating':
      updateRotatingObstacle(obstacle, deltaTime)
      break
    case 'laser':
      updateLaserObstacle(obstacle, deltaTime)
      break
  }
}

function updateMovingObstacle(obstacle: MovingObstacle, deltaTime: number): void {
  const movement = Math.sin(Date.now() * 0.002) * obstacle.range
  obstacle.y = obstacle.originalY + movement
}

function updateRotatingObstacle(obstacle: RotatingObstacle, deltaTime: number): void {
  obstacle.angle += obstacle.rotationSpeed
  if (obstacle.angle > Math.PI * 2) {
    obstacle.angle -= Math.PI * 2
  }
}

function updateLaserObstacle(obstacle: LaserObstacle, deltaTime: number): void {
  obstacle.cycleTime += deltaTime

  if (obstacle.cycleTime >= obstacle.activeDuration * 2) {
    obstacle.cycleTime = 0
  }

  obstacle.active = obstacle.cycleTime < obstacle.activeDuration
}

/**
 * isObstacleOffscreen utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isObstacleOffscreen.
 */
export function isObstacleOffscreen(obstacle: Obstacle, canvasWidth: number): boolean {
  return obstacle.x + obstacle.width < 0
}

/**
 * sortObstaclesByDistance utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortObstaclesByDistance.
 */
export function sortObstaclesByDistance(obstacles: Obstacle[]): Obstacle[] {
  return [...obstacles].sort((a, b) => a.x - b.x)
}

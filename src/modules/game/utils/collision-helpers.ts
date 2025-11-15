/**
 * Collision detection helper functions
 */

import type { Player, Obstacle } from '@/modules/game/domain/engine'
import { GAME_CONFIG } from '@/modules/game/domain/engine/config'

export interface CollisionBox {
  x: number
  y: number
  width: number
  height: number
}

export function getPlayerBoundingBox(player: Player): CollisionBox {
  return {
    x: player.x,
    y: player.y,
    width: GAME_CONFIG.PLAYER_WIDTH,
    height: GAME_CONFIG.PLAYER_HEIGHT,
  }
}

export function getObstacleBoundingBox(obstacle: Obstacle): CollisionBox {
  return {
    x: obstacle.x,
    y: obstacle.y,
    width: obstacle.width,
    height: obstacle.height,
  }
}

export function checkBoxCollision(box1: CollisionBox, box2: CollisionBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  )
}

export function checkPlayerObstacleCollision(player: Player, obstacle: Obstacle): boolean {
  const playerBox = getPlayerBoundingBox(player)
  const obstacleBox = getObstacleBoundingBox(obstacle)
  return checkBoxCollision(playerBox, obstacleBox)
}

export function getCollisionSide(
  box1: CollisionBox,
  box2: CollisionBox
): 'top' | 'bottom' | 'left' | 'right' | null {
  if (!checkBoxCollision(box1, box2)) {
    return null
  }

  const overlapLeft = box1.x + box1.width - box2.x
  const overlapRight = box2.x + box2.width - box1.x
  const overlapTop = box1.y + box1.height - box2.y
  const overlapBottom = box2.y + box2.height - box1.y

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

  if (minOverlap === overlapLeft) {
    return 'left'
  }
  if (minOverlap === overlapRight) {
    return 'right'
  }
  if (minOverlap === overlapTop) {
    return 'top'
  }
  return 'bottom'
}

export function getCollisionDistance(box1: CollisionBox, box2: CollisionBox): number {
  const centerX1 = box1.x + box1.width / 2
  const centerY1 = box1.y + box1.height / 2
  const centerX2 = box2.x + box2.width / 2
  const centerY2 = box2.y + box2.height / 2

  const dx = centerX2 - centerX1
  const dy = centerY2 - centerY1

  return Math.sqrt(dx * dx + dy * dy)
}

export function willCollide(
  player: Player,
  obstacle: Obstacle,
  lookaheadFrames: number = 1
): boolean {
  // Predict future position
  const futureY = player.y + player.velocityY * lookaheadFrames
  const futurePlayer = {
    ...player,
    y: futureY,
  }

  return checkPlayerObstacleCollision(futurePlayer, obstacle)
}

import { GAME_CONFIG } from './config'
import { Player, Obstacle } from './types'

/**
 * checkCollision utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of checkCollision.
 */
export function checkCollision(player: Player, obstacle: Obstacle): boolean {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + GAME_CONFIG.PLAYER_WIDTH > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + GAME_CONFIG.PLAYER_HEIGHT > obstacle.y
  )
}

/**
 * checkCollisionWithObstacles utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of checkCollisionWithObstacles.
 */
export function checkCollisionWithObstacles(player: Player, obstacles: Obstacle[]): boolean {
  return obstacles.some((obstacle) => checkCollision(player, obstacle))
}

/**
 * isPlayerOnGround utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isPlayerOnGround.
 */
export function isPlayerOnGround(player: Player): boolean {
  return player.y + GAME_CONFIG.PLAYER_HEIGHT >= GAME_CONFIG.GROUND_Y
}

/**
 * hasObstacleCleared utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of hasObstacleCleared.
 */
export function hasObstacleCleared(obstacle: Obstacle, playerX: number): boolean {
  return obstacle.x + obstacle.width < playerX
}

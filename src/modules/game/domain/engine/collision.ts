import { Player, Obstacle } from './types'
import { GAME_CONFIG } from './config'

export function checkCollision(player: Player, obstacle: Obstacle): boolean {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + GAME_CONFIG.PLAYER_WIDTH > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + GAME_CONFIG.PLAYER_HEIGHT > obstacle.y
  )
}

export function checkCollisionWithObstacles(
  player: Player,
  obstacles: Obstacle[]
): boolean {
  return obstacles.some(obstacle => checkCollision(player, obstacle))
}

export function isPlayerOnGround(player: Player): boolean {
  return player.y + GAME_CONFIG.PLAYER_HEIGHT >= GAME_CONFIG.GROUND_Y
}

export function hasObstacleCleared(
  obstacle: Obstacle,
  playerX: number
): boolean {
  return obstacle.x + obstacle.width < playerX
}


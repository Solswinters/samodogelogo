import { Player, Obstacle } from './types'
import { GAME_CONFIG, PLAYER_COLORS } from './config'

/**
 * createPlayer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createPlayer.
 */
export function createPlayer(id: string, colorIndex: number): Player {
  return {
    id,
    x: GAME_CONFIG.PLAYER_START_X,
    y: GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT,
    velocityY: 0,
    isJumping: false,
    isGrounded: true,
    score: 0,
    isAlive: true,
    color: PLAYER_COLORS[colorIndex % PLAYER_COLORS.length],
  }
}

/**
 * createObstacle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createObstacle.
 */
export function createObstacle(x: number): Obstacle {
  const height =
    Math.random() * (GAME_CONFIG.OBSTACLE_MAX_HEIGHT - GAME_CONFIG.OBSTACLE_MIN_HEIGHT) +
    GAME_CONFIG.OBSTACLE_MIN_HEIGHT

  return {
    id: `obstacle-${Date.now()}-${Math.random()}`,
    x,
    y: GAME_CONFIG.GROUND_Y - height,
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    height,
  }
}

/**
 * jump utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of jump.
 */
export function jump(player: Player): Player {
  if (player.isGrounded && !player.isJumping) {
    return {
      ...player,
      velocityY: GAME_CONFIG.JUMP_FORCE,
      isJumping: true,
      isGrounded: false,
    }
  }
  return player
}


import { GAME_CONFIG } from './config'
import { Player } from './types'

export function updatePlayerPhysics(player: Player): Player {
  if (!player.isAlive) return player

  let newY = player.y + player.velocityY
  let newVelocityY = player.velocityY + GAME_CONFIG.GRAVITY
  let newIsGrounded = false
  let newIsJumping = player.isJumping

  // Check ground collision (player's bottom should touch ground)
  if (newY + GAME_CONFIG.PLAYER_HEIGHT >= GAME_CONFIG.GROUND_Y) {
    newY = GAME_CONFIG.GROUND_Y - GAME_CONFIG.PLAYER_HEIGHT
    newVelocityY = 0
    newIsGrounded = true
    newIsJumping = false
  }

  return {
    ...player,
    y: newY,
    velocityY: newVelocityY,
    isGrounded: newIsGrounded,
    isJumping: newIsJumping,
  }
}

export function applyGravity(velocityY: number): number {
  return velocityY + GAME_CONFIG.GRAVITY
}

export function calculateJumpVelocity(): number {
  return GAME_CONFIG.JUMP_FORCE
}

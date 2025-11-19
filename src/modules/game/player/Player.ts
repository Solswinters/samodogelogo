/**
 * Player entity with state and abilities
 */

import { PHYSICS, PLAYER, CANVAS } from '../constants'
import type { Position, Velocity } from '../utils/physics'

export interface PlayerState {
  position: Position
  velocity: Velocity
  isGrounded: boolean
  isAlive: boolean
  canDoubleJump: boolean
  hasDoubleJumped: boolean
  isInvincible: boolean
  size: number
}

export class Player {
  private state: PlayerState

  constructor() {
    this.state = {
      position: { x: PLAYER.START_X, y: CANVAS.GROUND_Y - PLAYER.SIZE },
      velocity: { x: 0, y: 0 },
      isGrounded: false,
      isAlive: true,
      canDoubleJump: false,
      hasDoubleJumped: false,
      isInvincible: false,
      size: PLAYER.SIZE,
    }
  }

  update(deltaTime: number): void {
    if (!this.state.isAlive) {
      return
    }

    // Apply gravity
    this.state.velocity.y += PHYSICS.GRAVITY
    this.state.velocity.y = Math.min(this.state.velocity.y, PHYSICS.TERMINAL_VELOCITY)

    // Update position
    this.state.position.y += this.state.velocity.y

    // Ground collision
    const groundY = CANVAS.GROUND_Y - this.state.size
    if (this.state.position.y >= groundY) {
      this.state.position.y = groundY
      this.state.velocity.y = 0
      this.state.isGrounded = true
      this.state.hasDoubleJumped = false
    } else {
      this.state.isGrounded = false
    }
  }

  jump(): boolean {
    if (this.state.isGrounded) {
      this.state.velocity.y = -PHYSICS.JUMP_POWER
      this.state.isGrounded = false
      return true
    } else if (this.state.canDoubleJump && !this.state.hasDoubleJumped) {
      this.state.velocity.y = -PHYSICS.DOUBLE_JUMP_POWER
      this.state.hasDoubleJumped = true
      return true
    }
    return false
  }

  die(): void {
    if (!this.state.isInvincible) {
      this.state.isAlive = false
    }
  }

  reset(): void {
    this.state = {
      position: { x: PLAYER.START_X, y: CANVAS.GROUND_Y - PLAYER.SIZE },
      velocity: { x: 0, y: 0 },
      isGrounded: false,
      isAlive: true,
      canDoubleJump: false,
      hasDoubleJumped: false,
      isInvincible: false,
      size: PLAYER.SIZE,
    }
  }

  getState(): PlayerState {
    return { ...this.state }
  }

  getPosition(): Position {
    return { ...this.state.position }
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.state.position.x,
      y: this.state.position.y,
      width: this.state.size,
      height: this.state.size,
    }
  }

  setInvincible(invincible: boolean): void {
    this.state.isInvincible = invincible
  }

  setDoubleJump(enabled: boolean): void {
    this.state.canDoubleJump = enabled
  }

  isAlive(): boolean {
    return this.state.isAlive
  }
}

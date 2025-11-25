/**
 * Game physics utilities
 */

import { PHYSICS } from '../constants'

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  x: number
  y: number
}

/**
 * applyGravity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of applyGravity.
 */
export function applyGravity(velocity: Velocity): Velocity {
  return {
    x: velocity.x,
    y: Math.min(velocity.y + PHYSICS.GRAVITY, PHYSICS.TERMINAL_VELOCITY),
  }
}

/**
 * applyJump utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of applyJump.
 */
export function applyJump(velocity: Velocity, power: number = PHYSICS.JUMP_POWER): Velocity {
  return {
    x: velocity.x,
    y: -power,
  }
}

/**
 * updatePosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of updatePosition.
 */
export function updatePosition(position: Position, velocity: Velocity): Position {
  return {
    x: position.x + velocity.x,
    y: position.y + velocity.y,
  }
}

/**
 * clampToGround utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of clampToGround.
 */
export function clampToGround(position: Position, groundY: number): Position {
  return {
    x: position.x,
    y: Math.min(position.y, groundY),
  }
}

/**
 * isOnGround utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isOnGround.
 */
export function isOnGround(position: Position, groundY: number): boolean {
  return position.y >= groundY
}

/**
 * checkCollision utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of checkCollision.
 */
export function checkCollision(
  pos1: Position,
  size1: { width: number; height: number },
  pos2: Position,
  size2: { width: number; height: number }
): boolean {
  return (
    pos1.x < pos2.x + size2.width &&
    pos1.x + size1.width > pos2.x &&
    pos1.y < pos2.y + size2.height &&
    pos1.y + size1.height > pos2.y
  )
}

/**
 * calculateDistance utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateDistance.
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  return Math.sqrt(dx * dx + dy * dy)
}

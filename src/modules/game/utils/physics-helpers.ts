/**
 * Physics calculation helpers for game
 */

import { GAME_CONFIG } from '@/modules/game/domain/engine/config'

/**
 * calculateJumpHeight utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateJumpHeight.
 */
export function calculateJumpHeight(jumpForce: number, gravity: number): number {
  // Using kinematic equation: h = v²/(2*g)
  return (jumpForce * jumpForce) / (2 * gravity)
}

/**
 * calculateJumpDuration utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateJumpDuration.
 */
export function calculateJumpDuration(jumpForce: number, gravity: number): number {
  // Using kinematic equation: t = 2v/g
  return (2 * Math.abs(jumpForce)) / gravity
}

/**
 * calculateLandingVelocity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateLandingVelocity.
 */
export function calculateLandingVelocity(height: number, gravity: number): number {
  // Using kinematic equation: v = √(2*g*h)
  return Math.sqrt(2 * gravity * height)
}

/**
 * isOnGround utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isOnGround.
 */
export function isOnGround(y: number, groundY: number = GAME_CONFIG.GROUND_Y): boolean {
  return y >= groundY
}

/**
 * clampVelocity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of clampVelocity.
 */
export function clampVelocity(velocity: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, velocity))
}

/**
 * applyGravity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of applyGravity.
 */
export function applyGravity(
  currentVelocityY: number,
  gravity: number = GAME_CONFIG.GRAVITY
): number {
  return currentVelocityY + gravity
}

/**
 * calculateNextPosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateNextPosition.
 */
export function calculateNextPosition(
  currentY: number,
  velocityY: number,
  groundY: number = GAME_CONFIG.GROUND_Y
): number {
  const nextY = currentY + velocityY
  return Math.min(nextY, groundY)
}

export interface CollisionBox {
  x: number
  y: number
  width: number
  height: number
}

/**
 * checkRectCollision utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of checkRectCollision.
 */
export function checkRectCollision(box1: CollisionBox, box2: CollisionBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  )
}

/**
 * getOverlapAmount utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getOverlapAmount.
 */
export function getOverlapAmount(
  box1: CollisionBox,
  box2: CollisionBox
): {
  x: number
  y: number
} {
  const overlapX = Math.min(box1.x + box1.width - box2.x, box2.x + box2.width - box1.x)

  const overlapY = Math.min(box1.y + box1.height - box2.y, box2.y + box2.height - box1.y)

  return { x: overlapX, y: overlapY }
}

/**
 * calculateImpactForce utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateImpactForce.
 */
export function calculateImpactForce(velocity: number, mass: number = 1): number {
  return Math.abs(velocity * mass)
}

/**
 * interpolatePosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of interpolatePosition.
 */
export function interpolatePosition(start: number, end: number, alpha: number): number {
  return start + (end - start) * alpha
}

/**
 * predictFuturePosition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of predictFuturePosition.
 */
export function predictFuturePosition(
  currentY: number,
  velocityY: number,
  stepsAhead: number
): number {
  let y = currentY
  let vy = velocityY

  for (let i = 0; i < stepsAhead; i++) {
    vy = applyGravity(vy)
    y = y + vy
  }

  return y
}

/**
 * Axis-Aligned Bounding Box (AABB) collision detection
 */

export interface AABB {
  x: number
  y: number
  width: number
  height: number
}

/**
 * checkAABBCollision utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of checkAABBCollision.
 */
export function checkAABBCollision(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

/**
 * getAABBOverlap utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getAABBOverlap.
 */
export function getAABBOverlap(a: AABB, b: AABB): { x: number; y: number } | null {
  if (!checkAABBCollision(a, b)) {
    return null
  }

  const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)

  return { x: overlapX, y: overlapY }
}

/**
 * getAABBCenter utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getAABBCenter.
 */
export function getAABBCenter(aabb: AABB): { x: number; y: number } {
  return {
    x: aabb.x + aabb.width / 2,
    y: aabb.y + aabb.height / 2,
  }
}

/**
 * expandAABB utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of expandAABB.
 */
export function expandAABB(aabb: AABB, amount: number): AABB {
  return {
    x: aabb.x - amount,
    y: aabb.y - amount,
    width: aabb.width + amount * 2,
    height: aabb.height + amount * 2,
  }
}

/**
 * aabbContainsPoint utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of aabbContainsPoint.
 */
export function aabbContainsPoint(aabb: AABB, x: number, y: number): boolean {
  return x >= aabb.x && x <= aabb.x + aabb.width && y >= aabb.y && y <= aabb.y + aabb.height
}

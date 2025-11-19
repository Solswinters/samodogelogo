/**
 * Axis-Aligned Bounding Box (AABB) collision detection
 */

export interface AABB {
  x: number
  y: number
  width: number
  height: number
}

export function checkAABBCollision(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

export function getAABBOverlap(a: AABB, b: AABB): { x: number; y: number } | null {
  if (!checkAABBCollision(a, b)) {
    return null
  }

  const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)

  return { x: overlapX, y: overlapY }
}

export function getAABBCenter(aabb: AABB): { x: number; y: number } {
  return {
    x: aabb.x + aabb.width / 2,
    y: aabb.y + aabb.height / 2,
  }
}

export function expandAABB(aabb: AABB, amount: number): AABB {
  return {
    x: aabb.x - amount,
    y: aabb.y - amount,
    width: aabb.width + amount * 2,
    height: aabb.height + amount * 2,
  }
}

export function aabbContainsPoint(aabb: AABB, x: number, y: number): boolean {
  return x >= aabb.x && x <= aabb.x + aabb.width && y >= aabb.y && y <= aabb.y + aabb.height
}

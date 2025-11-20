/**
 * Comprehensive collision detection system
 */

import { AABB, checkAABBCollision, getAABBOverlap, aabbContainsPoint } from './aabb'
import { checkSATCollision, Polygon, Vector2D } from './sat'

export interface Circle {
  x: number
  y: number
  radius: number
}

export interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface CollisionResult {
  colliding: boolean
  penetration?: number
  normal?: Vector2D
  contactPoint?: Vector2D
}

export class CollisionDetector {
  /**
   * Check circle-circle collision
   */
  static checkCircleCollision(a: Circle, b: Circle): boolean {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < a.radius + b.radius
  }

  /**
   * Check circle-circle collision with detailed result
   */
  static getCircleCollisionResult(a: Circle, b: Circle): CollisionResult {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const minDistance = a.radius + b.radius

    if (distance >= minDistance) {
      return { colliding: false }
    }

    const penetration = minDistance - distance
    const normal = {
      x: dx / distance,
      y: dy / distance,
    }

    const contactPoint = {
      x: a.x + normal.x * a.radius,
      y: a.y + normal.y * a.radius,
    }

    return {
      colliding: true,
      penetration,
      normal,
      contactPoint,
    }
  }

  /**
   * Check circle-AABB collision
   */
  static checkCircleAABBCollision(circle: Circle, box: AABB): boolean {
    // Find closest point on box to circle center
    const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width))
    const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height))

    const dx = circle.x - closestX
    const dy = circle.y - closestY
    const distance = Math.sqrt(dx * dx + dy * dy)

    return distance < circle.radius
  }

  /**
   * Check circle-AABB collision with detailed result
   */
  static getCircleAABBCollisionResult(circle: Circle, box: AABB): CollisionResult {
    const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width))
    const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height))

    const dx = circle.x - closestX
    const dy = circle.y - closestY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance >= circle.radius) {
      return { colliding: false }
    }

    const penetration = circle.radius - distance
    const normal = distance > 0 ? { x: dx / distance, y: dy / distance } : { x: 0, y: -1 } // Handle circle center inside box

    const contactPoint = {
      x: closestX,
      y: closestY,
    }

    return {
      colliding: true,
      penetration,
      normal,
      contactPoint,
    }
  }

  /**
   * Check line-circle collision
   */
  static checkLineCircleCollision(line: Line, circle: Circle): boolean {
    // Vector from line start to circle center
    const dx = circle.x - line.x1
    const dy = circle.y - line.y1

    // Line direction vector
    const ldx = line.x2 - line.x1
    const ldy = line.y2 - line.y1

    // Project circle center onto line
    const lineLength = Math.sqrt(ldx * ldx + ldy * ldy)
    const t = Math.max(0, Math.min(1, (dx * ldx + dy * ldy) / (lineLength * lineLength)))

    // Closest point on line to circle
    const closestX = line.x1 + t * ldx
    const closestY = line.y1 + t * ldy

    // Distance from circle to closest point
    const distX = circle.x - closestX
    const distY = circle.y - closestY
    const distance = Math.sqrt(distX * distX + distY * distY)

    return distance <= circle.radius
  }

  /**
   * Check line-AABB collision
   */
  static checkLineAABBCollision(line: Line, box: AABB): boolean {
    // Check if either endpoint is inside the box
    if (aabbContainsPoint(box, line.x1, line.y1) || aabbContainsPoint(box, line.x2, line.y2)) {
      return true
    }

    // Check intersection with box edges
    const left = box.x
    const right = box.x + box.width
    const top = box.y
    const bottom = box.y + box.height

    // Check each edge
    return (
      this.checkLineLineCollision(line, { x1: left, y1: top, x2: right, y2: top }) ||
      this.checkLineLineCollision(line, { x1: right, y1: top, x2: right, y2: bottom }) ||
      this.checkLineLineCollision(line, { x1: left, y1: bottom, x2: right, y2: bottom }) ||
      this.checkLineLineCollision(line, { x1: left, y1: top, x2: left, y2: bottom })
    )
  }

  /**
   * Check line-line collision
   */
  static checkLineLineCollision(a: Line, b: Line): boolean {
    const d = (a.x1 - a.x2) * (b.y1 - b.y2) - (a.y1 - a.y2) * (b.x1 - b.x2)

    if (Math.abs(d) < 0.0001) {
      return false // Lines are parallel
    }

    const t = ((a.x1 - b.x1) * (b.y1 - b.y2) - (a.y1 - b.y1) * (b.x1 - b.x2)) / d
    const u = -((a.x1 - a.x2) * (a.y1 - b.y1) - (a.y1 - a.y2) * (a.x1 - b.x1)) / d

    return t >= 0 && t <= 1 && u >= 0 && u <= 1
  }

  /**
   * Check point-circle collision
   */
  static checkPointCircleCollision(x: number, y: number, circle: Circle): boolean {
    const dx = x - circle.x
    const dy = y - circle.y
    return Math.sqrt(dx * dx + dy * dy) <= circle.radius
  }

  /**
   * Check point-polygon collision (ray casting)
   */
  static checkPointPolygonCollision(x: number, y: number, polygon: Polygon): boolean {
    let inside = false
    const vertices = polygon.vertices

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i]!.x
      const yi = vertices[i]!.y
      const xj = vertices[j]!.x
      const yj = vertices[j]!.y

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

      if (intersect) {
        inside = !inside
      }
    }

    return inside
  }

  /**
   * Get closest point on AABB to a point
   */
  static getClosestPointOnAABB(x: number, y: number, box: AABB): Vector2D {
    return {
      x: Math.max(box.x, Math.min(x, box.x + box.width)),
      y: Math.max(box.y, Math.min(y, box.y + box.height)),
    }
  }

  /**
   * Get distance between two points
   */
  static getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Get distance squared (faster when you don't need exact distance)
   */
  static getDistanceSquared(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1
    const dy = y2 - y1
    return dx * dx + dy * dy
  }

  /**
   * Check if AABB intersects with circle
   */
  static checkAABBCircleIntersection(box: AABB, circle: Circle): boolean {
    return this.checkCircleAABBCollision(circle, box)
  }

  /**
   * Sweep test for moving AABB against static AABB
   */
  static sweepAABB(
    moving: AABB,
    velocity: Vector2D,
    static_: AABB
  ): { time: number; normal: Vector2D } | null {
    // Minkowski difference
    const expanded = {
      x: static_.x - moving.width,
      y: static_.y - moving.height,
      width: static_.width + moving.width,
      height: static_.height + moving.height,
    }

    // Ray vs AABB
    let tmin = -Infinity
    let tmax = Infinity
    let normalX = 0
    let normalY = 0

    // X axis
    if (Math.abs(velocity.x) > 0.0001) {
      const t1 = (expanded.x - moving.x) / velocity.x
      const t2 = (expanded.x + expanded.width - moving.x) / velocity.x

      if (t1 > t2) {
        const temp = t1
        tmin = t2
        tmax = temp
        normalX = 1
      } else {
        tmin = t1
        tmax = t2
        normalX = -1
      }

      if (tmin > tmax) {
        return null
      }
    } else if (moving.x < expanded.x || moving.x > expanded.x + expanded.width) {
      return null
    }

    // Y axis
    if (Math.abs(velocity.y) > 0.0001) {
      const t1 = (expanded.y - moving.y) / velocity.y
      const t2 = (expanded.y + expanded.height - moving.y) / velocity.y

      if (t1 > t2) {
        const temp = t1
        const tempMin = t2
        const tempMax = temp

        if (tempMin > tmin) {
          tmin = tempMin
          normalX = 0
          normalY = 1
        }
        if (tempMax < tmax) {
          tmax = tempMax
        }
      } else {
        if (t1 > tmin) {
          tmin = t1
          normalX = 0
          normalY = -1
        }
        if (t2 < tmax) {
          tmax = t2
        }
      }

      if (tmin > tmax) {
        return null
      }
    } else if (moving.y < expanded.y || moving.y > expanded.y + expanded.height) {
      return null
    }

    if (tmin >= 0 && tmin <= 1) {
      return {
        time: tmin,
        normal: { x: normalX, y: normalY },
      }
    }

    return null
  }

  /**
   * Export collision detection functions
   */
  static checkAABB = checkAABBCollision
  static getAABBOverlap = getAABBOverlap
  static checkSAT = checkSATCollision
  static checkPointInAABB = aabbContainsPoint
}

/**
 * Game-specific mathematical utility functions
 * Optimized for game development use cases
 */

import { Vector2 } from '../types/game-types'

export class GameMathUtils {
  /**
   * Linear interpolation between two values
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t
  }

  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * Map a value from one range to another
   */
  static mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  /**
   * Calculate distance between two 2D points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Calculate distance between two vectors
   */
  static distanceVector(v1: Vector2, v2: Vector2): number {
    return this.distance(v1.x, v1.y, v2.x, v2.y)
  }

  /**
   * Calculate angle between two points in radians
   */
  static angleBetween(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1)
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians: number): number {
    return radians * (180 / Math.PI)
  }

  /**
   * Normalize an angle to be between -PI and PI
   */
  static normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= 2 * Math.PI
    while (angle < -Math.PI) angle += 2 * Math.PI
    return angle
  }

  /**
   * Calculate shortest angular distance between two angles
   */
  static angleDistance(a1: number, a2: number): number {
    const diff = a2 - a1
    return this.normalizeAngle(diff)
  }

  /**
   * Check if a point is within a rectangle
   */
  static pointInRect(
    px: number,
    py: number,
    rx: number,
    ry: number,
    rw: number,
    rh: number
  ): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
  }

  /**
   * Check if two rectangles intersect (AABB collision)
   */
  static rectIntersect(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
  }

  /**
   * Check if a point is within a circle
   */
  static pointInCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
    const dist = this.distance(px, py, cx, cy)
    return dist <= radius
  }

  /**
   * Check if two circles intersect
   */
  static circleIntersect(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ): boolean {
    const dist = this.distance(x1, y1, x2, y2)
    return dist <= r1 + r2
  }

  /**
   * Generate a random integer between min (inclusive) and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Generate a random float between min and max
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * Random boolean with optional probability
   */
  static randomBool(probability: number = 0.5): boolean {
    return Math.random() < probability
  }

  /**
   * Pick a random element from an array
   */
  static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Shuffle an array (Fisher-Yates algorithm)
   */
  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Calculate the dot product of two 2D vectors
   */
  static dot(v1: Vector2, v2: Vector2): number {
    return v1.x * v2.x + v1.y * v2.y
  }

  /**
   * Calculate the magnitude (length) of a 2D vector
   */
  static magnitude(v: Vector2): number {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  /**
   * Normalize a 2D vector
   */
  static normalize(v: Vector2): Vector2 {
    const mag = this.magnitude(v)
    if (mag === 0) return { x: 0, y: 0 }
    return { x: v.x / mag, y: v.y / mag }
  }

  /**
   * Scale a 2D vector by a scalar
   */
  static scale(v: Vector2, scalar: number): Vector2 {
    return { x: v.x * scalar, y: v.y * scalar }
  }

  /**
   * Add two 2D vectors
   */
  static add(v1: Vector2, v2: Vector2): Vector2 {
    return { x: v1.x + v2.x, y: v1.y + v2.y }
  }

  /**
   * Subtract two 2D vectors
   */
  static subtract(v1: Vector2, v2: Vector2): Vector2 {
    return { x: v1.x - v2.x, y: v1.y - v2.y }
  }

  /**
   * Rotate a 2D vector by an angle (in radians)
   */
  static rotate(v: Vector2, angle: number): Vector2 {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
    }
  }

  /**
   * Calculate the perpendicular vector (rotate by 90 degrees)
   */
  static perpendicular(v: Vector2): Vector2 {
    return { x: -v.y, y: v.x }
  }

  /**
   * Smooth step interpolation (ease in/out)
   */
  static smoothStep(t: number): number {
    return t * t * (3 - 2 * t)
  }

  /**
   * Smoother step interpolation (more gradual ease)
   */
  static smootherStep(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  /**
   * Ease in (quadratic)
   */
  static easeInQuad(t: number): number {
    return t * t
  }

  /**
   * Ease out (quadratic)
   */
  static easeOutQuad(t: number): number {
    return t * (2 - t)
  }

  /**
   * Ease in-out (quadratic)
   */
  static easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  /**
   * Bounce easing function
   */
  static bounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      const t2 = t - 1.5 / 2.75
      return 7.5625 * t2 * t2 + 0.75
    } else if (t < 2.5 / 2.75) {
      const t2 = t - 2.25 / 2.75
      return 7.5625 * t2 * t2 + 0.9375
    } else {
      const t2 = t - 2.625 / 2.75
      return 7.5625 * t2 * t2 + 0.984375
    }
  }

  /**
   * Elastic easing function
   */
  static elastic(t: number): number {
    return Math.sin(-13 * (Math.PI / 2) * (t + 1)) * Math.pow(2, -10 * t) + 1
  }

  /**
   * Check if a number is approximately equal to another (with epsilon)
   */
  static approximately(a: number, b: number, epsilon: number = 0.0001): boolean {
    return Math.abs(a - b) < epsilon
  }

  /**
   * Round to a specific number of decimal places
   */
  static roundTo(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
  }

  /**
   * Calculate percentage
   */
  static percentage(value: number, total: number): number {
    if (total === 0) return 0
    return (value / total) * 100
  }

  /**
   * Calculate what percentage 'value' is of 'total', clamped to 0-100
   */
  static percentageClamped(value: number, total: number): number {
    return this.clamp(this.percentage(value, total), 0, 100)
  }

  /**
   * Sign function (returns -1, 0, or 1)
   */
  static sign(value: number): number {
    if (value > 0) return 1
    if (value < 0) return -1
    return 0
  }

  /**
   * Calculate the area of overlap between two rectangles
   */
  static overlapArea(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): number {
    const xOverlap = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2))
    const yOverlap = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2))
    return xOverlap * yOverlap
  }

  /**
   * Calculate the centroid of a set of points
   */
  static centroid(points: Vector2[]): Vector2 {
    if (points.length === 0) return { x: 0, y: 0 }

    const sum = points.reduce(
      (acc, p) => ({
        x: acc.x + p.x,
        y: acc.y + p.y,
      }),
      { x: 0, y: 0 }
    )

    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    }
  }

  /**
   * Project a vector onto another vector
   */
  static project(v: Vector2, onto: Vector2): Vector2 {
    const d = this.dot(v, onto)
    const lenSq = onto.x * onto.x + onto.y * onto.y
    if (lenSq === 0) return { x: 0, y: 0 }
    const scalar = d / lenSq
    return this.scale(onto, scalar)
  }

  /**
   * Reflect a vector off a normal
   */
  static reflect(v: Vector2, normal: Vector2): Vector2 {
    const d = this.dot(v, normal)
    return {
      x: v.x - 2 * d * normal.x,
      y: v.y - 2 * d * normal.y,
    }
  }

  /**
   * Calculate bezier curve point (cubic)
   */
  static bezierPoint(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t
    const tt = t * t
    const uu = u * u
    const uuu = uu * u
    const ttt = tt * t

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3
  }

  /**
   * Check if a value is a power of 2
   */
  static isPowerOfTwo(value: number): boolean {
    return value > 0 && (value & (value - 1)) === 0
  }

  /**
   * Get the next power of 2
   */
  static nextPowerOfTwo(value: number): number {
    if (value <= 0) return 1
    value--
    value |= value >> 1
    value |= value >> 2
    value |= value >> 4
    value |= value >> 8
    value |= value >> 16
    return value + 1
  }

  /**
   * Calculate moving average
   */
  static movingAverage(values: number[], windowSize: number): number[] {
    const result: number[] = []
    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - windowSize + 1)
      const window = values.slice(start, i + 1)
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length
      result.push(avg)
    }
    return result
  }
}

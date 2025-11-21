/**
 * Math utilities specifically for game calculations
 * Provides optimized math operations for game development
 */

export interface Vector2D {
  x: number
  y: number
}

export interface Vector3D extends Vector2D {
  z: number
}

export class GameMathUtils {
  /**
   * Linear interpolation
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t
  }

  /**
   * Clamp value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * Map value from one range to another
   */
  static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  /**
   * Smooth step interpolation
   */
  static smoothStep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
  }

  /**
   * Smoother step interpolation (quintic)
   */
  static smootherStep(edge0: number, edge1: number, x: number): number {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  /**
   * Ease in (quadratic)
   */
  static easeIn(t: number): number {
    return t * t
  }

  /**
   * Ease out (quadratic)
   */
  static easeOut(t: number): number {
    return t * (2 - t)
  }

  /**
   * Ease in-out (quadratic)
   */
  static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  /**
   * Elastic ease in
   */
  static easeInElastic(t: number): number {
    if (t === 0 || t === 1) return t
    const p = 0.3
    return -Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - p / 4) * (2 * Math.PI)) / p)
  }

  /**
   * Elastic ease out
   */
  static easeOutElastic(t: number): number {
    if (t === 0 || t === 1) return t
    const p = 0.3
    return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
  }

  /**
   * Bounce ease out
   */
  static easeOutBounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      t -= 1.5 / 2.75
      return 7.5625 * t * t + 0.75
    } else if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75
      return 7.5625 * t * t + 0.9375
    } else {
      t -= 2.625 / 2.75
      return 7.5625 * t * t + 0.984375
    }
  }

  /**
   * Distance between two 2D points
   */
  static distance2D(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  /**
   * Distance between two vectors
   */
  static distanceVector(v1: Vector2D, v2: Vector2D): number {
    return this.distance2D(v1.x, v1.y, v2.x, v2.y)
  }

  /**
   * Manhattan distance (grid-based)
   */
  static manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1)
  }

  /**
   * Angle between two points (in radians)
   */
  static angleBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1)
  }

  /**
   * Angle between two vectors (in radians)
   */
  static angleBetweenVectors(v1: Vector2D, v2: Vector2D): number {
    return Math.atan2(v2.y - v1.y, v2.x - v1.x)
  }

  /**
   * Normalize angle to 0-2π range
   */
  static normalizeAngle(angle: number): number {
    while (angle < 0) angle += Math.PI * 2
    while (angle >= Math.PI * 2) angle -= Math.PI * 2
    return angle
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians: number): number {
    return (radians * 180) / Math.PI
  }

  /**
   * Rotate point around origin
   */
  static rotatePoint(x: number, y: number, angle: number): Vector2D {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos,
    }
  }

  /**
   * Rotate point around center
   */
  static rotatePointAround(
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    angle: number
  ): Vector2D {
    const translatedX = x - centerX
    const translatedY = y - centerY
    const rotated = this.rotatePoint(translatedX, translatedY, angle)
    return {
      x: rotated.x + centerX,
      y: rotated.y + centerY,
    }
  }

  /**
   * Vector magnitude (length)
   */
  static vectorMagnitude(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  /**
   * Normalize vector
   */
  static normalizeVector(v: Vector2D): Vector2D {
    const mag = this.vectorMagnitude(v)
    return mag === 0 ? { x: 0, y: 0 } : { x: v.x / mag, y: v.y / mag }
  }

  /**
   * Dot product of two vectors
   */
  static dotProduct(v1: Vector2D, v2: Vector2D): number {
    return v1.x * v2.x + v1.y * v2.y
  }

  /**
   * Cross product magnitude (2D)
   */
  static crossProduct2D(v1: Vector2D, v2: Vector2D): number {
    return v1.x * v2.y - v1.y * v2.x
  }

  /**
   * Add vectors
   */
  static addVectors(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x + v2.x, y: v1.y + v2.y }
  }

  /**
   * Subtract vectors
   */
  static subtractVectors(v1: Vector2D, v2: Vector2D): Vector2D {
    return { x: v1.x - v2.x, y: v1.y - v2.y }
  }

  /**
   * Multiply vector by scalar
   */
  static multiplyVector(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar }
  }

  /**
   * Divide vector by scalar
   */
  static divideVector(v: Vector2D, scalar: number): Vector2D {
    return scalar === 0 ? { x: 0, y: 0 } : { x: v.x / scalar, y: v.y / scalar }
  }

  /**
   * Lerp between two vectors
   */
  static lerpVector(v1: Vector2D, v2: Vector2D, t: number): Vector2D {
    return {
      x: this.lerp(v1.x, v2.x, t),
      y: this.lerp(v1.y, v2.y, t),
    }
  }

  /**
   * Project vector onto another
   */
  static projectVector(v: Vector2D, onto: Vector2D): Vector2D {
    const scalar = this.dotProduct(v, onto) / this.dotProduct(onto, onto)
    return this.multiplyVector(onto, scalar)
  }

  /**
   * Reflect vector across normal
   */
  static reflectVector(v: Vector2D, normal: Vector2D): Vector2D {
    const dot = this.dotProduct(v, normal)
    return {
      x: v.x - 2 * dot * normal.x,
      y: v.y - 2 * dot * normal.y,
    }
  }

  /**
   * Check if point is inside rectangle
   */
  static isPointInRect(
    x: number,
    y: number,
    rectX: number,
    rectY: number,
    width: number,
    height: number
  ): boolean {
    return x >= rectX && x <= rectX + width && y >= rectY && y <= rectY + height
  }

  /**
   * Check if point is inside circle
   */
  static isPointInCircle(
    x: number,
    y: number,
    circleX: number,
    circleY: number,
    radius: number
  ): boolean {
    return this.distance2D(x, y, circleX, circleY) <= radius
  }

  /**
   * Check if rectangles overlap
   */
  static rectsOverlap(
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
   * Check if circles overlap
   */
  static circlesOverlap(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ): boolean {
    return this.distance2D(x1, y1, x2, y2) <= r1 + r2
  }

  /**
   * Random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Random float between min and max
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * Random boolean
   */
  static randomBool(): boolean {
    return Math.random() < 0.5
  }

  /**
   * Random element from array
   */
  static randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Weighted random (returns index)
   */
  static weightedRandom(weights: number[]): number {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i]
      if (random <= 0) return i
    }

    return weights.length - 1
  }

  /**
   * Shuffle array (Fisher-Yates)
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
   * Perlin noise seed
   */
  private static perlinPermutation: number[] = []

  /**
   * Initialize Perlin noise
   */
  static initPerlin(): void {
    const p: number[] = []
    for (let i = 0; i < 256; i++) {
      p[i] = i
    }

    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[p[i], p[j]] = [p[j], p[i]]
    }

    // Duplicate
    this.perlinPermutation = [...p, ...p]
  }

  /**
   * Perlin noise fade function
   */
  private static fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  /**
   * Perlin noise gradient
   */
  private static grad(hash: number, x: number, y: number): number {
    const h = hash & 3
    const u = h < 2 ? x : y
    const v = h < 2 ? y : x
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  /**
   * 2D Perlin noise
   */
  static perlinNoise(x: number, y: number): number {
    if (this.perlinPermutation.length === 0) this.initPerlin()

    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255

    x -= Math.floor(x)
    y -= Math.floor(y)

    const u = this.fade(x)
    const v = this.fade(y)

    const p = this.perlinPermutation
    const A = p[X] + Y
    const AA = p[A]
    const AB = p[A + 1]
    const B = p[X + 1] + Y
    const BA = p[B]
    const BB = p[B + 1]

    return this.lerp(
      this.lerp(this.grad(p[AA], x, y), this.grad(p[BA], x - 1, y), u),
      this.lerp(this.grad(p[AB], x, y - 1), this.grad(p[BB], x - 1, y - 1), u),
      v
    )
  }

  /**
   * Snap to grid
   */
  static snapToGrid(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize
  }

  /**
   * Wrap value within range
   */
  static wrap(value: number, min: number, max: number): number {
    const range = max - min
    return ((((value - min) % range) + range) % range) + min
  }

  /**
   * Ping pong value between 0 and length
   */
  static pingPong(value: number, length: number): number {
    value = this.wrap(value, 0, length * 2)
    return value > length ? length * 2 - value : value
  }

  /**
   * Move towards target
   */
  static moveTowards(current: number, target: number, maxDelta: number): number {
    if (Math.abs(target - current) <= maxDelta) return target
    return current + Math.sign(target - current) * maxDelta
  }

  /**
   * Spring interpolation (damped harmonic motion)
   */
  static spring(
    current: number,
    target: number,
    velocity: number,
    stiffness: number = 100,
    damping: number = 10,
    deltaTime: number = 0.016
  ): { value: number; velocity: number } {
    const force = (target - current) * stiffness
    const dampingForce = velocity * damping
    const acceleration = force - dampingForce

    velocity += acceleration * deltaTime
    const value = current + velocity * deltaTime

    return { value, velocity }
  }
}

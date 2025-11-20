/**
 * Physics Engine - Advanced physics simulation for the game
 */

export interface Vector2D {
  x: number
  y: number
}

export interface PhysicsBody {
  id: string
  position: Vector2D
  velocity: Vector2D
  acceleration: Vector2D
  mass: number
  friction: number
  restitution: number // bounciness
  isStatic: boolean
  isKinematic: boolean
  angularVelocity: number
  rotation: number
  width: number
  height: number
  shape: 'rectangle' | 'circle'
  radius?: number
}

export interface PhysicsConstraint {
  bodyA: string
  bodyB: string
  type: 'distance' | 'spring' | 'hinge'
  distance?: number
  stiffness?: number
  damping?: number
}

export interface PhysicsConfig {
  gravity: Vector2D
  airResistance: number
  maxVelocity: number
  timeStep: number
  iterations: number
}

export class PhysicsEngine {
  private bodies: Map<string, PhysicsBody> = new Map()
  private constraints: PhysicsConstraint[] = []
  private config: PhysicsConfig
  private accumulator: number = 0

  constructor(config?: Partial<PhysicsConfig>) {
    this.config = {
      gravity: { x: 0, y: 980 }, // pixels per second squared
      airResistance: 0.01,
      maxVelocity: 2000,
      timeStep: 1 / 60, // 60 FPS
      iterations: 8,
      ...config,
    }
  }

  /**
   * Add a physics body
   */
  addBody(body: PhysicsBody): void {
    this.bodies.set(body.id, body)
  }

  /**
   * Remove a physics body
   */
  removeBody(id: string): void {
    this.bodies.delete(id)
  }

  /**
   * Get a physics body
   */
  getBody(id: string): PhysicsBody | undefined {
    return this.bodies.get(id)
  }

  /**
   * Get all bodies
   */
  getAllBodies(): PhysicsBody[] {
    return Array.from(this.bodies.values())
  }

  /**
   * Add a constraint
   */
  addConstraint(constraint: PhysicsConstraint): void {
    this.constraints.push(constraint)
  }

  /**
   * Remove constraints for a body
   */
  removeConstraints(bodyId: string): void {
    this.constraints = this.constraints.filter((c) => c.bodyA !== bodyId && c.bodyB !== bodyId)
  }

  /**
   * Update physics simulation
   */
  update(deltaTime: number): void {
    // Fixed timestep with accumulator
    this.accumulator += deltaTime

    while (this.accumulator >= this.config.timeStep) {
      this.step(this.config.timeStep)
      this.accumulator -= this.config.timeStep
    }
  }

  /**
   * Perform a single physics step
   */
  private step(dt: number): void {
    // Apply forces
    for (const body of this.bodies.values()) {
      if (body.isStatic) continue

      // Apply gravity
      if (!body.isKinematic) {
        this.applyForce(body, {
          x: this.config.gravity.x * body.mass,
          y: this.config.gravity.y * body.mass,
        })
      }

      // Apply air resistance
      const airResistance = this.scalarMultiply(
        body.velocity,
        -this.config.airResistance * body.mass
      )
      this.applyForce(body, airResistance)

      // Apply friction
      if (body.friction > 0) {
        const frictionForce = this.scalarMultiply(body.velocity, -body.friction)
        this.applyForce(body, frictionForce)
      }
    }

    // Integrate velocities
    for (const body of this.bodies.values()) {
      if (body.isStatic) continue

      // Update velocity
      body.velocity.x += body.acceleration.x * dt
      body.velocity.y += body.acceleration.y * dt

      // Clamp velocity
      const speed = this.magnitude(body.velocity)
      if (speed > this.config.maxVelocity) {
        const scale = this.config.maxVelocity / speed
        body.velocity.x *= scale
        body.velocity.y *= scale
      }

      // Update position
      body.position.x += body.velocity.x * dt
      body.position.y += body.velocity.y * dt

      // Update rotation
      body.rotation += body.angularVelocity * dt

      // Reset acceleration
      body.acceleration.x = 0
      body.acceleration.y = 0
    }

    // Solve constraints
    for (let i = 0; i < this.config.iterations; i++) {
      for (const constraint of this.constraints) {
        this.solveConstraint(constraint)
      }
    }
  }

  /**
   * Apply force to a body
   */
  applyForce(body: PhysicsBody, force: Vector2D): void {
    if (body.isStatic) return

    body.acceleration.x += force.x / body.mass
    body.acceleration.y += force.y / body.mass
  }

  /**
   * Apply impulse to a body
   */
  applyImpulse(body: PhysicsBody, impulse: Vector2D): void {
    if (body.isStatic) return

    body.velocity.x += impulse.x / body.mass
    body.velocity.y += impulse.y / body.mass
  }

  /**
   * Set body velocity
   */
  setVelocity(id: string, velocity: Vector2D): void {
    const body = this.bodies.get(id)
    if (body && !body.isStatic) {
      body.velocity = { ...velocity }
    }
  }

  /**
   * Set body position
   */
  setPosition(id: string, position: Vector2D): void {
    const body = this.bodies.get(id)
    if (body) {
      body.position = { ...position }
    }
  }

  /**
   * Solve a constraint
   */
  private solveConstraint(constraint: PhysicsConstraint): void {
    const bodyA = this.bodies.get(constraint.bodyA)
    const bodyB = this.bodies.get(constraint.bodyB)

    if (!bodyA || !bodyB) return

    switch (constraint.type) {
      case 'distance':
        this.solveDistanceConstraint(bodyA, bodyB, constraint)
        break
      case 'spring':
        this.solveSpringConstraint(bodyA, bodyB, constraint)
        break
      case 'hinge':
        this.solveHingeConstraint(bodyA, bodyB, constraint)
        break
    }
  }

  /**
   * Solve distance constraint
   */
  private solveDistanceConstraint(
    bodyA: PhysicsBody,
    bodyB: PhysicsBody,
    constraint: PhysicsConstraint
  ): void {
    const distance = constraint.distance || 100
    const delta = this.subtract(bodyB.position, bodyA.position)
    const currentDistance = this.magnitude(delta)

    if (currentDistance === 0) return

    const difference = (currentDistance - distance) / currentDistance
    const offset = this.scalarMultiply(delta, difference * 0.5)

    if (!bodyA.isStatic) {
      bodyA.position.x += offset.x
      bodyA.position.y += offset.y
    }

    if (!bodyB.isStatic) {
      bodyB.position.x -= offset.x
      bodyB.position.y -= offset.y
    }
  }

  /**
   * Solve spring constraint
   */
  private solveSpringConstraint(
    bodyA: PhysicsBody,
    bodyB: PhysicsBody,
    constraint: PhysicsConstraint
  ): void {
    const restLength = constraint.distance || 100
    const stiffness = constraint.stiffness || 0.1
    const damping = constraint.damping || 0.1

    const delta = this.subtract(bodyB.position, bodyA.position)
    const distance = this.magnitude(delta)

    if (distance === 0) return

    const force = (distance - restLength) * stiffness
    const direction = this.normalize(delta)

    const relativeVelocity = this.subtract(bodyB.velocity, bodyA.velocity)
    const dampingForce = this.dot(relativeVelocity, direction) * damping

    const totalForce = force + dampingForce

    const springForce = this.scalarMultiply(direction, totalForce)

    this.applyForce(bodyA, springForce)
    this.applyForce(bodyB, this.scalarMultiply(springForce, -1))
  }

  /**
   * Solve hinge constraint
   */
  private solveHingeConstraint(
    bodyA: PhysicsBody,
    bodyB: PhysicsBody,
    constraint: PhysicsConstraint
  ): void {
    // Keep bodies at same position (hinge point)
    const midpoint = {
      x: (bodyA.position.x + bodyB.position.x) / 2,
      y: (bodyA.position.y + bodyB.position.y) / 2,
    }

    if (!bodyA.isStatic) {
      bodyA.position = { ...midpoint }
    }
    if (!bodyB.isStatic) {
      bodyB.position = { ...midpoint }
    }
  }

  /**
   * Check collision between two bodies
   */
  checkCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): boolean {
    if (bodyA.shape === 'rectangle' && bodyB.shape === 'rectangle') {
      return this.checkAABBCollision(bodyA, bodyB)
    } else if (bodyA.shape === 'circle' && bodyB.shape === 'circle') {
      return this.checkCircleCollision(bodyA, bodyB)
    } else {
      // Mixed shapes - use circle-rectangle collision
      const circle = bodyA.shape === 'circle' ? bodyA : bodyB
      const rect = bodyA.shape === 'rectangle' ? bodyA : bodyB
      return this.checkCircleRectCollision(circle, rect)
    }
  }

  /**
   * Check AABB (Axis-Aligned Bounding Box) collision
   */
  private checkAABBCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): boolean {
    return (
      bodyA.position.x < bodyB.position.x + bodyB.width &&
      bodyA.position.x + bodyA.width > bodyB.position.x &&
      bodyA.position.y < bodyB.position.y + bodyB.height &&
      bodyA.position.y + bodyA.height > bodyB.position.y
    )
  }

  /**
   * Check circle collision
   */
  private checkCircleCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): boolean {
    const radiusA = bodyA.radius || bodyA.width / 2
    const radiusB = bodyB.radius || bodyB.width / 2
    const distance = this.distance(bodyA.position, bodyB.position)
    return distance < radiusA + radiusB
  }

  /**
   * Check circle-rectangle collision
   */
  private checkCircleRectCollision(circle: PhysicsBody, rect: PhysicsBody): boolean {
    const radius = circle.radius || circle.width / 2
    const closestX = Math.max(
      rect.position.x,
      Math.min(circle.position.x, rect.position.x + rect.width)
    )
    const closestY = Math.max(
      rect.position.y,
      Math.min(circle.position.y, rect.position.y + rect.height)
    )
    const distance = this.distance(circle.position, { x: closestX, y: closestY })
    return distance < radius
  }

  /**
   * Resolve collision between two bodies
   */
  resolveCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): void {
    if (bodyA.isStatic && bodyB.isStatic) return

    // Calculate collision normal
    const normal = this.normalize(this.subtract(bodyB.position, bodyA.position))

    // Calculate relative velocity
    const relativeVelocity = this.subtract(bodyB.velocity, bodyA.velocity)
    const velocityAlongNormal = this.dot(relativeVelocity, normal)

    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return

    // Calculate restitution (bounciness)
    const restitution = Math.min(bodyA.restitution, bodyB.restitution)

    // Calculate impulse scalar
    let impulseScalar = -(1 + restitution) * velocityAlongNormal
    impulseScalar /= 1 / bodyA.mass + 1 / bodyB.mass

    // Apply impulse
    const impulse = this.scalarMultiply(normal, impulseScalar)

    if (!bodyA.isStatic) {
      bodyA.velocity.x -= impulse.x / bodyA.mass
      bodyA.velocity.y -= impulse.y / bodyA.mass
    }

    if (!bodyB.isStatic) {
      bodyB.velocity.x += impulse.x / bodyB.mass
      bodyB.velocity.y += impulse.y / bodyB.mass
    }
  }

  /**
   * Vector operations
   */
  private add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y }
  }

  private subtract(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y }
  }

  private scalarMultiply(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar }
  }

  private dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y
  }

  private magnitude(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y)
  }

  private normalize(v: Vector2D): Vector2D {
    const mag = this.magnitude(v)
    return mag === 0 ? { x: 0, y: 0 } : { x: v.x / mag, y: v.y / mag }
  }

  private distance(a: Vector2D, b: Vector2D): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  /**
   * Clear all bodies and constraints
   */
  clear(): void {
    this.bodies.clear()
    this.constraints = []
    this.accumulator = 0
  }

  /**
   * Get configuration
   */
  getConfig(): PhysicsConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

export default PhysicsEngine

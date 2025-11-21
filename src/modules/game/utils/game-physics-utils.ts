/**
 * Physics simulation utilities for game development
 * Provides various physics calculations and simulations
 */

import { Vector2 } from '../types/game-types'
import { GameMathUtils } from './game-math-utils'

export interface PhysicsBody {
  position: Vector2
  velocity: Vector2
  acceleration: Vector2
  mass: number
  friction: number
  restitution: number // Bounciness (0-1)
  isStatic: boolean
}

export class GamePhysicsUtils {
  /**
   * Apply gravity to a physics body
   */
  static applyGravity(body: PhysicsBody, gravity: number, deltaTime: number): void {
    if (!body.isStatic) {
      body.acceleration.y += gravity * deltaTime
    }
  }

  /**
   * Apply friction to a physics body
   */
  static applyFriction(body: PhysicsBody, deltaTime: number): void {
    if (!body.isStatic && body.friction > 0) {
      const frictionForce = body.friction * deltaTime
      body.velocity.x *= 1 - frictionForce
      body.velocity.y *= 1 - frictionForce
    }
  }

  /**
   * Apply force to a physics body
   */
  static applyForce(body: PhysicsBody, force: Vector2): void {
    if (!body.isStatic && body.mass > 0) {
      body.acceleration.x += force.x / body.mass
      body.acceleration.y += force.y / body.mass
    }
  }

  /**
   * Apply impulse to a physics body (instant velocity change)
   */
  static applyImpulse(body: PhysicsBody, impulse: Vector2): void {
    if (!body.isStatic && body.mass > 0) {
      body.velocity.x += impulse.x / body.mass
      body.velocity.y += impulse.y / body.mass
    }
  }

  /**
   * Update physics body position and velocity
   */
  static updateBody(body: PhysicsBody, deltaTime: number): void {
    if (body.isStatic) return

    // Update velocity with acceleration
    body.velocity.x += body.acceleration.x * deltaTime
    body.velocity.y += body.acceleration.y * deltaTime

    // Update position with velocity
    body.position.x += body.velocity.x * deltaTime
    body.position.y += body.velocity.y * deltaTime

    // Reset acceleration
    body.acceleration.x = 0
    body.acceleration.y = 0
  }

  /**
   * Calculate elastic collision between two bodies
   */
  static elasticCollision(body1: PhysicsBody, body2: PhysicsBody): void {
    if (body1.isStatic && body2.isStatic) return

    const relativeVelocity = {
      x: body2.velocity.x - body1.velocity.x,
      y: body2.velocity.y - body1.velocity.y,
    }

    const normal = GameMathUtils.normalize(GameMathUtils.subtract(body2.position, body1.position))

    const relativeVelocityNormal = GameMathUtils.dot(relativeVelocity, normal)

    // Don't resolve if velocities are separating
    if (relativeVelocityNormal > 0) return

    // Calculate restitution (bounciness)
    const restitution = Math.min(body1.restitution, body2.restitution)

    // Calculate impulse scalar
    const impulseScalar = -(1 + restitution) * relativeVelocityNormal
    const totalMass = body1.isStatic
      ? body2.mass
      : body2.isStatic
        ? body1.mass
        : body1.mass + body2.mass
    const impulse = impulseScalar / totalMass

    // Apply impulse
    if (!body1.isStatic) {
      body1.velocity.x -= impulse * normal.x * body2.mass
      body1.velocity.y -= impulse * normal.y * body2.mass
    }

    if (!body2.isStatic) {
      body2.velocity.x += impulse * normal.x * body1.mass
      body2.velocity.y += impulse * normal.y * body1.mass
    }
  }

  /**
   * Calculate trajectory with initial velocity and gravity
   */
  static calculateTrajectory(
    startPosition: Vector2,
    initialVelocity: Vector2,
    gravity: number,
    steps: number
  ): Vector2[] {
    const trajectory: Vector2[] = []
    const deltaTime = 0.1 // Fixed time step

    const position = { ...startPosition }
    const velocity = { ...initialVelocity }

    for (let i = 0; i < steps; i++) {
      trajectory.push({ ...position })

      // Update velocity
      velocity.y += gravity * deltaTime

      // Update position
      position.x += velocity.x * deltaTime
      position.y += velocity.y * deltaTime
    }

    return trajectory
  }

  /**
   * Calculate launch velocity needed to reach a target
   */
  static calculateLaunchVelocity(
    start: Vector2,
    target: Vector2,
    gravity: number,
    angle: number
  ): number | null {
    const dx = target.x - start.x
    const dy = target.y - start.y

    const angleRad = GameMathUtils.degToRad(angle)
    const cos = Math.cos(angleRad)
    const sin = Math.sin(angleRad)

    // Using projectile motion equations
    const discriminant = Math.pow(sin, 2) - (2 * gravity * dy) / (dx * dx)

    if (discriminant < 0) return null // No solution

    const velocity = Math.sqrt((gravity * dx * dx) / (2 * cos * cos * discriminant))

    return velocity
  }

  /**
   * Apply drag force (air resistance)
   */
  static applyDrag(body: PhysicsBody, dragCoefficient: number, deltaTime: number): void {
    if (body.isStatic) return

    const speed = GameMathUtils.magnitude(body.velocity)
    if (speed === 0) return

    const dragForce = dragCoefficient * speed * speed
    const dragDirection = GameMathUtils.normalize({
      x: -body.velocity.x,
      y: -body.velocity.y,
    })

    const force = {
      x: dragDirection.x * dragForce,
      y: dragDirection.y * dragForce,
    }

    this.applyForce(body, force)
  }

  /**
   * Spring force (Hooke's Law)
   */
  static springForce(
    position: Vector2,
    anchor: Vector2,
    restLength: number,
    stiffness: number
  ): Vector2 {
    const displacement = GameMathUtils.subtract(anchor, position)
    const distance = GameMathUtils.magnitude(displacement)

    if (distance === 0) return { x: 0, y: 0 }

    const stretch = distance - restLength
    const direction = GameMathUtils.normalize(displacement)

    return {
      x: direction.x * stretch * stiffness,
      y: direction.y * stretch * stiffness,
    }
  }

  /**
   * Damped spring force
   */
  static dampedSpringForce(
    position: Vector2,
    velocity: Vector2,
    anchor: Vector2,
    restLength: number,
    stiffness: number,
    damping: number
  ): Vector2 {
    const springF = this.springForce(position, anchor, restLength, stiffness)

    const dampingF = {
      x: -velocity.x * damping,
      y: -velocity.y * damping,
    }

    return {
      x: springF.x + dampingF.x,
      y: springF.y + dampingF.y,
    }
  }

  /**
   * Calculate terminal velocity with drag
   */
  static terminalVelocity(mass: number, gravity: number, dragCoefficient: number): number {
    if (dragCoefficient === 0) return Infinity
    return Math.sqrt((mass * gravity) / dragCoefficient)
  }

  /**
   * Resolve penetration between two overlapping objects
   */
  static resolvePenetration(body1: PhysicsBody, body2: PhysicsBody, penetration: Vector2): void {
    if (body1.isStatic && body2.isStatic) return

    const totalMass = body1.isStatic
      ? body2.mass
      : body2.isStatic
        ? body1.mass
        : body1.mass + body2.mass

    if (!body1.isStatic) {
      const ratio = body2.mass / totalMass
      body1.position.x -= penetration.x * ratio
      body1.position.y -= penetration.y * ratio
    }

    if (!body2.isStatic) {
      const ratio = body1.mass / totalMass
      body2.position.x += penetration.x * ratio
      body2.position.y += penetration.y * ratio
    }
  }

  /**
   * Apply angular velocity to rotation
   */
  static updateRotation(
    currentRotation: number,
    angularVelocity: number,
    deltaTime: number
  ): number {
    return GameMathUtils.normalizeAngle(currentRotation + angularVelocity * deltaTime)
  }

  /**
   * Calculate moment of inertia for a rectangle
   */
  static momentOfInertiaRect(mass: number, width: number, height: number): number {
    return (mass * (width * width + height * height)) / 12
  }

  /**
   * Calculate moment of inertia for a circle
   */
  static momentOfInertiaCircle(mass: number, radius: number): number {
    return (mass * radius * radius) / 2
  }

  /**
   * Apply torque to angular acceleration
   */
  static applyTorque(torque: number, momentOfInertia: number): number {
    if (momentOfInertia === 0) return 0
    return torque / momentOfInertia
  }

  /**
   * Calculate centripetal force for circular motion
   */
  static centripetalForce(mass: number, velocity: number, radius: number): number {
    if (radius === 0) return 0
    return (mass * velocity * velocity) / radius
  }

  /**
   * Simple harmonic motion (sine wave)
   */
  static harmonicMotion(
    amplitude: number,
    frequency: number,
    time: number,
    phase: number = 0
  ): number {
    return amplitude * Math.sin(2 * Math.PI * frequency * time + phase)
  }

  /**
   * Damped harmonic motion
   */
  static dampedHarmonicMotion(
    amplitude: number,
    frequency: number,
    damping: number,
    time: number,
    phase: number = 0
  ): number {
    return amplitude * Math.exp(-damping * time) * Math.sin(2 * Math.PI * frequency * time + phase)
  }

  /**
   * Calculate escape velocity
   */
  static escapeVelocity(gravity: number, planetRadius: number): number {
    return Math.sqrt(2 * gravity * planetRadius)
  }

  /**
   * Orbital velocity
   */
  static orbitalVelocity(gravity: number, planetRadius: number, orbitRadius: number): number {
    return Math.sqrt((gravity * planetRadius * planetRadius) / orbitRadius)
  }

  /**
   * Verlet integration (more accurate for physics)
   */
  static verletIntegration(
    position: Vector2,
    oldPosition: Vector2,
    acceleration: Vector2,
    deltaTime: number
  ): Vector2 {
    const newPosition = {
      x: 2 * position.x - oldPosition.x + acceleration.x * deltaTime * deltaTime,
      y: 2 * position.y - oldPosition.y + acceleration.y * deltaTime * deltaTime,
    }

    return newPosition
  }

  /**
   * Calculate velocity from Verlet integration
   */
  static verletVelocity(position: Vector2, oldPosition: Vector2, deltaTime: number): Vector2 {
    return {
      x: (position.x - oldPosition.x) / deltaTime,
      y: (position.y - oldPosition.y) / deltaTime,
    }
  }
}

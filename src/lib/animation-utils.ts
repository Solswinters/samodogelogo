/**
 * Animation and easing utilities
 */

export class AnimationUtils {
  /**
   * Linear easing
   */
  static linear(t: number): number {
    return t
  }

  /**
   * Ease in quad
   */
  static easeInQuad(t: number): number {
    return t * t
  }

  /**
   * Ease out quad
   */
  static easeOutQuad(t: number): number {
    return t * (2 - t)
  }

  /**
   * Ease in out quad
   */
  static easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  /**
   * Ease in cubic
   */
  static easeInCubic(t: number): number {
    return t * t * t
  }

  /**
   * Ease out cubic
   */
  static easeOutCubic(t: number): number {
    return --t * t * t + 1
  }

  /**
   * Ease in out cubic
   */
  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  /**
   * Animate a value over time
   */
  static animate(
    from: number,
    to: number,
    duration: number,
    easing: (t: number) => number = (t: number) => AnimationUtils.easeInOutQuad(t),
    onUpdate: (value: number) => void,
    onComplete?: () => void
  ): () => void {
    const startTime = Date.now()
    let rafId: number

    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      const value = from + (to - from) * easedProgress

      onUpdate(value)

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        onComplete?.()
      }
    }

    rafId = requestAnimationFrame(step)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }

  /**
   * Create a spring animation
   */
  static spring(
    from: number,
    to: number,
    onUpdate: (value: number) => void,
    config: { stiffness?: number; damping?: number; mass?: number } = {}
  ): () => void {
    const { stiffness = 100, damping = 10, mass = 1 } = config
    let position = from
    let velocity = 0
    let rafId: number

    const step = () => {
      const force = -stiffness * (position - to)
      const dampingForce = -damping * velocity
      const acceleration = (force + dampingForce) / mass

      velocity += acceleration * 0.016
      position += velocity * 0.016

      onUpdate(position)

      if (Math.abs(velocity) > 0.01 || Math.abs(position - to) > 0.01) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }
}

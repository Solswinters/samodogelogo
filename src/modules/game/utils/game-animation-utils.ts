/**
 * Animation utilities for game graphics
 * Provides easing functions and animation helpers
 */

export type EasingFunction = (t: number) => number

export class GameAnimationUtils {
  /**
   * Linear easing (no easing)
   */
  static linear(t: number): number {
    return t
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
   * Ease in (cubic)
   */
  static easeInCubic(t: number): number {
    return t * t * t
  }

  /**
   * Ease out (cubic)
   */
  static easeOutCubic(t: number): number {
    return --t * t * t + 1
  }

  /**
   * Ease in-out (cubic)
   */
  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  /**
   * Ease in (quartic)
   */
  static easeInQuart(t: number): number {
    return t * t * t * t
  }

  /**
   * Ease out (quartic)
   */
  static easeOutQuart(t: number): number {
    return 1 - --t * t * t * t
  }

  /**
   * Ease in-out (quartic)
   */
  static easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
  }

  /**
   * Ease in (quintic)
   */
  static easeInQuint(t: number): number {
    return t * t * t * t * t
  }

  /**
   * Ease out (quintic)
   */
  static easeOutQuint(t: number): number {
    return 1 + --t * t * t * t * t
  }

  /**
   * Ease in-out (quintic)
   */
  static easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
  }

  /**
   * Ease in (sine)
   */
  static easeInSine(t: number): number {
    return 1 - Math.cos((t * Math.PI) / 2)
  }

  /**
   * Ease out (sine)
   */
  static easeOutSine(t: number): number {
    return Math.sin((t * Math.PI) / 2)
  }

  /**
   * Ease in-out (sine)
   */
  static easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }

  /**
   * Ease in (exponential)
   */
  static easeInExpo(t: number): number {
    return t === 0 ? 0 : Math.pow(2, 10 * t - 10)
  }

  /**
   * Ease out (exponential)
   */
  static easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  /**
   * Ease in-out (exponential)
   */
  static easeInOutExpo(t: number): number {
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2
  }

  /**
   * Ease in (circular)
   */
  static easeInCirc(t: number): number {
    return 1 - Math.sqrt(1 - Math.pow(t, 2))
  }

  /**
   * Ease out (circular)
   */
  static easeOutCirc(t: number): number {
    return Math.sqrt(1 - Math.pow(t - 1, 2))
  }

  /**
   * Ease in-out (circular)
   */
  static easeInOutCirc(t: number): number {
    return t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2
  }

  /**
   * Ease in (back)
   */
  static easeInBack(t: number): number {
    const c1 = 1.70158
    const c3 = c1 + 1
    return c3 * t * t * t - c1 * t * t
  }

  /**
   * Ease out (back)
   */
  static easeOutBack(t: number): number {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }

  /**
   * Ease in-out (back)
   */
  static easeInOutBack(t: number): number {
    const c1 = 1.70158
    const c2 = c1 * 1.525
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
  }

  /**
   * Ease in (elastic)
   */
  static easeInElastic(t: number): number {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
  }

  /**
   * Ease out (elastic)
   */
  static easeOutElastic(t: number): number {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  /**
   * Ease in-out (elastic)
   */
  static easeInOutElastic(t: number): number {
    const c5 = (2 * Math.PI) / 4.5
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1
  }

  /**
   * Ease in (bounce)
   */
  static easeInBounce(t: number): number {
    return 1 - this.easeOutBounce(1 - t)
  }

  /**
   * Ease out (bounce)
   */
  static easeOutBounce(t: number): number {
    const n1 = 7.5625
    const d1 = 2.75

    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }

  /**
   * Ease in-out (bounce)
   */
  static easeInOutBounce(t: number): number {
    return t < 0.5
      ? (1 - this.easeOutBounce(1 - 2 * t)) / 2
      : (1 + this.easeOutBounce(2 * t - 1)) / 2
  }

  /**
   * Animate value from start to end
   */
  static animate(
    from: number,
    to: number,
    duration: number,
    easing: EasingFunction = this.linear,
    onUpdate: (value: number) => void,
    onComplete?: () => void
  ): () => void {
    const startTime = performance.now()
    let cancelled = false

    const update = (currentTime: number) => {
      if (cancelled) return

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      const currentValue = from + (to - from) * easedProgress

      onUpdate(currentValue)

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        onComplete?.()
      }
    }

    requestAnimationFrame(update)

    // Return cancel function
    return () => {
      cancelled = true
    }
  }

  /**
   * Spring animation
   */
  static spring(
    from: number,
    to: number,
    velocity: number = 0,
    stiffness: number = 100,
    damping: number = 10,
    onUpdate: (value: number, velocity: number) => void,
    onComplete?: () => void
  ): () => void {
    let currentValue = from
    let currentVelocity = velocity
    let cancelled = false
    let lastTime = performance.now()

    const update = (currentTime: number) => {
      if (cancelled) return

      const deltaTime = (currentTime - lastTime) / 1000 // Convert to seconds
      lastTime = currentTime

      const force = (to - currentValue) * stiffness
      const dampingForce = currentVelocity * damping
      const acceleration = force - dampingForce

      currentVelocity += acceleration * deltaTime
      currentValue += currentVelocity * deltaTime

      onUpdate(currentValue, currentVelocity)

      // Check if animation should stop (settled)
      const isSettled = Math.abs(currentVelocity) < 0.01 && Math.abs(to - currentValue) < 0.01

      if (!isSettled) {
        requestAnimationFrame(update)
      } else {
        onUpdate(to, 0)
        onComplete?.()
      }
    }

    requestAnimationFrame(update)

    // Return cancel function
    return () => {
      cancelled = true
    }
  }

  /**
   * Sequence multiple animations
   */
  static sequence(animations: Array<() => Promise<void>>): Promise<void> {
    return animations.reduce((promise, animation) => promise.then(animation), Promise.resolve())
  }

  /**
   * Run animations in parallel
   */
  static parallel(animations: Array<() => Promise<void>>): Promise<void[]> {
    return Promise.all(animations.map((animation) => animation()))
  }

  /**
   * Delay execution
   */
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Create keyframe animation
   */
  static keyframes(
    keyframes: Array<{ time: number; value: number }>,
    duration: number,
    easing: EasingFunction = this.linear,
    onUpdate: (value: number) => void,
    onComplete?: () => void
  ): () => void {
    const startTime = performance.now()
    let cancelled = false

    const update = (currentTime: number) => {
      if (cancelled) return

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)

      // Find surrounding keyframes
      let prevFrame = keyframes[0]
      let nextFrame = keyframes[keyframes.length - 1]

      for (let i = 0; i < keyframes.length - 1; i++) {
        if (easedProgress >= keyframes[i].time && easedProgress <= keyframes[i + 1].time) {
          prevFrame = keyframes[i]
          nextFrame = keyframes[i + 1]
          break
        }
      }

      // Interpolate between keyframes
      const frameProgress = (easedProgress - prevFrame.time) / (nextFrame.time - prevFrame.time)
      const currentValue = prevFrame.value + (nextFrame.value - prevFrame.value) * frameProgress

      onUpdate(currentValue)

      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        onComplete?.()
      }
    }

    requestAnimationFrame(update)

    return () => {
      cancelled = true
    }
  }
}

/**
 * Animation utilities for game development
 * Provides easing functions, tweening, and animation helpers
 */

export type EasingFunction = (t: number) => number

export interface AnimationConfig {
  duration: number
  easing: EasingFunction
  onUpdate?: (value: number) => void
  onComplete?: () => void
}

export interface TweenConfig {
  from: number
  to: number
  duration: number
  easing?: EasingFunction
  delay?: number
  repeat?: number
  yoyo?: boolean
  onUpdate?: (value: number) => void
  onComplete?: () => void
}

export class GameAnimationUtils {
  /**
   * Linear easing (no acceleration)
   */
  static linear(t: number): number {
    return t
  }

  /**
   * Quadratic ease-in
   */
  static easeInQuad(t: number): number {
    return t * t
  }

  /**
   * Quadratic ease-out
   */
  static easeOutQuad(t: number): number {
    return t * (2 - t)
  }

  /**
   * Quadratic ease-in-out
   */
  static easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  /**
   * Cubic ease-in
   */
  static easeInCubic(t: number): number {
    return t * t * t
  }

  /**
   * Cubic ease-out
   */
  static easeOutCubic(t: number): number {
    return --t * t * t + 1
  }

  /**
   * Cubic ease-in-out
   */
  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  /**
   * Quartic ease-in
   */
  static easeInQuart(t: number): number {
    return t * t * t * t
  }

  /**
   * Quartic ease-out
   */
  static easeOutQuart(t: number): number {
    return 1 - --t * t * t * t
  }

  /**
   * Quartic ease-in-out
   */
  static easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
  }

  /**
   * Quintic ease-in
   */
  static easeInQuint(t: number): number {
    return t * t * t * t * t
  }

  /**
   * Quintic ease-out
   */
  static easeOutQuint(t: number): number {
    return 1 + --t * t * t * t * t
  }

  /**
   * Quintic ease-in-out
   */
  static easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
  }

  /**
   * Sinusoidal ease-in
   */
  static easeInSine(t: number): number {
    return 1 - Math.cos((t * Math.PI) / 2)
  }

  /**
   * Sinusoidal ease-out
   */
  static easeOutSine(t: number): number {
    return Math.sin((t * Math.PI) / 2)
  }

  /**
   * Sinusoidal ease-in-out
   */
  static easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }

  /**
   * Exponential ease-in
   */
  static easeInExpo(t: number): number {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1))
  }

  /**
   * Exponential ease-out
   */
  static easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  /**
   * Exponential ease-in-out
   */
  static easeInOutExpo(t: number): number {
    if (t === 0) return 0
    if (t === 1) return 1
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2
    return (2 - Math.pow(2, -20 * t + 10)) / 2
  }

  /**
   * Circular ease-in
   */
  static easeInCirc(t: number): number {
    return 1 - Math.sqrt(1 - t * t)
  }

  /**
   * Circular ease-out
   */
  static easeOutCirc(t: number): number {
    return Math.sqrt(1 - --t * t)
  }

  /**
   * Circular ease-in-out
   */
  static easeInOutCirc(t: number): number {
    return t < 0.5
      ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
      : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2
  }

  /**
   * Back ease-in
   */
  static easeInBack(t: number): number {
    const c = 1.70158
    return (c + 1) * t * t * t - c * t * t
  }

  /**
   * Back ease-out
   */
  static easeOutBack(t: number): number {
    const c = 1.70158
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
  }

  /**
   * Back ease-in-out
   */
  static easeInOutBack(t: number): number {
    const c = 1.70158 * 1.525
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c + 1) * 2 * t - c)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c + 1) * (t * 2 - 2) + c) + 2) / 2
  }

  /**
   * Elastic ease-in
   */
  static easeInElastic(t: number): number {
    if (t === 0) return 0
    if (t === 1) return 1
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
  }

  /**
   * Elastic ease-out
   */
  static easeOutElastic(t: number): number {
    if (t === 0) return 0
    if (t === 1) return 1
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1
  }

  /**
   * Elastic ease-in-out
   */
  static easeInOutElastic(t: number): number {
    if (t === 0) return 0
    if (t === 1) return 1
    const c = (2 * Math.PI) / 4.5
    return t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c)) / 2 + 1
  }

  /**
   * Bounce ease-in
   */
  static easeInBounce(t: number): number {
    return 1 - this.easeOutBounce(1 - t)
  }

  /**
   * Bounce ease-out
   */
  static easeOutBounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
    }
  }

  /**
   * Bounce ease-in-out
   */
  static easeInOutBounce(t: number): number {
    return t < 0.5 ? this.easeInBounce(t * 2) / 2 : this.easeOutBounce(t * 2 - 1) / 2 + 0.5
  }

  /**
   * Create a tween animation
   */
  static createTween(config: TweenConfig): {
    update: (deltaTime: number) => boolean
    reset: () => void
  } {
    const {
      from,
      to,
      duration,
      easing = this.linear,
      delay = 0,
      repeat = 0,
      yoyo = false,
      onUpdate,
      onComplete,
    } = config

    let elapsed = -delay
    let currentRepeat = 0
    let isReversed = false

    const update = (deltaTime: number): boolean => {
      elapsed += deltaTime

      if (elapsed < 0) return true

      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)

      let value: number
      if (isReversed) {
        value = from + (to - from) * (1 - easedProgress)
      } else {
        value = from + (to - from) * easedProgress
      }

      if (onUpdate) {
        onUpdate(value)
      }

      if (progress >= 1) {
        if (yoyo && !isReversed) {
          isReversed = true
          elapsed = 0
          return true
        }

        if (repeat === -1 || currentRepeat < repeat) {
          currentRepeat++
          elapsed = 0
          isReversed = false
          return true
        }

        if (onComplete) {
          onComplete()
        }

        return false
      }

      return true
    }

    const reset = () => {
      elapsed = -delay
      currentRepeat = 0
      isReversed = false
    }

    return { update, reset }
  }

  /**
   * Interpolate between two values
   */
  static lerp(from: number, to: number, t: number): number {
    return from + (to - from) * t
  }

  /**
   * Smooth step interpolation
   */
  static smoothStep(from: number, to: number, t: number): number {
    const x = Math.max(0, Math.min(1, t))
    const smooth = x * x * (3 - 2 * x)
    return this.lerp(from, to, smooth)
  }

  /**
   * Smoother step interpolation (Ken Perlin)
   */
  static smootherStep(from: number, to: number, t: number): number {
    const x = Math.max(0, Math.min(1, t))
    const smooth = x * x * x * (x * (x * 6 - 15) + 10)
    return this.lerp(from, to, smooth)
  }

  /**
   * Cubic Hermite spline interpolation
   */
  static hermite(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const t2 = t * t
    const t3 = t2 * t

    return (
      0.5 *
      (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    )
  }

  /**
   * Catmull-Rom spline interpolation
   */
  static catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const t2 = t * t
    const t3 = t2 * t

    return (
      0.5 *
      (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    )
  }

  /**
   * Bezier curve interpolation (quadratic)
   */
  static bezierQuad(p0: number, p1: number, p2: number, t: number): number {
    const u = 1 - t
    return u * u * p0 + 2 * u * t * p1 + t * t * p2
  }

  /**
   * Bezier curve interpolation (cubic)
   */
  static bezierCubic(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const u = 1 - t
    const uu = u * u
    const uuu = uu * u
    const tt = t * t
    const ttt = tt * t

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3
  }

  /**
   * Spring animation
   */
  static spring(
    current: number,
    target: number,
    velocity: number,
    stiffness: number = 0.15,
    damping: number = 0.8
  ): {
    value: number
    velocity: number
  } {
    const force = (target - current) * stiffness
    velocity = (velocity + force) * damping
    const value = current + velocity

    return { value, velocity }
  }

  /**
   * Shake animation (random offset)
   */
  static shake(intensity: number, decay: number = 0.95): number {
    return (Math.random() * 2 - 1) * intensity * decay
  }

  /**
   * Pulse animation (sine wave)
   */
  static pulse(time: number, frequency: number = 1, amplitude: number = 1): number {
    return Math.sin(time * frequency * Math.PI * 2) * amplitude
  }

  /**
   * Wobble animation
   */
  static wobble(time: number, frequency: number = 1, amplitude: number = 1): number {
    return Math.sin(time * frequency * Math.PI) * Math.exp(-time * 0.5) * amplitude
  }
}

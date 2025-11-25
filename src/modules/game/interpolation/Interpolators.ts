/**
 * Interpolation utilities for smooth animations
 */

/**
 * lerp utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of lerp.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * smoothStep utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of smoothStep.
 */
export function smoothStep(t: number): number {
  return t * t * (3 - 2 * t)
}

/**
 * smootherStep utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of smootherStep.
 */
export function smootherStep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/**
 * cubicBezier utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of cubicBezier.
 */
export function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

/**
 * catmullRom utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of catmullRom.
 */
export function catmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number {
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
 * elasticIn utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of elasticIn.
 */
export function elasticIn(t: number): number {
  const p = 0.3
  return Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - p / 4) * (2 * Math.PI)) / p)
}

/**
 * elasticOut utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of elasticOut.
 */
export function elasticOut(t: number): number {
  const p = 0.3
  return 1 - Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p)
}

/**
 * bounceOut utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of bounceOut.
 */
export function bounceOut(t: number): number {
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
 * bounceIn utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of bounceIn.
 */
export function bounceIn(t: number): number {
  return 1 - bounceOut(1 - t)
}

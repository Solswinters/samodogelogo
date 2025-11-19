/**
 * Interpolation utilities for smooth animations
 */

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function smoothStep(t: number): number {
  return t * t * (3 - 2 * t)
}

export function smootherStep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

export function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

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

export function elasticIn(t: number): number {
  const p = 0.3
  return Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - p / 4) * (2 * Math.PI)) / p)
}

export function elasticOut(t: number): number {
  const p = 0.3
  return 1 - Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p)
}

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

export function bounceIn(t: number): number {
  return 1 - bounceOut(1 - t)
}

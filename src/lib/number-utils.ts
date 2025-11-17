/**
 * Number manipulation utilities
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount
}

export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function percentage(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) {return 0}
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

export function max(numbers: number[]): number {
  return Math.max(...numbers)
}

export function min(numbers: number[]): number {
  return Math.min(...numbers)
}

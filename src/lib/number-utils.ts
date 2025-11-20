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
  if (numbers.length === 0) {
    return 0
  }
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

/**
 * Calculate median of an array of numbers
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0
  }

  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }

  return sorted[mid]
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0
  }

  const avg = average(numbers)
  const squareDiffs = numbers.map((n) => Math.pow(n - avg, 2))
  const avgSquareDiff = average(squareDiffs)

  return Math.sqrt(avgSquareDiff)
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(value: number, separator = ','): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/**
 * Format a number as percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${roundTo(value, decimals)}%`
}

/**
 * Check if a number is even
 */
export function isEven(value: number): boolean {
  return value % 2 === 0
}

/**
 * Check if a number is odd
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0
}

/**
 * Check if a number is prime
 */
export function isPrime(value: number): boolean {
  if (value <= 1) {
    return false
  }
  if (value <= 3) {
    return true
  }
  if (value % 2 === 0 || value % 3 === 0) {
    return false
  }

  for (let i = 5; i * i <= value; i += 6) {
    if (value % i === 0 || value % (i + 2) === 0) {
      return false
    }
  }

  return true
}

/**
 * Calculate factorial
 */
export function factorial(n: number): number {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers')
  }
  if (n === 0 || n === 1) {
    return 1
  }

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }

  return result
}

/**
 * Calculate Fibonacci number at position n
 */
export function fibonacci(n: number): number {
  if (n < 0) {
    throw new Error('Fibonacci is not defined for negative numbers')
  }
  if (n <= 1) {
    return n
  }

  let a = 0
  let b = 1

  for (let i = 2; i <= n; i++) {
    const temp = a + b
    a = b
    b = temp
  }

  return b
}

/**
 * Calculate greatest common divisor
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)

  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }

  return a
}

/**
 * Calculate least common multiple
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Safe division that returns 0 instead of Infinity
 */
export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (denominator === 0) {
    return fallback
  }
  return numerator / denominator
}

/**
 * Generate array of numbers within a range
 */
export function rangeArray(start: number, end: number, step = 1): number[] {
  const result: number[] = []

  if (step === 0) {
    return result
  }

  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      result.push(i)
    }
  } else {
    for (let i = start; i >= end; i += step) {
      result.push(i)
    }
  }

  return result
}

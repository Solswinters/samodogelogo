/**
 * Mathematical utilities and helpers
 */

export class MathUtils {
  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  /**
   * Linear interpolation between two values
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t
  }

  /**
   * Map a value from one range to another
   */
  static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  }

  /**
   * Round to specified decimal places
   */
  static roundTo(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals)
    return Math.round(value * multiplier) / multiplier
  }

  /**
   * Check if value is within range (inclusive)
   */
  static inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }

  /**
   * Calculate percentage
   */
  static percentage(value: number, total: number): number {
    return (value / total) * 100
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Generate random float between min and max
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * Calculate average of array
   */
  static average(numbers: number[]): number {
    if (numbers.length === 0) {return 0}
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
  }

  /**
   * Calculate sum of array
   */
  static sum(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0)
  }

  /**
   * Find minimum value in array
   */
  static min(numbers: number[]): number {
    return Math.min(...numbers)
  }

  /**
   * Find maximum value in array
   */
  static max(numbers: number[]): number {
    return Math.max(...numbers)
  }

  /**
   * Calculate distance between two points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  /**
   * Calculate angle between two points (in radians)
   */
  static angle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1)
  }

  /**
   * Convert degrees to radians
   */
  static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  /**
   * Convert radians to degrees
   */
  static toDegrees(radians: number): number {
    return (radians * 180) / Math.PI
  }
}

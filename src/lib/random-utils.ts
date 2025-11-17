/**
 * Random generation utilities
 */

export class RandomUtils {
  /**
   * Generate random integer between min and max (inclusive)
   */
  static int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Generate random float between min and max
   */
  static float(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * Generate random boolean
   */
  static boolean(probability = 0.5): boolean {
    return Math.random() < probability
  }

  /**
   * Pick random element from array
   */
  static pick<T>(array: T[]): T | undefined {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Pick multiple random elements from array
   */
  static picks<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  /**
   * Shuffle array (Fisher-Yates algorithm)
   */
  static shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = result[i]
      const item = result[j]
      if (temp !== undefined && item !== undefined) {
        result[i] = item
        result[j] = temp
      }
    }
    return result
  }

  /**
   * Generate random string
   */
  static string(
    length: number,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  ): string {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Generate random hex color
   */
  static color(): string {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    )
  }

  /**
   * Generate random UUID v4
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * Weighted random selection
   */
  static weighted<T>(items: T[], weights: number[]): T | undefined {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < items.length; i++) {
      const weight = weights[i]
      if (weight !== undefined) {
        random -= weight
        if (random <= 0) {
          return items[i]
        }
      }
    }

    return items[items.length - 1]
  }
}

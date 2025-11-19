/**
 * Seeded random number generator for deterministic gameplay
 */

export class SeededRandom {
  private seed: number

  constructor(seed: number = Date.now()) {
    this.seed = seed
  }

  next(): number {
    // LCG algorithm
    this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32
    return this.seed / 2 ** 32
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min
  }

  nextBoolean(): boolean {
    return this.next() < 0.5
  }

  choice<T>(array: T[]): T {
    const index = this.nextInt(0, array.length - 1)
    return array[index] as T
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i)
      ;[result[i], result[j]] = [result[j] as T, result[i] as T]
    }
    return result
  }

  setSeed(seed: number): void {
    this.seed = seed
  }

  getSeed(): number {
    return this.seed
  }
}

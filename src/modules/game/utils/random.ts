/**
 * Random number generation utilities for game mechanics
 */

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomBoolean(probability: number = 0.5): boolean {
  return Math.random() < probability
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T
}

export function randomChoices<T>(array: T[], count: number): T[] {
  const result: T[] = []
  const copy = [...array]

  for (let i = 0; i < Math.min(count, copy.length); i++) {
    const index = Math.floor(Math.random() * copy.length)
    const item = copy.splice(index, 1)[0]
    if (item !== undefined) {
      result.push(item)
    }
  }

  return result
}

export function weightedRandom<T>(items: T[], weights: number[]): T {
  if (items.length !== weights.length) {
    throw new Error('Items and weights must have the same length')
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  let random = Math.random() * totalWeight

  for (let i = 0; i < items.length; i++) {
    const weight = weights[i]
    if (weight !== undefined && random < weight) {
      return items[i] as T
    }
    random -= weight ?? 0
  }

  return items[items.length - 1] as T
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j] as T
    result[j] = temp as T
  }
  return result
}

export function randomColor(): string {
  const r = randomInt(0, 255)
  const g = randomInt(0, 255)
  const b = randomInt(0, 255)
  return `rgb(${r}, ${g}, ${b})`
}

export function randomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`
}

export class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min
  }

  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability
  }
}

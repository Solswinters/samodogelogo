/**
 * Array helper utilities
 */

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

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const key = keyFn(item)
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(item)
      return result
    },
    {} as Record<K, T[]>
  )
}

export function sortBy<T>(array: T[], keyFn: (item: T) => number | string): T[] {
  return [...array].sort((a, b) => {
    const aKey = keyFn(a)
    const bKey = keyFn(b)
    if (aKey < bKey) {
      return -1
    }
    if (aKey > bKey) {
      return 1
    }
    return 0
  })
}

export function findLast<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    const item = array[i]
    if (item !== undefined && predicate(item)) {
      return item
    }
  }
  return undefined
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = []
  const falsy: T[] = []

  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item)
    } else {
      falsy.push(item)
    }
  }

  return [truthy, falsy]
}

export function compact<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined)
}

export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)]
}

export function sampleMany<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array)
  return shuffled.slice(0, count)
}

export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter(item => !set2.has(item))
}

export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter(item => set2.has(item))
}

export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2])
}

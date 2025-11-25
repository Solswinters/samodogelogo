/**
 * Array manipulation utilities
 */

/**
 * Split an array into chunks of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0')
  }
  if (!array.length) {
    return []
  }

  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * shuffle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of shuffle.
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * unique utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of unique.
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * uniqueBy utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of uniqueBy.
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * groupBy utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of groupBy.
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key])
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

/**
 * sortBy utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sortBy.
 */
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return direction === 'asc' ? comparison : -comparison
  })
}

/**
 * partition utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of partition.
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = []
  const falsy: T[] = []
  array.forEach((item) => (predicate(item) ? truthy : falsy).push(item))
  return [truthy, falsy]
}

/**
 * last utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of last.
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

/**
 * first utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of first.
 */
export function first<T>(array: T[]): T | undefined {
  return array[0]
}

/**
 * Get a random element from an array
 */
export function random<T>(array: T[]): T | undefined {
  if (!array.length) {
    return undefined
  }
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Get multiple random elements from an array
 */
export function sample<T>(array: T[], count: number): T[] {
  if (count <= 0) {
    return []
  }
  if (count >= array.length) {
    return shuffle(array)
  }

  const result: T[] = []
  const used = new Set<number>()

  while (result.length < count) {
    const index = Math.floor(Math.random() * array.length)
    if (!used.has(index)) {
      used.add(index)
      result.push(array[index])
    }
  }

  return result
}

/**
 * Remove duplicate elements from an array based on a comparison function
 */
export function uniqueWith<T>(array: T[], comparator: (a: T, b: T) => boolean): T[] {
  return array.filter((item, index, arr) => {
    return !arr.slice(0, index).some((prevItem) => comparator(item, prevItem))
  })
}

/**
 * Find the intersection of multiple arrays
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (!arrays.length) {
    return []
  }

  const [first, ...rest] = arrays
  return first.filter((item) => rest.every((arr) => arr.includes(item)))
}

/**
 * Find the difference between two arrays
 */
export function difference<T>(array: T[], exclude: T[]): T[] {
  const excludeSet = new Set(exclude)
  return array.filter((item) => !excludeSet.has(item))
}

/**
 * Flatten a nested array to specified depth
 */
export function flatten<T>(array: unknown[], depth = 1): T[] {
  if (depth <= 0) {
    return array as T[]
  }

  return array.reduce<T[]>((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten<T>(item, depth - 1))
    } else {
      acc.push(item as T)
    }
    return acc
  }, [])
}

/**
 * Check if array is empty
 */
export function isEmpty<T>(array: T[]): boolean {
  return array.length === 0
}

/**
 * Compact an array by removing falsy values
 */
export function compact<T>(array: (T | null | undefined | false | '' | 0)[]): T[] {
  return array.filter(Boolean) as T[]
}

/**
 * Create a range of numbers
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = []
  if (step === 0) {
    return result
  }

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i)
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i)
    }
  }

  return result
}

/**
 * Zip multiple arrays together
 */
export function zip<T>(...arrays: T[][]): T[][] {
  const length = Math.max(...arrays.map((arr) => arr.length))
  return range(0, length).map((i) => arrays.map((arr) => arr[i]))
}

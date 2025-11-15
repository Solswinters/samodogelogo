/**
 * Object helper utilities
 */

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key as keyof T] = fn(obj[key as keyof T], key as keyof T)
    }
  }
  return result
}

export function mapKeys<T extends object, K extends string>(
  obj: T,
  fn: (key: keyof T) => K
): Record<K, T[keyof T]> {
  const result = {} as Record<K, T[keyof T]>
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = fn(key as keyof T)
      result[newKey] = obj[key as keyof T]
    }
  }
  return result
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

export function isEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false
    }
    if (!isEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])) {
      return false
    }
  }

  return true
}

export function merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  const result = { ...target }
  for (const source of sources) {
    Object.assign(result, source)
  }
  return result
}

export function flatten<T extends Record<string, unknown>>(
  obj: T,
  prefix: string = ''
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${String(key)}` : String(key)
      const value = obj[key]

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, flatten(value as Record<string, unknown>, newKey))
      } else {
        result[newKey] = value
      }
    }
  }

  return result
}

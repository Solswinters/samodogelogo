/**
 * Object utilities
 */

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (obj instanceof Object) {
    const clonedObj = {} as T
    Object.keys(obj).forEach(key => {
      clonedObj[key as keyof T] = deepClone((obj as Record<string, unknown>)[key] as T[keyof T])
    })
    return clonedObj
  }

  return obj
}

export function merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  return Object.assign({}, target, ...sources)
}

export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>
  Object.keys(obj).forEach(key => {
    const typedKey = key as keyof T
    result[typedKey] = fn(obj[typedKey], typedKey)
  })
  return result
}

export function filterObject<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result = {} as Partial<T>
  Object.keys(obj).forEach(key => {
    const typedKey = key as keyof T
    if (predicate(obj[typedKey], typedKey)) {
      result[typedKey] = obj[typedKey]
    }
  })
  return result
}

export function invert<T extends Record<string, string>>(obj: T): Record<string, string> {
  const result: Record<string, string> = {}
  Object.entries(obj).forEach(([key, value]) => {
    result[value] = key
  })
  return result
}

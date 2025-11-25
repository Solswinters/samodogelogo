/**
 * Object manipulation utilities
 */

/**
 * pick utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of pick.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

/**
 * omit utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of omit.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

/**
 * deepClone utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deepClone.
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

/**
 * deepMerge utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deepMerge.
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) {
    return target
  }

  const result = { ...target }

  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T]
      const targetValue = result[key as keyof T]

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key as keyof T] = deepMerge(
          targetValue as object,
          sourceValue as object
        ) as T[keyof T]
      } else if (sourceValue !== undefined) {
        result[key as keyof T] = sourceValue as T[keyof T]
      }
    })
  })

  return result
}

/**
 * isObject utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isObject.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * isEmpty utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isEmpty.
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

/**
 * hasProperty utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of hasProperty.
 */
export function hasProperty<T extends object>(obj: T, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

/**
 * getProperty utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getProperty.
 */
export function getProperty<T>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.')
  let result: unknown = obj

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return defaultValue
    }
  }

  return result as T
}

/**
 * setProperty utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of setProperty.
 */
export function setProperty<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')
  const lastKey = keys.pop()

  if (!lastKey) {
    return obj
  }

  let current: Record<string, unknown> = obj as Record<string, unknown>

  for (const key of keys) {
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[lastKey] = value
  return obj
}

/**
 * deleteProperty utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deleteProperty.
 */
export function deleteProperty<T extends object>(obj: T, path: string): T {
  const keys = path.split('.')
  const lastKey = keys.pop()

  if (!lastKey) {
    return obj
  }

  let current: Record<string, unknown> = obj as Record<string, unknown>

  for (const key of keys) {
    if (!(key in current) || !isObject(current[key])) {
      return obj
    }
    current = current[key] as Record<string, unknown>
  }

  delete current[lastKey]
  return obj
}

/**
 * mapKeys utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of mapKeys.
 */
export function mapKeys<T extends object>(
  obj: T,
  fn: (key: string, value: unknown) => string
): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[fn(key, value)] = value
      return acc
    },
    {} as Record<string, unknown>
  )
}

/**
 * mapValues utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of mapValues.
 */
export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[key as keyof T] = fn(value as T[keyof T], key as keyof T)
      return acc
    },
    {} as Record<keyof T, R>
  )
}

/**
 * filterKeys utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of filterKeys.
 */
export function filterKeys<T extends object>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean
): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (predicate(key as keyof T, value as T[keyof T])) {
      acc[key as keyof T] = value as T[keyof T]
    }
    return acc
  }, {} as Partial<T>)
}

/**
 * invert utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of invert.
 */
export function invert<T extends Record<string, string | number>>(obj: T): Record<string, string> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[String(value)] = key
      return acc
    },
    {} as Record<string, string>
  )
}

/**
 * flatten utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of flatten.
 */
export function flatten(obj: object, prefix = ''): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key

      if (isObject(value)) {
        Object.assign(acc, flatten(value as object, newKey))
      } else {
        acc[newKey] = value
      }

      return acc
    },
    {} as Record<string, unknown>
  )
}

/**
 * unflatten utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of unflatten.
 */
export function unflatten(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  Object.entries(obj).forEach(([key, value]) => {
    setProperty(result, key, value)
  })

  return result
}

/**
 * freeze utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of freeze.
 */
export function freeze<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(obj)
}

/**
 * deepFreeze utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deepFreeze.
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj)

  Object.values(obj).forEach((value) => {
    if (isObject(value)) {
      deepFreeze(value)
    }
  })

  return obj as Readonly<T>
}

/**
 * isDeepEqual utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isDeepEqual.
 */
export function isDeepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (!isObject(obj1) || !isObject(obj2)) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every((key) => {
    return isDeepEqual(obj1[key], obj2[key])
  })
}

/**
 * merge utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of merge.
 */
export function merge<T extends object>(...objects: Partial<T>[]): T {
  return Object.assign({}, ...objects) as T
}

/**
 * cloneShallow utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of cloneShallow.
 */
export function cloneShallow<T extends object>(obj: T): T {
  return { ...obj }
}

/**
 * keys utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of keys.
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

/**
 * values utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of values.
 */
export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj)
}

/**
 * entries utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of entries.
 */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

/**
 * fromEntries utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of fromEntries.
 */
export function fromEntries<K extends string | number | symbol, V>(
  entries: [K, V][]
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>
}

/**
 * compact utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of compact.
 */
export function compact<T extends object>(obj: T): Partial<T> {
  return filterKeys(obj, (_, value) => value !== null && value !== undefined)
}

/**
 * defaults utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of defaults.
 */
export function defaults<T extends object>(obj: T, ...defaults: Partial<T>[]): T {
  return deepMerge({} as T, ...defaults, obj)
}

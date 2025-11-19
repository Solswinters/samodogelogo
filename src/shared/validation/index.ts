/**
 * Validation utilities with type safety
 */

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function isUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

export function isTransactionHash(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(value)
}

export function isEmpty(value: unknown): boolean {
  if (isNullOrUndefined(value)) {
    return true
  }

  if (isString(value) || isArray(value)) {
    return value.length === 0
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0
  }

  return false
}

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function hasMinLength(value: string | unknown[], min: number): boolean {
  return value.length >= min
}

export function hasMaxLength(value: string | unknown[], max: number): boolean {
  return value.length <= max
}

export function matches(value: string, pattern: RegExp): boolean {
  return pattern.test(value)
}

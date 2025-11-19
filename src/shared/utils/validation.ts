/**
 * Shared validation utilities
 */

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isValidHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && !Number.isNaN(value)
}

export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && !Number.isNaN(value)
}

export function isValidChainId(chainId: unknown): chainId is number {
  return typeof chainId === 'number' && chainId > 0 && Number.isInteger(chainId)
}

export function isValidScore(score: unknown): score is number {
  return typeof score === 'number' && score >= 0 && Number.isFinite(score)
}

export function isValidTimestamp(timestamp: unknown): timestamp is number {
  return (
    typeof timestamp === 'number' &&
    timestamp > 0 &&
    Number.isInteger(timestamp) &&
    timestamp <= Date.now() + 1000 * 60 * 60 * 24 * 365 * 10 // Not more than 10 years in future
  )
}

export function isNotEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
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

export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return isObject(obj) && key in obj
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

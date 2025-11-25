/**
 * String manipulation utilities
 */

/**
 * capitalize utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of capitalize.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * capitalizeWords utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of capitalizeWords.
 */
export function capitalizeWords(str: string): string {
  return str.split(' ').map(capitalize).join(' ')
}

/**
 * camelCase utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of camelCase.
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_: string, char?: string) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char: string) => char.toLowerCase())
}

/**
 * snakeCase utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of snakeCase.
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
}

/**
 * kebabCase utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of kebabCase.
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

/**
 * truncate utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of truncate.
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) {
    return str
  }
  return str.substring(0, length - suffix.length) + suffix
}

/**
 * stripHtml utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of stripHtml.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * escapeHtml utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of escapeHtml.
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * slugify utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of slugify.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * randomString utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of randomString.
 */
export function randomString(length: number, charset?: string): string {
  const chars = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Pad a string to a certain length with a character
 */
export function pad(str: string, length: number, char = ' '): string {
  if (str.length >= length) {
    return str
  }
  const padding = char.repeat(length - str.length)
  return padding + str
}

/**
 * Pad a string to the right
 */
export function padEnd(str: string, length: number, char = ' '): string {
  if (str.length >= length) {
    return str
  }
  const padding = char.repeat(length - str.length)
  return str + padding
}

/**
 * Remove leading whitespace
 */
export function trimStart(str: string): string {
  return str.replace(/^\s+/, '')
}

/**
 * Remove trailing whitespace
 */
export function trimEnd(str: string): string {
  return str.replace(/\s+$/, '')
}

/**
 * Check if a string contains another string (case insensitive)
 */
export function containsIgnoreCase(str: string, search: string): boolean {
  return str.toLowerCase().includes(search.toLowerCase())
}

/**
 * Replace all occurrences of a string
 */
export function replaceAll(str: string, search: string, replace: string): string {
  return str.split(search).join(replace)
}

/**
 * Reverse a string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('')
}

/**
 * Check if a string is a palindrome
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '')
  return cleaned === reverse(cleaned)
}

/**
 * Count occurrences of a substring
 */
export function countOccurrences(str: string, search: string): number {
  if (!search) {
    return 0
  }
  return str.split(search).length - 1
}

/**
 * Extract numbers from a string
 */
export function extractNumbers(str: string): number[] {
  const matches = str.match(/-?\d+\.?\d*/g)
  return matches ? matches.map(Number) : []
}

/**
 * Abbreviate a string with ellipsis in the middle
 */
export function abbreviate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str
  }

  const ellipsis = '...'
  const charsToShow = maxLength - ellipsis.length
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return str.substring(0, frontChars) + ellipsis + str.substring(str.length - backChars)
}

/**
 * Convert string to title case
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Remove extra spaces from a string
 */
export function normalizeSpaces(str: string): string {
  return str.replace(/\s+/g, ' ').trim()
}

/**
 * Check if a string starts with any of the given prefixes
 */
export function startsWithAny(str: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => str.startsWith(prefix))
}

/**
 * Check if a string ends with any of the given suffixes
 */
export function endsWithAny(str: string, suffixes: string[]): boolean {
  return suffixes.some((suffix) => str.endsWith(suffix))
}

/**
 * Mask a string by replacing characters with a mask character
 */
export function mask(str: string, start: number, end: number, maskChar = '*'): string {
  if (start < 0 || end > str.length || start >= end) {
    return str
  }

  const masked = maskChar.repeat(end - start)
  return str.substring(0, start) + masked + str.substring(end)
}

/**
 * Generate a UUID v4
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

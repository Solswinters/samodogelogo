/**
 * Cryptographic utilities
 */

/**
 * hashString utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of hashString.
 */
export async function hashString(input: string): Promise<string> {
  if (typeof window === 'undefined') {
    return input
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * generateRandomId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateRandomId.
 */
export function generateRandomId(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * generateUUID utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateUUID.
 */
export function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

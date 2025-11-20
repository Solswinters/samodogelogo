/**
 * Cryptographic hashing utilities
 */

export class HashUtils {
  /**
   * Generate SHA-256 hash of a string
   */
  static async sha256(message: string): Promise<string> {
    if (typeof window === 'undefined') {
      // Server-side (Node.js)
      const crypto = await import('crypto')
      return crypto.createHash('sha256').update(message).digest('hex')
    }

    // Client-side (Browser)
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Generate MD5 hash (for non-security purposes only)
   */
  static simpleMD5(message: string): string {
    // Simple hash for non-security purposes
    let hash = 0
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * Generate a random hash
   */
  static random(length = 32): string {
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  }

  /**
   * Generate UUID v4
   */
  static uuid(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }

    // Fallback UUID v4 generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * Hash a password (basic implementation for demo)
   */
  static async hashPassword(password: string, salt?: string): Promise<string> {
    const actualSalt = salt || this.random(16)
    const combined = password + actualSalt
    const hash = await this.sha256(combined)
    return `${actualSalt}:${hash}`
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, expectedHash] = hash.split(':')
    const combined = password + salt
    const actualHash = await this.sha256(combined)
    return actualHash === expectedHash
  }

  /**
   * Create a checksum for data integrity
   */
  static checksum(data: string): string {
    return this.simpleMD5(data)
  }
}

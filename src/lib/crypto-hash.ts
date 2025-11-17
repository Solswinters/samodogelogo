/**
 * Cryptographic hashing utilities (client-safe)
 */

export class CryptoHash {
  /**
   * Simple hash function (FNV-1a)
   */
  static fnv1a(str: string): string {
    let hash = 2166136261
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i)
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
    }
    return (hash >>> 0).toString(16)
  }

  /**
   * MurmurHash3 (32-bit)
   */
  static murmur3(str: string, seed = 0): string {
    let h1 = seed
    const c1 = 0xcc9e2d51
    const c2 = 0x1b873593

    for (let i = 0; i < str.length; i++) {
      let k1 = str.charCodeAt(i)
      k1 = Math.imul(k1, c1)
      k1 = (k1 << 15) | (k1 >>> 17)
      k1 = Math.imul(k1, c2)

      h1 ^= k1
      h1 = (h1 << 13) | (h1 >>> 19)
      h1 = Math.imul(h1, 5) + 0xe6546b64
    }

    h1 ^= str.length
    h1 ^= h1 >>> 16
    h1 = Math.imul(h1, 0x85ebca6b)
    h1 ^= h1 >>> 13
    h1 = Math.imul(h1, 0xc2b2ae35)
    h1 ^= h1 >>> 16

    return (h1 >>> 0).toString(16).padStart(8, '0')
  }

  /**
   * DJB2 hash
   */
  static djb2(str: string): string {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i)
    }
    return (hash >>> 0).toString(16)
  }

  /**
   * SDBM hash
   */
  static sdbm(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
    }
    return (hash >>> 0).toString(16)
  }

  /**
   * Simple checksum
   */
  static checksum(str: string): string {
    let sum = 0
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i)
    }
    return (sum % 65536).toString(16).padStart(4, '0')
  }

  /**
   * Generate UUID v4 (pseudo-random)
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * Generate short ID (base62)
   */
  static shortId(length = 8): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Hash object to string
   */
  static hashObject(obj: unknown): string {
    const str = JSON.stringify(obj, Object.keys(obj as object).sort())
    return this.murmur3(str)
  }

  /**
   * Generate deterministic ID from string
   */
  static deterministicId(str: string): string {
    return this.murmur3(str, 42)
  }

  /**
   * Hash password (client-side, basic - use bcrypt server-side)
   */
  static simplePasswordHash(password: string, salt: string): string {
    return this.murmur3(password + salt, this.fnv1a(salt).charCodeAt(0))
  }

  /**
   * Generate random bytes (hex string)
   */
  static randomBytes(length: number): string {
    const bytes: number[] = []
    for (let i = 0; i < length; i++) {
      bytes.push(Math.floor(Math.random() * 256))
    }
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Generate nonce
   */
  static nonce(length = 16): string {
    return this.randomBytes(length)
  }

  /**
   * Hash with salt
   */
  static hashWithSalt(data: string, salt: string): string {
    return this.murmur3(data + salt)
  }

  /**
   * Verify hash
   */
  static verify(data: string, hash: string, salt?: string): boolean {
    const computed = salt ? this.hashWithSalt(data, salt) : this.murmur3(data)
    return computed === hash
  }

  /**
   * Content fingerprint (for cache busting)
   */
  static fingerprint(content: string): string {
    return this.murmur3(content).substring(0, 8)
  }

  /**
   * Generate session ID
   */
  static sessionId(): string {
    return `${Date.now()}-${this.shortId(12)}`
  }

  /**
   * Generate request ID
   */
  static requestId(): string {
    return `${Date.now()}-${this.randomBytes(8)}`
  }

  /**
   * Hash array consistently
   */
  static hashArray(arr: unknown[]): string {
    return this.murmur3(JSON.stringify(arr))
  }

  /**
   * Combine multiple hashes
   */
  static combineHashes(...hashes: string[]): string {
    return this.murmur3(hashes.join('-'))
  }
}

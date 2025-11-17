/**
 * Input sanitization utilities for security
 */

export class Sanitizer {
  /**
   * Sanitize HTML to prevent XSS
   */
  static html(input: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    }

    return input.replace(/[&<>"'/]/g, char => map[char] ?? char)
  }

  /**
   * Sanitize for SQL (basic - use parameterized queries instead)
   */
  static sql(input: string): string {
    return input.replace(/['";\\]/g, '\\$&')
  }

  /**
   * Sanitize for URL parameters
   */
  static url(input: string): string {
    return encodeURIComponent(input)
  }

  /**
   * Sanitize filename
   */
  static filename(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^[._-]+|[._-]+$/g, '')
      .substring(0, 255)
  }

  /**
   * Sanitize email address
   */
  static email(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._+-]/g, '')
  }

  /**
   * Sanitize username
   */
  static username(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '')
      .substring(0, 50)
  }

  /**
   * Sanitize phone number (keep digits only)
   */
  static phone(input: string): string {
    return input.replace(/\D/g, '')
  }

  /**
   * Remove null bytes
   */
  static removeNullBytes(input: string): string {
    return input.replace(/\0/g, '')
  }

  /**
   * Strip tags from HTML
   */
  static stripTags(input: string): string {
    return input.replace(/<[^>]*>/g, '')
  }

  /**
   * Trim whitespace and normalize spaces
   */
  static normalizeWhitespace(input: string): string {
    return input.trim().replace(/\s+/g, ' ')
  }

  /**
   * Sanitize for JSON
   */
  static json(input: string): string {
    return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
  }

  /**
   * Sanitize Base64
   */
  static base64(input: string): string {
    return input.replace(/[^A-Za-z0-9+/=]/g, '')
  }

  /**
   * Sanitize hex string
   */
  static hex(input: string): string {
    return input.toLowerCase().replace(/[^0-9a-f]/g, '')
  }

  /**
   * Sanitize integer
   */
  static integer(input: string): string {
    return input.replace(/[^0-9-]/g, '').replace(/(?!^)-/g, '')
  }

  /**
   * Sanitize float/decimal
   */
  static float(input: string): string {
    return input
      .replace(/[^0-9.-]/g, '')
      .replace(/(?!^)-/g, '')
      .replace(/(\..*)\./g, '$1')
  }

  /**
   * Sanitize boolean (convert to actual boolean)
   */
  static boolean(input: string): boolean {
    const normalized = input.toLowerCase().trim()
    return ['true', '1', 'yes', 'y'].includes(normalized)
  }

  /**
   * Sanitize array (remove empty values)
   */
  static array<T>(input: T[]): T[] {
    return input.filter(item => item !== null && item !== undefined && item !== '')
  }

  /**
   * Sanitize object (remove null/undefined values)
   */
  static object<T extends Record<string, unknown>>(input: T): Partial<T> {
    const result: Partial<T> = {}

    for (const [key, value] of Object.entries(input)) {
      if (value !== null && value !== undefined) {
        result[key as keyof T] = value as T[keyof T]
      }
    }

    return result
  }

  /**
   * Sanitize wallet address (Ethereum format)
   */
  static walletAddress(input: string): string {
    const cleaned = input.trim().toLowerCase()
    if (cleaned.startsWith('0x')) {
      return '0x' + this.hex(cleaned.slice(2)).substring(0, 40)
    }
    return '0x' + this.hex(cleaned).substring(0, 40)
  }

  /**
   * Sanitize transaction hash
   */
  static txHash(input: string): string {
    const cleaned = input.trim().toLowerCase()
    if (cleaned.startsWith('0x')) {
      return '0x' + this.hex(cleaned.slice(2)).substring(0, 64)
    }
    return '0x' + this.hex(cleaned).substring(0, 64)
  }
}

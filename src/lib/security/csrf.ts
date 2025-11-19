/**
 * CSRF protection utilities
 */

import { randomBytes } from 'crypto'

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false
  if (token.length !== expectedToken.length) return false

  // Constant-time comparison to prevent timing attacks
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
  }

  return result === 0
}

/**
 * CSRF token manager for client-side
 */
export class CSRFTokenManager {
  private static readonly TOKEN_KEY = 'csrf-token'
  private static readonly TOKEN_HEADER = 'X-CSRF-Token'

  /**
   * Get CSRF token from storage
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Set CSRF token in storage
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(this.TOKEN_KEY, token)
  }

  /**
   * Remove CSRF token from storage
   */
  static removeToken(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(this.TOKEN_KEY)
  }

  /**
   * Get CSRF token header name
   */
  static getHeaderName(): string {
    return this.TOKEN_HEADER
  }

  /**
   * Add CSRF token to request headers
   */
  static addToHeaders(headers: Headers): Headers {
    const token = this.getToken()
    if (token) {
      headers.set(this.TOKEN_HEADER, token)
    }
    return headers
  }

  /**
   * Fetch CSRF token from server
   */
  static async fetchToken(): Promise<string> {
    const response = await fetch('/api/csrf-token')
    const data = await response.json()
    const token = data.token

    if (token) {
      this.setToken(token)
    }

    return token
  }

  /**
   * Initialize CSRF token
   */
  static async initialize(): Promise<void> {
    if (!this.getToken()) {
      await this.fetchToken()
    }
  }
}

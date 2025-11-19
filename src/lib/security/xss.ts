/**
 * XSS protection utilities
 */

/**
 * Content Security Policy configuration
 */
export interface CSPConfig {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'font-src'?: string[]
  'connect-src'?: string[]
  'frame-src'?: string[]
  'object-src'?: string[]
  'media-src'?: string[]
  'worker-src'?: string[]
  'child-src'?: string[]
  'form-action'?: string[]
  'frame-ancestors'?: string[]
  'base-uri'?: string[]
  'manifest-src'?: string[]
}

/**
 * Generate Content Security Policy header
 */
export function generateCSPHeader(config: CSPConfig): string {
  return Object.entries(config)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

/**
 * Default CSP configuration
 */
export const defaultCSPConfig: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
}

/**
 * Sanitize attribute value
 */
export function sanitizeAttribute(value: string): string {
  return value
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Validate and sanitize event handler attributes
 */
export function sanitizeEventHandler(handler: string): string {
  // Remove any potential XSS vectors in event handlers
  const dangerous = ['javascript:', 'data:', 'vbscript:', 'on', 'eval', 'expression']

  const sanitized = handler.toLowerCase()
  for (const term of dangerous) {
    if (sanitized.includes(term)) {
      return ''
    }
  }

  return handler
}

/**
 * Validate data URI
 */
export function isValidDataURI(uri: string): boolean {
  const dataURIPattern = /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)*)?;base64,/i
  return dataURIPattern.test(uri)
}

/**
 * Sanitize CSS value
 */
export function sanitizeCSS(css: string): string {
  // Remove potentially dangerous CSS expressions
  return css
    .replace(/javascript:/gi, '')
    .replace(/expression\(/gi, '')
    .replace(/import/gi, '')
    .replace(/behavior:/gi, '')
    .replace(/@import/gi, '')
}

/**
 * Create nonce for inline scripts/styles
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }

  // Fallback for server-side
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

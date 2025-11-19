/**
 * CSRF protection utilities
 */

export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function storeCSRFToken(token: string) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('csrf_token', token)
  }
}

export function getCSRFToken(): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem('csrf_token')
  }
  return null
}

export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken()
  return storedToken !== null && storedToken === token
}

export function addCSRFHeader(headers: Headers) {
  const token = getCSRFToken()
  if (token) {
    headers.set('X-CSRF-Token', token)
  }
  return headers
}

/**
 * Input sanitization utilities
 */

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

export function sanitizeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url)

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol')
    }

    return parsed.toString()
  } catch {
    return ''
  }
}

export function sanitizeAddress(address: string): string {
  // Ethereum address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address')
  }
  return address.toLowerCase()
}

export function sanitizeNumber(
  input: string | number,
  options?: {
    min?: number
    max?: number
    integer?: boolean
  }
): number {
  const num = typeof input === 'string' ? parseFloat(input) : input

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number')
  }

  if (options?.integer && !Number.isInteger(num)) {
    throw new Error('Must be an integer')
  }

  if (options?.min !== undefined && num < options.min) {
    throw new Error(`Must be at least ${options.min}`)
  }

  if (options?.max !== undefined && num > options.max) {
    throw new Error(`Must be at most ${options.max}`)
  }

  return num
}

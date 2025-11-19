/**
 * Input sanitization utilities for security
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Escape HTML special characters
 */
export function escapeHTML(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return str.replace(/[&<>"'/]/g, char => map[char])
}

/**
 * Remove script tags from string
 */
export function removeScriptTags(str: string): string {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

/**
 * Sanitize URL to prevent javascript: protocol
 */
export function sanitizeURL(url: string): string {
  const protocols = ['javascript:', 'data:', 'vbscript:']
  const lower = url.toLowerCase().trim()

  for (const protocol of protocols) {
    if (lower.startsWith(protocol)) {
      return '#'
    }
  }

  return url
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255)
}

/**
 * Sanitize user input for SQL-like queries
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
}

/**
 * Remove null bytes
 */
export function removeNullBytes(str: string): string {
  return str.replace(/\0/g, '')
}

/**
 * Sanitize JSON string
 */
export function sanitizeJSON(json: string): string {
  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  } catch {
    return '{}'
  }
}

/**
 * Strip HTML tags
 */
export function stripHTMLTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '')
}

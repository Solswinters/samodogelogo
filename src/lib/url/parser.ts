/**
 * URL parsing and manipulation utilities
 */

export class URLParser {
  /**
   * Parse URL query string into object
   */
  static parseQuery(url: string): Record<string, string> {
    const params = new URLSearchParams(url.split('?')[1] || '')
    const result: Record<string, string> = {}
    params.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  /**
   * Build query string from object
   */
  static buildQuery(params: Record<string, string | number | boolean>): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })
    return searchParams.toString()
  }

  /**
   * Add query parameters to URL
   */
  static addQueryParams(url: string, params: Record<string, string | number | boolean>): string {
    const [base, existingQuery] = url.split('?')
    const existing = this.parseQuery(existingQuery || '')
    const merged = { ...existing, ...params }
    const query = this.buildQuery(merged)
    return query ? `${base}?${query}` : base
  }

  /**
   * Remove query parameters from URL
   */
  static removeQueryParams(url: string, keys: string[]): string {
    const [base, existingQuery] = url.split('?')
    const existing = this.parseQuery(existingQuery || '')
    keys.forEach((key) => delete existing[key])
    const query = this.buildQuery(existing)
    return query ? `${base}?${query}` : base
  }

  /**
   * Get domain from URL
   */
  static getDomain(url: string): string {
    try {
      const parsed = new URL(url)
      return parsed.hostname
    } catch {
      return ''
    }
  }

  /**
   * Get path from URL
   */
  static getPath(url: string): string {
    try {
      const parsed = new URL(url)
      return parsed.pathname
    } catch {
      return ''
    }
  }

  /**
   * Check if URL is absolute
   */
  static isAbsolute(url: string): boolean {
    return /^https?:\/\//i.test(url)
  }

  /**
   * Check if URL is relative
   */
  static isRelative(url: string): boolean {
    return !this.isAbsolute(url)
  }

  /**
   * Join URL paths
   */
  static joinPaths(...paths: string[]): string {
    return paths
      .map((path, index) => {
        if (index === 0) {
          return path.replace(/\/+$/, '')
        }
        return path.replace(/^\/+/, '').replace(/\/+$/, '')
      })
      .filter(Boolean)
      .join('/')
  }

  /**
   * Validate URL
   */
  static isValid(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Normalize URL (remove trailing slash, lowercase domain)
   */
  static normalize(url: string): string {
    try {
      const parsed = new URL(url)
      parsed.hostname = parsed.hostname.toLowerCase()
      parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/'
      return parsed.toString()
    } catch {
      return url
    }
  }

  /**
   * Get URL hash (fragment)
   */
  static getHash(url: string): string {
    try {
      const parsed = new URL(url)
      return parsed.hash.replace(/^#/, '')
    } catch {
      return ''
    }
  }

  /**
   * Set URL hash (fragment)
   */
  static setHash(url: string, hash: string): string {
    try {
      const parsed = new URL(url)
      parsed.hash = hash
      return parsed.toString()
    } catch {
      return url
    }
  }
}

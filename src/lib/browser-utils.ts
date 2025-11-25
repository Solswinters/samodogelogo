/**
 * Browser detection and manipulation utilities
 */

/**
 * getBrowserInfo utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getBrowserInfo.
 */
export function getBrowserInfo(): {
  name: string
  version: string
  os: string
} {
  if (typeof window === 'undefined' || !window.navigator) {
    return { name: 'unknown', version: 'unknown', os: 'unknown' }
  }

  const ua = window.navigator.userAgent
  let name = 'unknown'
  let version = 'unknown'
  let os = 'unknown'

  if (ua.includes('Firefox/')) {
    name = 'Firefox'
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] ?? 'unknown'
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome'
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] ?? 'unknown'
  } else if (ua.includes('Safari/')) {
    name = 'Safari'
    version = ua.match(/Version\/([\d.]+)/)?.[1] ?? 'unknown'
  }

  if (ua.includes('Windows')) {
    os = 'Windows'
  } else if (ua.includes('Mac')) {
    os = 'macOS'
  } else if (ua.includes('Linux')) {
    os = 'Linux'
  } else if (ua.includes('Android')) {
    os = 'Android'
  } else if (ua.includes('iOS')) {
    os = 'iOS'
  }

  return { name, version, os }
}

/**
 * copyToClipboard utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of copyToClipboard.
 */
export function copyToClipboard(text: string): Promise<void> {
  if (typeof window === 'undefined' || !window.navigator.clipboard) {
    return Promise.reject(new Error('Clipboard API not available'))
  }

  return window.navigator.clipboard.writeText(text)
}

/**
 * getScreenSize utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getScreenSize.
 */
export function getScreenSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * isOnline utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isOnline.
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined' || !window.navigator) {
    return true
  }

  return window.navigator.onLine
}

/**
 * getDeviceType utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getDeviceType.
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop'
  }

  const width = window.innerWidth

  if (width < 768) {
    return 'mobile'
  }
  if (width < 1024) {
    return 'tablet'
  }
  return 'desktop'
}

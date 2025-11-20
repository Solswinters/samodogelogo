/**
 * Browser detection and capability utilities
 */

export const browser = {
  /**
   * Check if code is running in browser
   */
  isBrowser: typeof window !== 'undefined',

  /**
   * Check if running on mobile device
   */
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  },

  /**
   * Check if running on iOS
   */
  isIOS: (): boolean => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  },

  /**
   * Check if running on Android
   */
  isAndroid: (): boolean => {
    if (typeof window === 'undefined') return false
    return /Android/.test(navigator.userAgent)
  },

  /**
   * Check if running in Safari
   */
  isSafari: (): boolean => {
    if (typeof window === 'undefined') return false
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  },

  /**
   * Check if running in Chrome
   */
  isChrome: (): boolean => {
    if (typeof window === 'undefined') return false
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  },

  /**
   * Check if running in Firefox
   */
  isFirefox: (): boolean => {
    if (typeof window === 'undefined') return false
    return /Firefox/.test(navigator.userAgent)
  },

  /**
   * Check if browser supports touch events
   */
  supportsTouch: (): boolean => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  },

  /**
   * Check if browser supports Web3
   */
  supportsWeb3: (): boolean => {
    if (typeof window === 'undefined') return false
    return 'ethereum' in window
  },

  /**
   * Check if browser supports WebGL
   */
  supportsWebGL: (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch (e) {
      return false
    }
  },

  /**
   * Check if browser supports localStorage
   */
  supportsLocalStorage: (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      const test = '__test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  },

  /**
   * Check if browser supports service workers
   */
  supportsServiceWorker: (): boolean => {
    if (typeof window === 'undefined') return false
    return 'serviceWorker' in navigator
  },

  /**
   * Get browser name
   */
  getName: (): string => {
    if (typeof window === 'undefined') return 'unknown'
    const { userAgent } = navigator

    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera'

    return 'unknown'
  },

  /**
   * Get browser version
   */
  getVersion: (): string => {
    if (typeof window === 'undefined') return 'unknown'
    const { userAgent } = navigator
    const match = userAgent.match(/(firefox|chrome|safari|opera|edge)\/?\s*(\d+)/i)
    return match ? match[2] : 'unknown'
  },

  /**
   * Check if browser is online
   */
  isOnline: (): boolean => {
    if (typeof window === 'undefined') return true
    return navigator.onLine
  },

  /**
   * Get connection type
   */
  getConnectionType: (): string => {
    if (typeof window === 'undefined') return 'unknown'
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection
    return connection?.effectiveType || 'unknown'
  },
}

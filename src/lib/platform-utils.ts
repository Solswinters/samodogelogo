/**
 * Platform detection utilities
 */

export class PlatformUtils {
  private static ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''

  static isIOS(): boolean {
    return /iphone|ipad|ipod/.test(this.ua)
  }

  static isAndroid(): boolean {
    return /android/.test(this.ua)
  }

  static isMobile(): boolean {
    return this.isIOS() || this.isAndroid() || /mobile/.test(this.ua)
  }

  static isTablet(): boolean {
    return /ipad|android(?!.*mobile)/.test(this.ua)
  }

  static isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet()
  }

  static isChrome(): boolean {
    return /chrome/.test(this.ua) && !/edge|edg/.test(this.ua)
  }

  static isFirefox(): boolean {
    return /firefox/.test(this.ua)
  }

  static isSafari(): boolean {
    return /safari/.test(this.ua) && !/chrome|chromium/.test(this.ua)
  }

  static isEdge(): boolean {
    return /edge|edg/.test(this.ua)
  }

  static getOS(): string {
    if (this.isIOS()) {
      return 'iOS'
    }
    if (this.isAndroid()) {
      return 'Android'
    }
    if (/mac/.test(this.ua)) {
      return 'macOS'
    }
    if (/win/.test(this.ua)) {
      return 'Windows'
    }
    if (/linux/.test(this.ua)) {
      return 'Linux'
    }
    return 'Unknown'
  }

  static getTouchSupport(): boolean {
    return (
      typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    )
  }

  static getScreenSize(): { width: number; height: number } {
    return {
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    }
  }

  static getBrowser(): string {
    if (this.isChrome()) {
      return 'Chrome'
    }
    if (this.isFirefox()) {
      return 'Firefox'
    }
    if (this.isSafari()) {
      return 'Safari'
    }
    if (this.isEdge()) {
      return 'Edge'
    }
    return 'Unknown'
  }

  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) {
      return 'mobile'
    }
    if (this.isTablet()) {
      return 'tablet'
    }
    return 'desktop'
  }

  static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  static getLanguage(): string {
    return typeof navigator !== 'undefined' ? navigator.language : 'en-US'
  }

  static getLanguages(): readonly string[] {
    return typeof navigator !== 'undefined' ? navigator.languages : ['en-US']
  }

  static getCookiesEnabled(): boolean {
    return typeof navigator !== 'undefined' ? navigator.cookieEnabled : false
  }

  static getMaxTouchPoints(): number {
    return typeof navigator !== 'undefined' ? navigator.maxTouchPoints : 0
  }

  static getPlatform(): string {
    return typeof navigator !== 'undefined' ? navigator.platform : 'Unknown'
  }

  static isRetina(): boolean {
    return typeof window !== 'undefined' ? window.devicePixelRatio > 1 : false
  }

  static getPixelRatio(): number {
    return typeof window !== 'undefined' ? window.devicePixelRatio : 1
  }

  static getViewport(): { width: number; height: number } {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 }
    }

    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    }
  }

  static isPortrait(): boolean {
    const { width, height } = this.getScreenSize()
    return height > width
  }

  static isLandscape(): boolean {
    return !this.isPortrait()
  }

  static getOrientation(): 'portrait' | 'landscape' {
    return this.isPortrait() ? 'portrait' : 'landscape'
  }

  static isMac(): boolean {
    return /mac/.test(this.ua)
  }

  static isWindows(): boolean {
    return /win/.test(this.ua)
  }

  static isLinux(): boolean {
    return /linux/.test(this.ua) && !this.isAndroid()
  }

  static isWebView(): boolean {
    return /wv|webview/.test(this.ua)
  }

  static isPWA(): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
  }

  static supportsWebGL(): boolean {
    if (typeof document === 'undefined') {
      return false
    }

    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {
      return false
    }
  }

  static supportsWebWorkers(): boolean {
    return typeof Worker !== 'undefined'
  }

  static supportsServiceWorkers(): boolean {
    return typeof navigator !== 'undefined' && 'serviceWorker' in navigator
  }

  static supportsLocalStorage(): boolean {
    try {
      const test = '__test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  static supportsSessionStorage(): boolean {
    try {
      const test = '__test__'
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  static getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  static getTimezoneOffset(): number {
    return new Date().getTimezoneOffset()
  }
}

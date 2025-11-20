/**
 * Device detection and information utilities
 */

export const device = {
  /**
   * Get device pixel ratio
   */
  getPixelRatio: (): number => {
    if (typeof window === 'undefined') return 1
    return window.devicePixelRatio || 1
  },

  /**
   * Get screen dimensions
   */
  getScreenSize: (): { width: number; height: number } => {
    if (typeof window === 'undefined') return { width: 0, height: 0 }
    return {
      width: window.screen.width,
      height: window.screen.height,
    }
  },

  /**
   * Get viewport dimensions
   */
  getViewportSize: (): { width: number; height: number } => {
    if (typeof window === 'undefined') return { width: 0, height: 0 }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  },

  /**
   * Check if device is in portrait mode
   */
  isPortrait: (): boolean => {
    if (typeof window === 'undefined') return true
    return window.innerHeight > window.innerWidth
  },

  /**
   * Check if device is in landscape mode
   */
  isLandscape: (): boolean => {
    return !device.isPortrait()
  },

  /**
   * Get device orientation
   */
  getOrientation: (): 'portrait' | 'landscape' => {
    return device.isPortrait() ? 'portrait' : 'landscape'
  },

  /**
   * Check if device has retina display
   */
  hasRetinaDisplay: (): boolean => {
    return device.getPixelRatio() >= 2
  },

  /**
   * Get device memory (GB)
   */
  getMemory: (): number => {
    if (typeof window === 'undefined') return 0
    return (navigator as any).deviceMemory || 0
  },

  /**
   * Get number of logical CPU cores
   */
  getCPUCores: (): number => {
    if (typeof window === 'undefined') return 0
    return navigator.hardwareConcurrency || 0
  },

  /**
   * Get device platform
   */
  getPlatform: (): string => {
    if (typeof window === 'undefined') return 'unknown'
    return navigator.platform || 'unknown'
  },

  /**
   * Get preferred color scheme
   */
  getPreferredColorScheme: (): 'light' | 'dark' | 'no-preference' => {
    if (typeof window === 'undefined') return 'no-preference'
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    return 'no-preference'
  },

  /**
   * Check if device prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * Get battery level (0-1)
   */
  getBatteryLevel: async (): Promise<number> => {
    if (typeof window === 'undefined' || !(navigator as any).getBattery) {
      return 1
    }
    try {
      const battery = await (navigator as any).getBattery()
      return battery.level
    } catch {
      return 1
    }
  },

  /**
   * Check if device is charging
   */
  isCharging: async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !(navigator as any).getBattery) {
      return false
    }
    try {
      const battery = await (navigator as any).getBattery()
      return battery.charging
    } catch {
      return false
    }
  },
}

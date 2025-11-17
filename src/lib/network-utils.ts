/**
 * Network and connectivity utilities
 */

export class NetworkUtils {
  /**
   * Check if browser is online
   */
  static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  /**
   * Get connection type
   */
  static getConnectionType(): string {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return 'unknown'
    }

    const connection = (navigator as { connection?: { effectiveType?: string } }).connection
    return connection?.effectiveType ?? 'unknown'
  }

  /**
   * Check if connection is slow
   */
  static isSlowConnection(): boolean {
    const type = this.getConnectionType()
    return type === 'slow-2g' || type === '2g'
  }

  /**
   * Listen for online/offline events
   */
  static onConnectivityChange(callback: (isOnline: boolean) => void): () => void {
    if (typeof window === 'undefined') {return () => {}}

    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  /**
   * Ping a URL to check connectivity
   */
  static async ping(url: string, timeout = 5000): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return true
    } catch {
      return false
    }
  }
}

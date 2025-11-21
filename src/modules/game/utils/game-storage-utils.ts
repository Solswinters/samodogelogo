/**
 * Storage utility functions for game data persistence
 * Handles localStorage and sessionStorage with type safety
 */

export class GameStorageUtils {
  private static readonly PREFIX = 'samodogelogo_'

  /**
   * Save data to localStorage
   */
  static save<T>(key: string, data: T): boolean {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(this.PREFIX + key, serialized)
      return true
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      return false
    }
  }

  /**
   * Load data from localStorage
   */
  static load<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(this.PREFIX + key)
      if (serialized === null) return null
      return JSON.parse(serialized) as T
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      return null
    }
  }

  /**
   * Remove data from localStorage
   */
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(this.PREFIX + key)
      return true
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
      return false
    }
  }

  /**
   * Check if key exists in localStorage
   */
  static exists(key: string): boolean {
    return localStorage.getItem(this.PREFIX + key) !== null
  }

  /**
   * Clear all game data from localStorage
   */
  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  /**
   * Get all keys with the game prefix
   */
  static getAllKeys(): string[] {
    const keys = Object.keys(localStorage)
    return keys
      .filter((key) => key.startsWith(this.PREFIX))
      .map((key) => key.replace(this.PREFIX, ''))
  }

  /**
   * Save data to sessionStorage
   */
  static saveSession<T>(key: string, data: T): boolean {
    try {
      const serialized = JSON.stringify(data)
      sessionStorage.setItem(this.PREFIX + key, serialized)
      return true
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error)
      return false
    }
  }

  /**
   * Load data from sessionStorage
   */
  static loadSession<T>(key: string): T | null {
    try {
      const serialized = sessionStorage.getItem(this.PREFIX + key)
      if (serialized === null) return null
      return JSON.parse(serialized) as T
    } catch (error) {
      console.error('Failed to load from sessionStorage:', error)
      return null
    }
  }

  /**
   * Remove data from sessionStorage
   */
  static removeSession(key: string): boolean {
    try {
      sessionStorage.removeItem(this.PREFIX + key)
      return true
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error)
      return false
    }
  }

  /**
   * Clear all session data
   */
  static clearSession(): boolean {
    try {
      const keys = Object.keys(sessionStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          sessionStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error)
      return false
    }
  }

  /**
   * Get storage size in bytes
   */
  static getStorageSize(): number {
    let size = 0
    const keys = Object.keys(localStorage)

    keys.forEach((key) => {
      if (key.startsWith(this.PREFIX)) {
        const value = localStorage.getItem(key)
        if (value) {
          size += key.length + value.length
        }
      }
    })

    return size
  }

  /**
   * Get storage size in human-readable format
   */
  static getStorageSizeFormatted(): string {
    const bytes = this.getStorageSize()
    if (bytes < 1024) return `${bytes} bytes`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * Migrate data from old key to new key
   */
  static migrate(oldKey: string, newKey: string): boolean {
    try {
      const data = this.load(oldKey)
      if (data === null) return false

      this.save(newKey, data)
      this.remove(oldKey)
      return true
    } catch (error) {
      console.error('Failed to migrate data:', error)
      return false
    }
  }

  /**
   * Save with expiration time
   */
  static saveWithExpiry<T>(key: string, data: T, expiryMs: number): boolean {
    try {
      const item = {
        value: data,
        expiry: Date.now() + expiryMs,
      }
      return this.save(key, item)
    } catch (error) {
      console.error('Failed to save with expiry:', error)
      return false
    }
  }

  /**
   * Load data with expiry check
   */
  static loadWithExpiry<T>(key: string): T | null {
    try {
      const item = this.load<{ value: T; expiry: number }>(key)
      if (!item) return null

      if (Date.now() > item.expiry) {
        this.remove(key)
        return null
      }

      return item.value
    } catch (error) {
      console.error('Failed to load with expiry:', error)
      return null
    }
  }

  /**
   * Backup all game data to a JSON string
   */
  static backup(): string | null {
    try {
      const data: Record<string, any> = {}
      const keys = this.getAllKeys()

      keys.forEach((key) => {
        const value = this.load(key)
        if (value !== null) {
          data[key] = value
        }
      })

      return JSON.stringify(data)
    } catch (error) {
      console.error('Failed to backup data:', error)
      return null
    }
  }

  /**
   * Restore game data from a JSON string
   */
  static restore(backupData: string): boolean {
    try {
      const data = JSON.parse(backupData)

      Object.keys(data).forEach((key) => {
        this.save(key, data[key])
      })

      return true
    } catch (error) {
      console.error('Failed to restore data:', error)
      return false
    }
  }

  /**
   * Compress data before saving (basic compression)
   */
  static saveCompressed<T>(key: string, data: T): boolean {
    try {
      const serialized = JSON.stringify(data)
      // In a real implementation, use a compression library like lz-string
      // For now, just save normally
      return this.save(key, data)
    } catch (error) {
      console.error('Failed to save compressed data:', error)
      return false
    }
  }

  /**
   * Save multiple items at once
   */
  static saveBatch(items: Record<string, any>): boolean {
    try {
      Object.entries(items).forEach(([key, value]) => {
        this.save(key, value)
      })
      return true
    } catch (error) {
      console.error('Failed to save batch:', error)
      return false
    }
  }

  /**
   * Load multiple items at once
   */
  static loadBatch<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {}

    keys.forEach((key) => {
      result[key] = this.load<T>(key)
    })

    return result
  }

  /**
   * Subscribe to storage changes (cross-tab communication)
   */
  static subscribe(callback: (key: string, newValue: any, oldValue: any) => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(this.PREFIX)) {
        const key = e.key.replace(this.PREFIX, '')
        const newValue = e.newValue ? JSON.parse(e.newValue) : null
        const oldValue = e.oldValue ? JSON.parse(e.oldValue) : null
        callback(key, newValue, oldValue)
      }
    }

    window.addEventListener('storage', handler)

    return () => {
      window.removeEventListener('storage', handler)
    }
  }
}

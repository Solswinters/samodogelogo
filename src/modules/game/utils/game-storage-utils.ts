/**
 * Storage utilities for game data persistence
 * Provides safe localStorage/sessionStorage operations with encryption
 */

export interface StorageOptions {
  encrypt?: boolean
  expiresIn?: number // milliseconds
  namespace?: string
}

export interface StoredValue<T> {
  data: T
  timestamp: number
  expiresAt?: number
}

export class GameStorageUtils {
  private static readonly DEFAULT_NAMESPACE = 'samodogelogo'
  private static readonly ENCRYPTION_KEY = 'game_storage_key' // In production, use proper key management

  /**
   * Set item in localStorage
   */
  static set<T>(key: string, value: T, options: StorageOptions = {}): void {
    try {
      const namespacedKey = this.getNamespacedKey(key, options.namespace)

      const storedValue: StoredValue<T> = {
        data: value,
        timestamp: Date.now(),
        expiresAt: options.expiresIn ? Date.now() + options.expiresIn : undefined,
      }

      let serialized = JSON.stringify(storedValue)

      if (options.encrypt) {
        serialized = this.encrypt(serialized)
      }

      localStorage.setItem(namespacedKey, serialized)
    } catch (error) {
      console.error('Failed to set storage item:', error)
    }
  }

  /**
   * Get item from localStorage
   */
  static get<T>(key: string, options: StorageOptions = {}): T | null {
    try {
      const namespacedKey = this.getNamespacedKey(key, options.namespace)
      const item = localStorage.getItem(namespacedKey)

      if (!item) return null

      let serialized = item

      if (options.encrypt) {
        serialized = this.decrypt(serialized)
      }

      const storedValue: StoredValue<T> = JSON.parse(serialized)

      // Check expiration
      if (storedValue.expiresAt && Date.now() > storedValue.expiresAt) {
        this.remove(key, options)
        return null
      }

      return storedValue.data
    } catch (error) {
      console.error('Failed to get storage item:', error)
      return null
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: string, options: StorageOptions = {}): void {
    try {
      const namespacedKey = this.getNamespacedKey(key, options.namespace)
      localStorage.removeItem(namespacedKey)
    } catch (error) {
      console.error('Failed to remove storage item:', error)
    }
  }

  /**
   * Clear all items with namespace
   */
  static clear(namespace?: string): void {
    try {
      const prefix = this.getNamespacedKey('', namespace)

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          localStorage.removeItem(key)
        }
      }
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }

  /**
   * Check if key exists
   */
  static has(key: string, options: StorageOptions = {}): boolean {
    const namespacedKey = this.getNamespacedKey(key, options.namespace)
    return localStorage.getItem(namespacedKey) !== null
  }

  /**
   * Get all keys with namespace
   */
  static keys(namespace?: string): string[] {
    try {
      const prefix = this.getNamespacedKey('', namespace)
      const keys: string[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length))
        }
      }

      return keys
    } catch (error) {
      console.error('Failed to get storage keys:', error)
      return []
    }
  }

  /**
   * Get storage size in bytes
   */
  static getSize(): number {
    let size = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        size += key.length + (value?.length || 0)
      }
    }

    return size
  }

  /**
   * Session storage operations
   */
  static session = {
    set: <T>(key: string, value: T, options: StorageOptions = {}): void => {
      try {
        const namespacedKey = GameStorageUtils.getNamespacedKey(key, options.namespace)
        const serialized = JSON.stringify(value)
        sessionStorage.setItem(namespacedKey, serialized)
      } catch (error) {
        console.error('Failed to set session storage item:', error)
      }
    },

    get: <T>(key: string, options: StorageOptions = {}): T | null => {
      try {
        const namespacedKey = GameStorageUtils.getNamespacedKey(key, options.namespace)
        const item = sessionStorage.getItem(namespacedKey)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.error('Failed to get session storage item:', error)
        return null
      }
    },

    remove: (key: string, options: StorageOptions = {}): void => {
      const namespacedKey = GameStorageUtils.getNamespacedKey(key, options.namespace)
      sessionStorage.removeItem(namespacedKey)
    },

    clear: (namespace?: string): void => {
      const prefix = GameStorageUtils.getNamespacedKey('', namespace)

      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith(prefix)) {
          sessionStorage.removeItem(key)
        }
      }
    },
  }

  /**
   * Get namespaced key
   */
  private static getNamespacedKey(key: string, namespace?: string): string {
    const ns = namespace || this.DEFAULT_NAMESPACE
    return `${ns}:${key}`
  }

  /**
   * Simple encryption (Base64 + XOR)
   * Note: This is NOT secure encryption, just obfuscation
   * For production, use proper encryption libraries
   */
  private static encrypt(text: string): string {
    const key = this.ENCRYPTION_KEY
    let encrypted = ''

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      encrypted += String.fromCharCode(charCode)
    }

    return btoa(encrypted)
  }

  /**
   * Simple decryption (Base64 + XOR)
   */
  private static decrypt(encrypted: string): string {
    const key = this.ENCRYPTION_KEY
    const decoded = atob(encrypted)
    let decrypted = ''

    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      decrypted += String.fromCharCode(charCode)
    }

    return decrypted
  }

  /**
   * Save game state
   */
  static saveGameState(slotId: string, state: any): void {
    this.set(`game_save_${slotId}`, state, {
      namespace: 'saves',
      encrypt: true,
    })
  }

  /**
   * Load game state
   */
  static loadGameState(slotId: string): any | null {
    return this.get(`game_save_${slotId}`, {
      namespace: 'saves',
      encrypt: true,
    })
  }

  /**
   * Get all save slots
   */
  static getSaveSlots(): string[] {
    return this.keys('saves')
      .filter((key) => key.startsWith('game_save_'))
      .map((key) => key.replace('game_save_', ''))
  }

  /**
   * Delete save slot
   */
  static deleteSaveSlot(slotId: string): void {
    this.remove(`game_save_${slotId}`, { namespace: 'saves' })
  }

  /**
   * Save player preferences
   */
  static savePreferences(prefs: any): void {
    this.set('preferences', prefs)
  }

  /**
   * Load player preferences
   */
  static loadPreferences(): any | null {
    return this.get('preferences')
  }

  /**
   * Save high score
   */
  static saveHighScore(score: number): void {
    const currentHighScore = this.getHighScore()
    if (score > currentHighScore) {
      this.set('high_score', score)
    }
  }

  /**
   * Get high score
   */
  static getHighScore(): number {
    return this.get<number>('high_score') || 0
  }

  /**
   * Save achievement progress
   */
  static saveAchievementProgress(achievementId: string, progress: any): void {
    this.set(`achievement_${achievementId}`, progress, { namespace: 'achievements' })
  }

  /**
   * Load achievement progress
   */
  static loadAchievementProgress(achievementId: string): any | null {
    return this.get(`achievement_${achievementId}`, { namespace: 'achievements' })
  }

  /**
   * Get all unlocked achievements
   */
  static getUnlockedAchievements(): string[] {
    return this.keys('achievements')
      .filter((key) => key.startsWith('achievement_'))
      .map((key) => key.replace('achievement_', ''))
  }

  /**
   * Check storage availability
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get remaining storage quota (approximate)
   */
  static getRemainingQuota(): number {
    const maxSize = 5 * 1024 * 1024 // 5MB typical limit
    const currentSize = this.getSize()
    return maxSize - currentSize
  }

  /**
   * Export all data
   */
  static exportData(): string {
    const data: Record<string, any> = {}

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        data[key] = localStorage.getItem(key)
      }
    }

    return JSON.stringify(data)
  }

  /**
   * Import data
   */
  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)

      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          localStorage.setItem(key, value)
        }
      }
    } catch (error) {
      console.error('Failed to import data:', error)
    }
  }

  /**
   * Migrate old data format to new format
   */
  static migrate(
    migrations: Array<{ from: string; to: string; transform?: (data: any) => any }>
  ): void {
    migrations.forEach(({ from, to, transform }) => {
      const oldData = this.get(from)
      if (oldData !== null) {
        const newData = transform ? transform(oldData) : oldData
        this.set(to, newData)
        this.remove(from)
      }
    })
  }
}

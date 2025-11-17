/**
 * Enhanced storage wrapper with type safety
 */

import { logger } from './logger'

export class StorageWrapper {
  private storage: Storage

  constructor(
    storage: Storage = typeof window !== 'undefined' ? window.localStorage : ({} as Storage)
  ) {
    this.storage = storage
  }

  set<T>(key: string, value: T): boolean {
    try {
      this.storage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      logger.error('Storage set error', error as Error, { key })
      return false
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = this.storage.getItem(key)
      return item ? (JSON.parse(item) as T) : (defaultValue ?? null)
    } catch (error) {
      logger.error('Storage get error', error as Error, { key })
      return defaultValue ?? null
    }
  }

  remove(key: string): boolean {
    try {
      this.storage.removeItem(key)
      return true
    } catch (error) {
      logger.error('Storage remove error', error as Error, { key })
      return false
    }
  }

  clear(): boolean {
    try {
      this.storage.clear()
      return true
    } catch (error) {
      logger.error('Storage clear error', error as Error)
      return false
    }
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null
  }

  keys(): string[] {
    return Object.keys(this.storage)
  }
}

export const localStorage = new StorageWrapper(
  typeof window !== 'undefined' ? window.localStorage : ({} as Storage)
)
export const sessionStorage = new StorageWrapper(
  typeof window !== 'undefined' ? window.sessionStorage : ({} as Storage)
)

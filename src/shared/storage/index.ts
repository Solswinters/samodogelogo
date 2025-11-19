/**
 * Safe localStorage/sessionStorage wrapper
 */

type StorageType = 'local' | 'session'

class Storage {
  private getStorage(type: StorageType): globalThis.Storage | null {
    if (typeof window === 'undefined') {
      return null
    }
    return type === 'local' ? window.localStorage : window.sessionStorage
  }

  set(key: string, value: unknown, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type)
      if (!storage) {
        return false
      }
      storage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Failed to set ${type} storage:`, error)
      return false
    }
  }

  get<T>(key: string, defaultValue: T, type: StorageType = 'local'): T {
    try {
      const storage = this.getStorage(type)
      if (!storage) {
        return defaultValue
      }

      const item = storage.getItem(key)
      if (item === null) {
        return defaultValue
      }

      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Failed to get ${type} storage:`, error)
      return defaultValue
    }
  }

  remove(key: string, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type)
      if (!storage) {
        return false
      }
      storage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove ${type} storage:`, error)
      return false
    }
  }

  clear(type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type)
      if (!storage) {
        return false
      }
      storage.clear()
      return true
    } catch (error) {
      console.error(`Failed to clear ${type} storage:`, error)
      return false
    }
  }

  has(key: string, type: StorageType = 'local'): boolean {
    try {
      const storage = this.getStorage(type)
      if (!storage) {
        return false
      }
      return storage.getItem(key) !== null
    } catch {
      return false
    }
  }

  keys(type: StorageType = 'local'): string[] {
    try {
      const storage = this.getStorage(type)
      if (!storage) {
        return []
      }
      return Object.keys(storage)
    } catch {
      return []
    }
  }
}

export const storage = new Storage()
export default storage

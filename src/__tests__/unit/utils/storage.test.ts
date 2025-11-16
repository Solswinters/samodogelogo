/**
 * Unit tests for storage utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { storage, sessionStorage as sessionStorageUtil } from '@/utils/storage'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('storage (localStorage)', () => {
    it('should store and retrieve data', () => {
      storage.set('testKey', { foo: 'bar' })
      const result = storage.get<{ foo: string }>('testKey')
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should return default value if key does not exist', () => {
      const result = storage.get('nonexistent', { default: 'value' })
      expect(result).toEqual({ default: 'value' })
    })

    it('should return null if key does not exist and no default', () => {
      const result = storage.get('nonexistent')
      expect(result).toBeNull()
    })

    it('should remove data', () => {
      storage.set('testKey', 'testValue')
      storage.remove('testKey')
      const result = storage.get('testKey')
      expect(result).toBeNull()
    })

    it('should clear all data', () => {
      storage.set('key1', 'value1')
      storage.set('key2', 'value2')
      storage.clear()
      expect(storage.get('key1')).toBeNull()
      expect(storage.get('key2')).toBeNull()
    })

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('invalid', 'not valid json {')
      const result = storage.get('invalid', 'default')
      expect(result).toBe('default')
    })
  })

  describe('sessionStorageUtil', () => {
    it('should store and retrieve data from sessionStorage', () => {
      sessionStorageUtil.set('sessionKey', { session: 'data' })
      const result = sessionStorageUtil.get<{ session: string }>('sessionKey')
      expect(result).toEqual({ session: 'data' })
    })

    it('should return default value if key does not exist', () => {
      const result = sessionStorageUtil.get('nonexistent', { default: 'value' })
      expect(result).toEqual({ default: 'value' })
    })

    it('should remove data from sessionStorage', () => {
      sessionStorageUtil.set('sessionKey', 'value')
      sessionStorageUtil.remove('sessionKey')
      const result = sessionStorageUtil.get('sessionKey')
      expect(result).toBeNull()
    })

    it('should clear all sessionStorage data', () => {
      sessionStorageUtil.set('key1', 'value1')
      sessionStorageUtil.set('key2', 'value2')
      sessionStorageUtil.clear()
      expect(sessionStorageUtil.get('key1')).toBeNull()
      expect(sessionStorageUtil.get('key2')).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should handle setItem errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      storage.set('key', 'value')
      expect(consoleSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })

    it('should handle removeItem errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('RemoveError')
      })

      storage.remove('key')
      expect(consoleSpy).toHaveBeenCalled()

      removeItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })
})

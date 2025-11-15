/**
 * useLocalStorage hook for persisting state
 */

import { useState, useEffect, useCallback } from 'react'
import { storage } from '@/utils/storage'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  // Initialize state with stored value or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.get<T>(key, initialValue) ?? initialValue
  })

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)
      storage.set(key, value)
    },
    [key]
  )

  // Remove value from storage
  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    storage.remove(key)
  }, [key, initialValue])

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as T
          setStoredValue(parsed)
        } catch {
          // Ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for handling keyboard input
 */

import { useState, useEffect, useCallback } from 'react'

type KeyMap = Map<string, boolean>

interface UseKeyboardOptions {
  keys?: string[]
  enabled?: boolean
}

export function useKeyboard(options: UseKeyboardOptions = {}) {
  const { keys, enabled = true } = options
  const [pressedKeys, setPressedKeys] = useState<KeyMap>(new Map())

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) {return}
      if (keys && !keys.includes(event.key)) {return}

      setPressedKeys(prev => {
        const newMap = new Map(prev)
        newMap.set(event.key, true)
        return newMap
      })
    },
    [enabled, keys]
  )

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) {return}
      if (keys && !keys.includes(event.key)) {return}

      setPressedKeys(prev => {
        const newMap = new Map(prev)
        newMap.set(event.key, false)
        return newMap
      })
    },
    [enabled, keys]
  )

  useEffect(() => {
    if (!enabled) {return}

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [enabled, handleKeyDown, handleKeyUp])

  const isKeyPressed = useCallback(
    (key: string): boolean => {
      return pressedKeys.get(key) ?? false
    },
    [pressedKeys]
  )

  const areKeysPressed = useCallback(
    (keyList: string[]): boolean => {
      return keyList.every(key => pressedKeys.get(key) ?? false)
    },
    [pressedKeys]
  )

  const isAnyKeyPressed = useCallback(
    (keyList: string[]): boolean => {
      return keyList.some(key => pressedKeys.get(key) ?? false)
    },
    [pressedKeys]
  )

  return {
    pressedKeys,
    isKeyPressed,
    areKeysPressed,
    isAnyKeyPressed,
  }
}

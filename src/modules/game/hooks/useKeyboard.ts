/**
 * Custom hook for keyboard input handling
 */

import { useEffect, useState, useCallback } from 'react'

export function useKeyboard(targetKey: string): boolean {
  const [isPressed, setIsPressed] = useState(false)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === targetKey || event.code === targetKey) {
        setIsPressed(true)
      }
    },
    [targetKey]
  )

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === targetKey || event.code === targetKey) {
        setIsPressed(false)
      }
    },
    [targetKey]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return isPressed
}

export function useKeys(keys: string[]): Record<string, boolean> {
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>(() =>
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.key) || keys.includes(event.code)) {
        setPressedKeys(prev => ({ ...prev, [event.key]: true, [event.code]: true }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (keys.includes(event.key) || keys.includes(event.code)) {
        setPressedKeys(prev => ({ ...prev, [event.key]: false, [event.code]: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keys])

  return pressedKeys
}

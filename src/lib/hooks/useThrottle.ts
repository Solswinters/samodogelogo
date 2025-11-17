/**
 * useThrottle hook
 */

import { useRef, useEffect } from 'react'

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 1000
): T {
  const lastRun = useRef(Date.now())

  useEffect(() => {
    lastRun.current = Date.now()
  }, [])

  return ((...args) => {
    const now = Date.now()
    if (now - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = now
    }
  }) as T
}

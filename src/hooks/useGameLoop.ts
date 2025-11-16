/**
 * Hook for managing game loop with requestAnimationFrame
 */

import { useEffect, useRef, useCallback } from 'react'

type GameLoopCallback = (deltaTime: number) => void

interface UseGameLoopOptions {
  onUpdate: GameLoopCallback
  isRunning: boolean
  fps?: number
}

export function useGameLoop({ onUpdate, isRunning, fps }: UseGameLoopOptions) {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const fpsInterval = fps ? 1000 / fps : 0

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time
      }

      const deltaTime = time - previousTimeRef.current

      // If FPS limit is set, only update at that rate
      if (fpsInterval > 0 && deltaTime < fpsInterval) {
        requestRef.current = requestAnimationFrame(animate)
        return
      }

      previousTimeRef.current = time

      // Call the update callback
      onUpdate(deltaTime)

      // Continue the loop
      requestRef.current = requestAnimationFrame(animate)
    },
    [onUpdate, fpsInterval]
  )

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate)
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
        previousTimeRef.current = undefined
      }
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      previousTimeRef.current = undefined
    }
  }, [isRunning, animate])
}

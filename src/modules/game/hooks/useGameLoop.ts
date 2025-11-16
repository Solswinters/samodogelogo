/**
 * Custom hook for game loop management
 */

import { useEffect, useRef, useCallback } from 'react'

export interface UseGameLoopOptions {
  fps?: number
  paused?: boolean
  onUpdate?: (deltaTime: number) => void
  onRender?: () => void
}

export function useGameLoop(options: UseGameLoopOptions = {}): void {
  const { fps = 60, paused = false, onUpdate, onRender } = options

  const frameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const fpsInterval = 1000 / fps

  const loop = useCallback(
    (currentTime: number) => {
      frameRef.current = requestAnimationFrame(loop)

      const elapsed = currentTime - lastTimeRef.current

      if (elapsed > fpsInterval) {
        lastTimeRef.current = currentTime - (elapsed % fpsInterval)

        const deltaTime = elapsed / 1000

        if (onUpdate) {
          onUpdate(deltaTime)
        }

        if (onRender) {
          onRender()
        }
      }
    },
    [fpsInterval, onUpdate, onRender]
  )

  useEffect(() => {
    if (!paused) {
      lastTimeRef.current = performance.now()
      frameRef.current = requestAnimationFrame(loop)
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [paused, loop])
}

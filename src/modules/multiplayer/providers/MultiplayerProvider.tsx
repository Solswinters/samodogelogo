'use client'

import React, { useEffect } from 'react'
import { useMultiplayerStore } from '@/stores'
import { logger } from '@/shared/logger'

interface MultiplayerProviderProps {
  children: React.ReactNode
}

/**
 * MultiplayerProvider utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of MultiplayerProvider.
 */
export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({ children }) => {
  const reset = useMultiplayerStore(state => state.reset)

  useEffect(() => {
    logger.info('Multiplayer provider initialized')

    // Cleanup on unmount
    return () => {
      logger.info('Multiplayer provider cleanup')
      reset()
    }
  }, [reset])

  return <>{children}</>
}

export default MultiplayerProvider

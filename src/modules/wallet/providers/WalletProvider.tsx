'use client'

import React, { useEffect } from 'react'
import { useWalletStore } from '@/stores'
import { logger } from '@/shared/logger'

interface WalletProviderProps {
  children: React.ReactNode
}

/**
 * WalletProvider utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WalletProvider.
 */
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const disconnect = useWalletStore((state) => state.disconnect)

  useEffect(() => {
    logger.info('Wallet provider initialized')

    // Cleanup on unmount
    return () => {
      logger.info('Wallet provider cleanup')
    }
  }, [disconnect])

  return <>{children}</>
}

export default WalletProvider

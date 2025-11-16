/**
 * Hook for wallet connection status
 */

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { logger } from '@/utils/logger'

export function useWalletConnection() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const connectWallet = async () => {
    try {
      logger.info('Attempting to connect wallet')
      connect({ connector: injected() })
    } catch (error) {
      logger.error('Failed to connect wallet', error)
    }
  }

  const disconnectWallet = () => {
    try {
      logger.info('Disconnecting wallet')
      disconnect()
    } catch (error) {
      logger.error('Failed to disconnect wallet', error)
    }
  }

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    connectWallet,
    disconnectWallet,
  }
}

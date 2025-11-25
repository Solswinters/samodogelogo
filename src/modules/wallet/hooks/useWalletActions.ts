/**
 * Centralized wallet actions hook
 */

import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import { useCallback } from 'react'
import { walletAnalytics } from '../services/WalletAnalytics'

/**
 * useWalletActions utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useWalletActions.
 */
export function useWalletActions() {
  const { address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const handleDisconnect = useCallback(() => {
    if (address) {
      walletAnalytics.trackDisconnect(address)
    }
    disconnect()
  }, [address, disconnect])

  const handleSwitchChain = useCallback(
    async (targetChainId: number) => {
      if (chainId && address) {
        walletAnalytics.trackNetworkSwitch(address, chainId, targetChainId)
      }
      switchChain({ chainId: targetChainId })
    },
    [address, chainId, switchChain]
  )

  return {
    disconnect: handleDisconnect,
    switchChain: handleSwitchChain,
  }
}

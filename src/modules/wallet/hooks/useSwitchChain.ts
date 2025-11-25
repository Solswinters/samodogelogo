/**
 * Hook for switching blockchain networks
 */

import { useSwitchNetwork, useNetwork } from 'wagmi'
import { useCallback } from 'react'
import { useWalletStore } from './useWalletStore'

/**
 * useSwitchChain utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useSwitchChain.
 */
export function useSwitchChain() {
  const { chain } = useNetwork()
  const { switchNetwork, isLoading, error, pendingChainId } = useSwitchNetwork()
  const addTransaction = useWalletStore((state) => state.addTransaction)

  const switchChain = useCallback(
    async (chainId: number) => {
      if (!switchNetwork) {
        throw new Error('Wallet does not support network switching')
      }

      try {
        switchNetwork(chainId)
      } catch (err) {
        addTransaction({
          hash: `switch-chain-error-${Date.now()}` as `0x${string}`,
          type: 'network_switch',
          status: 'failed',
          timestamp: Date.now(),
          error: err instanceof Error ? err.message : 'Failed to switch network',
        })
        throw err
      }
    },
    [switchNetwork, addTransaction]
  )

  return {
    switchChain,
    currentChainId: chain?.id,
    isLoading,
    pendingChainId,
    error,
    canSwitchChain: !!switchNetwork,
  }
}

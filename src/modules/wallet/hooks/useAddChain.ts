/**
 * Hook for adding custom chains to wallet
 */

import { useCallback, useState } from 'react'
import { type Chain } from 'viem'
import { useWalletClient } from 'wagmi'

/**
 * useAddChain utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useAddChain.
 */
export function useAddChain() {
  const { data: walletClient } = useWalletClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addChain = useCallback(
    async (chain: Chain) => {
      if (!walletClient) {
        const err = new Error('Wallet not connected')
        setError(err)
        throw err
      }

      setIsLoading(true)
      setError(null)

      try {
        await walletClient.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chain.id.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrls.default.http[0]],
              blockExplorerUrls: chain.blockExplorers
                ? [chain.blockExplorers.default.url]
                : undefined,
            },
          ],
        })
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to add chain')
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [walletClient]
  )

  return {
    addChain,
    isLoading,
    error,
  }
}

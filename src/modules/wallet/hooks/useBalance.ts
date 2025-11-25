/**
 * Hook for native balance queries
 */

import { useAccount, useBalance as useWagmiBalance } from 'wagmi'

/**
 * useBalance utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useBalance.
 */
export function useBalance() {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useWagmiBalance({
    address,
    query: {
      enabled: !!address,
    },
  })

  return {
    balance: data?.value,
    formatted: data?.formatted,
    symbol: data?.symbol,
    decimals: data?.decimals,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for native balance queries
 */

import { useAccount, useBalance as useWagmiBalance } from 'wagmi'

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

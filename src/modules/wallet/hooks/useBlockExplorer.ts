/**
 * Hook for block explorer operations
 */

import { useCallback, useMemo } from 'react'
import { useNetwork } from 'wagmi'
import { type Address, type Hash } from 'viem'
import { BlockExplorerService } from '../services/BlockExplorerService'

const EXPLORER_CONFIGS: Record<number, { baseUrl: string; apiKey?: string }> = {
  1: {
    baseUrl: 'https://etherscan.io',
    apiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
  },
  8453: {
    baseUrl: 'https://basescan.org',
    apiKey: process.env.NEXT_PUBLIC_BASESCAN_API_KEY,
  },
  137: {
    baseUrl: 'https://polygonscan.com',
    apiKey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY,
  },
  42161: {
    baseUrl: 'https://arbiscan.io',
    apiKey: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY,
  },
}

/**
 * useBlockExplorer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useBlockExplorer.
 */
export function useBlockExplorer() {
  const { chain } = useNetwork()

  const service = useMemo(() => {
    if (!chain?.id) return null

    const config = EXPLORER_CONFIGS[chain.id]
    if (!config) return null

    return new BlockExplorerService(config)
  }, [chain?.id])

  const getTransactionUrl = useCallback(
    (txHash: Hash): string | null => {
      return service?.getTransactionUrl(txHash) ?? null
    },
    [service]
  )

  const getAddressUrl = useCallback(
    (address: Address): string | null => {
      return service?.getAddressUrl(address) ?? null
    },
    [service]
  )

  const openTransaction = useCallback(
    (txHash: Hash): void => {
      service?.openTransaction(txHash)
    },
    [service]
  )

  const openAddress = useCallback(
    (address: Address): void => {
      service?.openAddress(address)
    },
    [service]
  )

  return {
    service,
    getTransactionUrl,
    getAddressUrl,
    openTransaction,
    openAddress,
    isAvailable: !!service,
  }
}

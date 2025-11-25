/**
 * Hook for fetching token balance
 */

import { useState, useEffect } from 'react'
import { type Address } from 'viem'
import { usePublicClient, useChainId } from 'wagmi'
import { getContractAddress, getContractABI } from '@/config/contracts'
import { formatTokenBalance } from '@/modules/wallet/utils/balance-formatter'
import { logger } from '@/utils/logger'

interface TokenBalanceState {
  balance: bigint | null
  formattedBalance: string
  loading: boolean
  error: Error | null
}

/**
 * useTokenBalance utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useTokenBalance.
 */
export function useTokenBalance(address: Address | undefined, refresh: boolean = false) {
  const [state, setState] = useState<TokenBalanceState>({
    balance: null,
    formattedBalance: '0.0',
    loading: false,
    error: null,
  })

  const publicClient = usePublicClient()
  const chainId = useChainId()

  useEffect(() => {
    if (!address || !publicClient) {
      setState((prev) => ({
        ...prev,
        balance: null,
        formattedBalance: '0.0',
      }))
      return
    }

    const fetchBalance = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const tokenAddress = getContractAddress(chainId, 'gameToken')
        const abi = getContractABI('gameToken')

        const balance = (await publicClient.readContract({
          address: tokenAddress,
          abi,
          functionName: 'balanceOf',
          args: [address],
        })) as bigint

        setState({
          balance,
          formattedBalance: formatTokenBalance(balance, 18, 4),
          loading: false,
          error: null,
        })
      } catch (error) {
        logger.error('Failed to fetch token balance', error)
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }))
      }
    }

    void fetchBalance()
  }, [address, publicClient, chainId, refresh])

  return state
}

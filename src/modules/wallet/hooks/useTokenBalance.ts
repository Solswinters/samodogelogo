/**
 * Hook for token balance queries
 */

import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi'
import { type Address } from 'viem'
import { GameTokenABI } from '../abi/GameToken'
import { useEffect } from 'react'

export interface UseTokenBalanceParams {
  tokenAddress: Address
  enabled?: boolean
}

export function useTokenBalance({ tokenAddress, enabled = true }: UseTokenBalanceParams) {
  const { address } = useAccount()

  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: tokenAddress,
    abi: GameTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address,
    },
  })

  // Watch for transfer events to refetch balance
  useWatchContractEvent({
    address: tokenAddress,
    abi: GameTokenABI,
    eventName: 'Transfer',
    onLogs: logs => {
      const relevantTransfer = logs.some(log => {
        const { from, to } = log.args
        return from === address || to === address
      })

      if (relevantTransfer) {
        void refetch()
      }
    },
  })

  return {
    balance: balance as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}

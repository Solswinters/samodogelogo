/**
 * Hook for checking and managing token allowances
 */

import { useState, useEffect, useCallback } from 'react'
import { type Address } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'

export function useTokenAllowance(tokenAddress: Address, spenderAddress: Address) {
  const { address: ownerAddress } = useAccount()
  const publicClient = usePublicClient()
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAllowance = useCallback(async () => {
    if (!publicClient || !ownerAddress) return

    setIsLoading(true)
    setError(null)

    try {
      const result = (await publicClient.readContract({
        address: tokenAddress,
        abi: [
          {
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'spender', type: 'address' },
            ],
            name: 'allowance',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'allowance',
        args: [ownerAddress, spenderAddress],
      })) as bigint

      setAllowance(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch allowance')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [publicClient, ownerAddress, tokenAddress, spenderAddress])

  useEffect(() => {
    void fetchAllowance()
  }, [fetchAllowance])

  const hasAllowance = useCallback(
    (amount: bigint): boolean => {
      return allowance >= amount
    },
    [allowance]
  )

  const needsApproval = useCallback(
    (amount: bigint): boolean => {
      return allowance < amount
    },
    [allowance]
  )

  return {
    allowance,
    isLoading,
    error,
    refetch: fetchAllowance,
    hasAllowance,
    needsApproval,
  }
}

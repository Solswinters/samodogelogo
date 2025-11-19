/**
 * Generic contract read hook
 */

import { useContractRead as useWagmiContractRead } from 'wagmi'
import { type Abi, type Address } from 'viem'
import { useEffect } from 'react'
import { useWalletStore } from './useWalletStore'

interface UseContractReadConfig<TAbi extends Abi, TFunctionName extends string> {
  address: Address
  abi: TAbi
  functionName: TFunctionName
  args?: unknown[]
  enabled?: boolean
  watch?: boolean
  cacheTime?: number
}

export function useContractRead<TAbi extends Abi, TFunctionName extends string>({
  address,
  abi,
  functionName,
  args = [],
  enabled = true,
  watch = false,
  cacheTime = 2000,
}: UseContractReadConfig<TAbi, TFunctionName>) {
  const addTransaction = useWalletStore(state => state.addTransaction)

  const result = useWagmiContractRead({
    address,
    abi,
    functionName,
    args,
    enabled,
    watch,
    cacheTime,
  })

  useEffect(() => {
    if (result.isError && result.error) {
      addTransaction({
        hash: `read-error-${Date.now()}` as `0x${string}`,
        type: 'contract_interaction',
        status: 'failed',
        timestamp: Date.now(),
        error: result.error.message,
      })
    }
  }, [result.isError, result.error, addTransaction])

  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
    isRefetching: result.isRefetching,
  }
}

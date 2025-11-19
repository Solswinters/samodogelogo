/**
 * Generic contract write hook with transaction tracking
 */

import { useContractWrite as useWagmiContractWrite, useWaitForTransaction } from 'wagmi'
import { type Abi, type Address } from 'viem'
import { useEffect, useCallback } from 'react'
import { useWalletStore } from './useWalletStore'

interface UseContractWriteConfig<TAbi extends Abi, TFunctionName extends string> {
  address: Address
  abi: TAbi
  functionName: TFunctionName
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

export function useContractWrite<TAbi extends Abi, TFunctionName extends string>({
  address,
  abi,
  functionName,
  onSuccess,
  onError,
}: UseContractWriteConfig<TAbi, TFunctionName>) {
  const addTransaction = useWalletStore(state => state.addTransaction)
  const updateTransaction = useWalletStore(state => state.updateTransaction)

  const {
    data,
    write,
    isLoading: isPreparing,
    error: prepareError,
  } = useWagmiContractWrite({
    address,
    abi,
    functionName,
  })

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
    error: txError,
  } = useWaitForTransaction({
    hash: data?.hash,
  })

  // Track transaction in store
  useEffect(() => {
    if (data?.hash) {
      addTransaction({
        hash: data.hash,
        type: 'contract_interaction',
        status: 'pending',
        timestamp: Date.now(),
      })
    }
  }, [data?.hash, addTransaction])

  // Update transaction status
  useEffect(() => {
    if (data?.hash) {
      if (isConfirming) {
        updateTransaction(data.hash, { status: 'confirming' })
      } else if (isSuccess) {
        updateTransaction(data.hash, { status: 'confirmed' })
        onSuccess?.(data)
      } else if (isError) {
        updateTransaction(data.hash, {
          status: 'failed',
          error: txError?.message,
        })
        if (txError) {
          onError?.(txError)
        }
      }
    }
  }, [data?.hash, isConfirming, isSuccess, isError, txError, updateTransaction, onSuccess, onError])

  // Handle prepare errors
  useEffect(() => {
    if (prepareError) {
      onError?.(prepareError)
    }
  }, [prepareError, onError])

  const writeAsync = useCallback(
    (args?: unknown[]) => {
      if (write) {
        write({ args })
      }
    },
    [write]
  )

  return {
    write: writeAsync,
    data,
    isPreparing,
    isConfirming,
    isSuccess,
    isError,
    error: prepareError ?? txError,
  }
}

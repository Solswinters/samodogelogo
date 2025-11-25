/**
 * Hook for transferring tokens
 */

import { useCallback } from 'react'
import { type Address } from 'viem'
import { useContractWrite } from './useContractWrite'

const ERC20_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

/**
 * useTokenTransfer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useTokenTransfer.
 */
export function useTokenTransfer(tokenAddress: Address) {
  const { write, isPreparing, isConfirming, isSuccess, isError, error, data } = useContractWrite({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'transfer',
  })

  const transfer = useCallback(
    (to: Address, amount: bigint) => {
      write([to, amount])
    },
    [write]
  )

  return {
    transfer,
    isPreparing,
    isTransferring: isConfirming,
    isSuccess,
    isError,
    error,
    transactionHash: data?.hash,
  }
}

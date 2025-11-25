/**
 * Hook for approving token spending
 */

import { useCallback } from 'react'
import { type Address } from 'viem'
import { useContractWrite } from './useContractWrite'

const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

/**
 * useApproveToken utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useApproveToken.
 */
export function useApproveToken(tokenAddress: Address, spenderAddress: Address) {
  const { write, isPreparing, isConfirming, isSuccess, isError, error } = useContractWrite({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
  })

  const approve = useCallback(
    (amount: bigint) => {
      write([spenderAddress, amount])
    },
    [write, spenderAddress]
  )

  const approveMax = useCallback(() => {
    // Max uint256
    const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    write([spenderAddress, maxAmount])
  }, [write, spenderAddress])

  return {
    approve,
    approveMax,
    isPreparing,
    isApproving: isConfirming,
    isSuccess,
    isError,
    error,
  }
}

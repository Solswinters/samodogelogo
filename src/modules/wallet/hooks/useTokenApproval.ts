/**
 * Hook for token approvals
 */

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { type Address } from 'viem'
import { GameTokenABI } from '../abi/GameToken'

export interface UseTokenApprovalParams {
  tokenAddress: Address
  spenderAddress: Address
  enabled?: boolean
}

/**
 * useTokenApproval utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useTokenApproval.
 */
export function useTokenApproval({
  tokenAddress,
  spenderAddress,
  enabled = true,
}: UseTokenApprovalParams) {
  const { address } = useAccount()

  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: GameTokenABI,
    functionName: 'allowance',
    args: address ? [address, spenderAddress] : undefined,
    query: {
      enabled: enabled && !!address,
    },
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const approve = async (amount: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: GameTokenABI,
      functionName: 'approve',
      args: [spenderAddress, amount],
    })
  }

  return {
    allowance: allowance as bigint | undefined,
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    refetch,
  }
}

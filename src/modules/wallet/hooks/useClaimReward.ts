'use client'

import {
  useAccount,
  useSignMessage,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi'
import { keccak256, encodePacked } from 'viem'
import { SIMPLE_GAME_REWARDS_ABI } from '@/lib/contracts'

/**
 * Unified hook for claiming rewards
 * Supports both simple claim (no signature) and direct claim (with signature)
 */
export function useClaimReward(
  contractAddress: `0x${string}`,
  mode: 'simple' | 'direct' = 'simple'
) {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Simple claim mode: Get last claim time
  const { data: lastClaimTime } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_GAME_REWARDS_ABI,
    functionName: 'lastClaimTime',
    args: address ? [address] : undefined,
    query: {
      enabled: mode === 'simple' && !!address,
    },
  })

  // Simple claim mode: Get cooldown period
  const { data: cooldownPeriod } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_GAME_REWARDS_ABI,
    functionName: 'cooldownPeriod',
    query: {
      enabled: mode === 'simple',
    },
  })

  // Simple claim mode: Get time until next claim
  const { data: timeUntilNextClaim } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_GAME_REWARDS_ABI,
    functionName: 'getTimeUntilNextClaim',
    args: address ? [address] : undefined,
    query: {
      enabled: mode === 'simple' && !!address,
    },
  })

  // Calculate if player can claim (simple mode)
  const canClaim =
    mode === 'simple' &&
    address &&
    lastClaimTime !== undefined &&
    cooldownPeriod !== undefined &&
    BigInt(Math.floor(Date.now() / 1000)) >= (lastClaimTime) + (cooldownPeriod)

  /**
   * Get estimated reward for a given score
   * Note: This returns the contract address and parameters for the caller to use with useReadContract
   */
  const getEstimatedRewardParams = (score: number) => {
    return {
      address: contractAddress,
      abi: SIMPLE_GAME_REWARDS_ABI,
      functionName: 'calculateReward' as const,
      args: [BigInt(score)],
    }
  }

  /**
   * Claim reward - simple mode (no signature required)
   */
  const claimRewardSimple = async (score: number) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: SIMPLE_GAME_REWARDS_ABI,
        functionName: 'claimReward',
        args: [BigInt(score)],
      })

      return txHash
    } catch (error) {
      throw error
    }
  }

  /**
   * Claim reward - direct mode (with user signature)
   */
  const claimRewardDirect = async (score: number, isWinner: boolean) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    try {
      // Generate nonce
      const nonce = Date.now()

      // Create message hash matching the smart contract
      const messageHash = keccak256(
        encodePacked(
          ['address', 'uint256', 'bool', 'uint256'],
          [address, BigInt(score), isWinner, BigInt(nonce)]
        )
      )

      // Sign the message with user's wallet
      const signature = await signMessageAsync({
        message: { raw: messageHash },
      })

      // Call the contract
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: SIMPLE_GAME_REWARDS_ABI,
        functionName: 'claimReward',
        args: [BigInt(score), isWinner, BigInt(nonce), signature],
      })

      return txHash
    } catch (error) {
      throw error
    }
  }

  return {
    // Claim functions
    claimReward: mode === 'simple' ? claimRewardSimple : claimRewardDirect,
    claimRewardSimple,
    claimRewardDirect,

    // Estimation
    getEstimatedRewardParams,

    // Simple mode state
    canClaim: Boolean(canClaim),
    timeUntilNextClaim: timeUntilNextClaim ? Number(timeUntilNextClaim) : 0,

    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    address,
  }
}

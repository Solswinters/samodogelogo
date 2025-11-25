/**
 * Hook for rewards management
 */

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { type Address } from 'viem'
import { GameRewardsABI } from '../abi/GameRewards'
import { useMemo } from 'react'

export interface UseRewardsParams {
  rewardsAddress: Address
  enabled?: boolean
}

/**
 * useRewards utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useRewards.
 */
export function useRewards({ rewardsAddress, enabled = true }: UseRewardsParams) {
  const { address } = useAccount()

  const { data: pendingRewards, refetch: refetchPending } = useReadContract({
    address: rewardsAddress,
    abi: GameRewardsABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address,
    },
  })

  const { data: totalClaimed, refetch: refetchClaimed } = useReadContract({
    address: rewardsAddress,
    abi: GameRewardsABI,
    functionName: 'getTotalClaimed',
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address,
    },
  })

  const { data: playerStats, refetch: refetchStats } = useReadContract({
    address: rewardsAddress,
    abi: GameRewardsABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address,
    },
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const claimReward = async (score: number) => {
    writeContract({
      address: rewardsAddress,
      abi: GameRewardsABI,
      functionName: 'claimReward',
      args: [BigInt(score)],
    })
  }

  const refetchAll = () => {
    void refetchPending()
    void refetchClaimed()
    void refetchStats()
  }

  const stats = useMemo(() => {
    if (!playerStats) return null

    return {
      totalGames: playerStats[0],
      totalScore: playerStats[1],
      highScore: playerStats[2],
      totalRewards: playerStats[3],
    }
  }, [playerStats])

  return {
    pendingRewards: pendingRewards as bigint | undefined,
    totalClaimed: totalClaimed as bigint | undefined,
    stats,
    claimReward,
    isPending,
    isConfirming,
    isSuccess,
    error,
    refetch: refetchAll,
  }
}

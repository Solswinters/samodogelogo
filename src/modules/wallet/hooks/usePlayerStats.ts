/**
 * Hook for fetching player statistics from contract
 */

import { type Address } from 'viem'
import { useReadContract } from 'wagmi'
import { getGameRewardsAddress, getContractABI } from '@/config/contracts'

export interface PlayerStats {
  totalClaimed: bigint
  gamesPlayed: bigint
  highestScore: bigint
  lastClaimTime: bigint
}

export interface UsePlayerStatsResult {
  stats: PlayerStats | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<unknown>
}

/**
 * usePlayerStats utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of usePlayerStats.
 */
export function usePlayerStats(
  chainId: number,
  playerAddress: Address | undefined
): UsePlayerStatsResult {
  const { data, isLoading, error, refetch } = useReadContract({
    address: getGameRewardsAddress(chainId),
    abi: getContractABI('gameRewards'),
    functionName: 'getPlayerStats',
    args: playerAddress ? [playerAddress] : undefined,
    query: {
      enabled: Boolean(playerAddress),
    },
  })

  const stats = data
    ? {
        totalClaimed: (data as [bigint, bigint, bigint, bigint])[0] ?? BigInt(0),
        gamesPlayed: (data as [bigint, bigint, bigint, bigint])[1] ?? BigInt(0),
        highestScore: (data as [bigint, bigint, bigint, bigint])[2] ?? BigInt(0),
        lastClaimTime: (data as [bigint, bigint, bigint, bigint])[3] ?? BigInt(0),
      }
    : null

  return {
    stats,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}

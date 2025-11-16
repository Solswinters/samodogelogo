/**
 * Hook for fetching player stats from GameRewards contract
 */

import { useState, useEffect } from 'react'
import { type Address } from 'viem'
import { usePublicClient, useChainId } from 'wagmi'
import { getContractAddress, getContractABI } from '@/config/contracts'
import { formatTokenBalance } from '@/modules/wallet/utils/balance-formatter'
import { logger } from '@/utils/logger'

interface PlayerStats {
  totalClaimed: bigint
  lastClaimTime: number
  gamesPlayed: number
  timeUntilNextClaim: number
  formattedTotalClaimed: string
}

interface PlayerStatsState {
  stats: PlayerStats | null
  loading: boolean
  error: Error | null
}

export function usePlayerStats(address: Address | undefined, refresh: boolean = false) {
  const [state, setState] = useState<PlayerStatsState>({
    stats: null,
    loading: false,
    error: null,
  })

  const publicClient = usePublicClient()
  const chainId = useChainId()

  useEffect(() => {
    if (!address || !publicClient) {
      setState(prev => ({ ...prev, stats: null }))
      return
    }

    const fetchStats = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const rewardsAddress = getContractAddress(chainId, 'gameRewards')
        const abi = getContractABI('gameRewards')

        // Fetch total claimed
        const totalClaimed = (await publicClient.readContract({
          address: rewardsAddress,
          abi,
          functionName: 'getTotalClaimed',
          args: [address],
        })) as bigint

        // Fetch last claim time
        const lastClaimTime = (await publicClient.readContract({
          address: rewardsAddress,
          abi,
          functionName: 'getLastClaimTime',
          args: [address],
        })) as bigint

        // Fetch time until next claim
        const timeUntilNextClaim = (await publicClient.readContract({
          address: rewardsAddress,
          abi,
          functionName: 'getTimeUntilNextClaim',
          args: [address],
        })) as bigint

        // Note: gamesPlayed might not be tracked on-chain, defaulting to 0
        // You can add this to the contract if needed
        const gamesPlayed = 0

        setState({
          stats: {
            totalClaimed,
            lastClaimTime: Number(lastClaimTime),
            gamesPlayed,
            timeUntilNextClaim: Number(timeUntilNextClaim),
            formattedTotalClaimed: formatTokenBalance(totalClaimed, 18, 4),
          },
          loading: false,
          error: null,
        })
      } catch (error) {
        logger.error('Failed to fetch player stats', error)
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        }))
      }
    }

    void fetchStats()
  }, [address, publicClient, chainId, refresh])

  return state
}

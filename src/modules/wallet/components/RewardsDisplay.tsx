/**
 * Rewards display and claiming component
 */

'use client'

import { type Address } from 'viem'
import { useRewards } from '../hooks/useRewards'
import { formatTokenAmount } from '../utils/blockchain'

export interface RewardsDisplayProps {
  rewardsAddress: Address
  tokenSymbol: string
  decimals?: number
}

/**
 * RewardsDisplay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of RewardsDisplay.
 */
export function RewardsDisplay({
  rewardsAddress,
  tokenSymbol,
  decimals = 18,
}: RewardsDisplayProps) {
  const { pendingRewards, stats, claimReward, isPending, isConfirming, isSuccess } = useRewards({
    rewardsAddress,
  })

  const handleClaim = () => {
    if (stats?.highScore) {
      void claimReward(Number(stats.highScore))
    }
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Rewards</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400">Pending Rewards</p>
          <p className="text-2xl font-bold text-purple-400">
            {pendingRewards ? formatTokenAmount(pendingRewards, decimals) : '0'} {tokenSymbol}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Games</p>
              <p className="font-semibold text-white">{stats.totalGames.toString()}</p>
            </div>
            <div>
              <p className="text-gray-400">High Score</p>
              <p className="font-semibold text-white">{stats.highScore.toString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Score</p>
              <p className="font-semibold text-white">{stats.totalScore.toString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Rewards</p>
              <p className="font-semibold text-white">
                {formatTokenAmount(stats.totalRewards, decimals)} {tokenSymbol}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={isPending || isConfirming || !pendingRewards || pendingRewards === 0n}
          className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending || isConfirming ? 'Claiming...' : isSuccess ? 'Claimed!' : 'Claim Rewards'}
        </button>
      </div>
    </div>
  )
}

/**
 * Reward calculation service
 */

import { calculateRewardFromScore } from '@/modules/game/utils/score-calculator'
import { logger } from '@/utils/logger'

interface RewardBreakdown {
  baseReward: bigint
  scoreBonus: bigint
  winnerMultiplier: number
  totalReward: bigint
  formattedTotal: string
}

class RewardCalculator {
  private readonly BASE_REWARD = 10n // 10 tokens
  private readonly TOKEN_DECIMALS = 18n
  private readonly SCORE_BONUS_DIVISOR = 100n
  private readonly WINNER_MULTIPLIER = 1.5

  calculateReward(score: number, isWinner: boolean): bigint {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return calculateRewardFromScore(score, isWinner)
    } catch (error) {
      logger.error('Failed to calculate reward', error)
      return 0n
    }
  }

  getRewardBreakdown(score: number, isWinner: boolean): RewardBreakdown {
    const baseReward = this.BASE_REWARD * 10n ** this.TOKEN_DECIMALS
    const scoreBonus = (BigInt(score) * 10n ** this.TOKEN_DECIMALS) / this.SCORE_BONUS_DIVISOR

    let totalReward = baseReward + scoreBonus

    if (isWinner) {
      const multiplierBigInt = BigInt(Math.floor(this.WINNER_MULTIPLIER * 10000))
      totalReward = (totalReward * multiplierBigInt) / 10000n
    }

    return {
      baseReward,
      scoreBonus,
      winnerMultiplier: isWinner ? this.WINNER_MULTIPLIER : 1,
      totalReward,
      formattedTotal: this.formatReward(totalReward),
    }
  }

  formatReward(amount: bigint): string {
    const divisor = 10n ** this.TOKEN_DECIMALS
    const integerPart = amount / divisor
    const fractionalPart = amount % divisor

    const fractionalStr = fractionalPart.toString().padStart(Number(this.TOKEN_DECIMALS), '0')
    const truncatedFractional = fractionalStr.substring(0, 4)

    return `${integerPart}.${truncatedFractional}`
  }

  estimateGasCost(_reward: bigint): bigint {
    // Rough estimate: 50,000 gas * 20 gwei = 0.001 ETH
    const estimatedGas = 50000n
    const gasPrice = 20n * 10n ** 9n // 20 gwei in wei
    return estimatedGas * gasPrice
  }

  getNetReward(reward: bigint, gasCost: bigint): bigint {
    if (reward <= gasCost) {
      return 0n
    }
    return reward - gasCost
  }

  isRewardProfitable(reward: bigint, gasCost: bigint): boolean {
    return reward > gasCost * 2n // Reward should be at least 2x the gas cost to be worthwhile
  }

  getMinimumScoreForProfit(gasCost: bigint, isWinner: boolean = false): number {
    // Calculate minimum score needed to make claiming worthwhile
    const minReward = gasCost * 2n
    const baseReward = this.BASE_REWARD * 10n ** this.TOKEN_DECIMALS

    let requiredTotal = minReward
    if (isWinner) {
      const multiplierBigInt = BigInt(Math.floor(this.WINNER_MULTIPLIER * 10000))
      requiredTotal = (requiredTotal * 10000n) / multiplierBigInt
    }

    if (requiredTotal <= baseReward) {
      return 0 // Base reward alone is sufficient
    }

    const requiredScoreBonus = requiredTotal - baseReward
    const minScore = Number(
      (requiredScoreBonus * this.SCORE_BONUS_DIVISOR) / 10n ** this.TOKEN_DECIMALS
    )

    return Math.ceil(minScore)
  }
}

export const rewardCalculator = new RewardCalculator()

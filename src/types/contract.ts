export interface PlayerStats {
  gamesPlayed: number
  totalClaimed: string
  highestScore: number
  lastClaimTime: number
}

export interface ContractAddresses {
  gameToken: `0x${string}`
  gameRewards: `0x${string}`
}

export interface TransactionStatus {
  hash?: `0x${string}`
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  error?: Error
}

export interface RewardCalculation {
  baseReward: bigint
  scoreBonus: bigint
  multiplier: number
  totalReward: bigint
}


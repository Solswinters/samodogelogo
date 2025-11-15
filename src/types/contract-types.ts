// Strict types for smart contract interactions

export type Address = `0x${string}`
export type Hash = `0x${string}`
export type Signature = `0x${string}`

export interface ContractCallParams<T extends readonly unknown[] = readonly unknown[]> {
  address: Address
  abi: readonly unknown[]
  functionName: string
  args?: T
  value?: bigint
}

export interface ContractReadResult<T = unknown> {
  data?: T
  error?: Error
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

export interface ContractWriteResult {
  hash?: Hash
  data?: unknown
  error?: Error
  isPending: boolean
  isError: boolean
  isSuccess: boolean
}

export interface TransactionReceipt {
  transactionHash: Hash
  blockNumber: bigint
  blockHash: Hash
  status: 'success' | 'reverted'
  gasUsed: bigint
  effectiveGasPrice: bigint
  logs: readonly Log[]
}

export interface Log {
  address: Address
  topics: readonly Hash[]
  data: Hash
  blockNumber: bigint
  transactionHash: Hash
  logIndex: number
}

export interface ContractError {
  name: string
  message: string
  cause?: unknown
  code?: string
  data?: unknown
}

// Game Token Contract Types
export interface GameTokenRead {
  balanceOf: (address: Address) => Promise<bigint>
  totalSupply: () => Promise<bigint>
  allowance: (owner: Address, spender: Address) => Promise<bigint>
  decimals: () => Promise<number>
  name: () => Promise<string>
  symbol: () => Promise<string>
}

export interface GameTokenWrite {
  transfer: (to: Address, amount: bigint) => Promise<Hash>
  approve: (spender: Address, amount: bigint) => Promise<Hash>
  transferFrom: (from: Address, to: Address, amount: bigint) => Promise<Hash>
  mint: (to: Address, amount: bigint) => Promise<Hash>
  burn: (amount: bigint) => Promise<Hash>
}

// Game Rewards Contract Types
export interface GameRewardsRead {
  getPlayerStats: (player: Address) => Promise<readonly [bigint, bigint, bigint, bigint]>
  calculateReward: (score: bigint, isWinner: boolean) => Promise<bigint>
  getTimeUntilNextClaim: (player: Address) => Promise<bigint>
  cooldownPeriod: () => Promise<bigint>
  baseReward: () => Promise<bigint>
  verifier: () => Promise<Address>
}

export interface GameRewardsWrite {
  claimReward: (
    score: bigint,
    isWinner: boolean,
    nonce: bigint,
    signature: Signature
  ) => Promise<Hash>
  updateBaseReward: (newBaseReward: bigint) => Promise<Hash>
  updateCooldownPeriod: (newCooldownPeriod: bigint) => Promise<Hash>
}

// Event Types
export interface TokenTransferEvent {
  from: Address
  to: Address
  value: bigint
}

export interface RewardClaimedEvent {
  player: Address
  score: bigint
  reward: bigint
  isWinner: boolean
  timestamp: bigint
}

export interface GameTokenContract {
  read: GameTokenRead
  write: GameTokenWrite
  address: Address
}

export interface GameRewardsContract {
  read: GameRewardsRead
  write: GameRewardsWrite
  address: Address
}


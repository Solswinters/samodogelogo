/**
 * Wallet-related type definitions
 */

import type { Address, Hash } from 'viem'

export interface TransactionStatus {
  hash: Hash
  from: Address
  to?: Address
  value?: bigint
  data?: `0x${string}`
  status: 'pending' | 'success' | 'failed'
  timestamp: number
  message?: string
}

export interface RewardDetails {
  baseReward: bigint
  scoreBonus: bigint
  winnerMultiplier: number
  totalReward: bigint
  cooldownPeriod: number
}

export interface PlayerRewardStats {
  totalClaimed: bigint
  lastClaimTime: number
  gamesPlayed: number
  highestScore: number
}

export interface TokenInfo {
  address: Address
  symbol: string
  name: string
  decimals: number
  totalSupply?: bigint
  balance?: bigint
}

export interface WalletState {
  address: Address | undefined
  isConnected: boolean
  isConnecting: boolean
  chainId: number | undefined
  balance: bigint | undefined
}

export interface ContractInteraction {
  contractName: string
  functionName: string
  args: unknown[]
  value?: bigint
  gasLimit?: bigint
}

export interface SignatureRequest {
  message: string
  signer: Address
  timestamp: number
}

export interface SignedData {
  message: string
  signature: Hash
  signer: Address
  timestamp: number
}

export interface GasEstimate {
  gasPrice: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  gasLimit: bigint
  totalCost: bigint
  formattedGasPrice: string
  formattedTotalCost: string
}

export interface TransactionReceipt {
  hash: Hash
  blockNumber: bigint
  blockHash: Hash
  from: Address
  to: Address | null
  status: 'success' | 'reverted'
  gasUsed: bigint
  effectiveGasPrice: bigint
  logs: TransactionLog[]
}

export interface TransactionLog {
  address: Address
  topics: Hash[]
  data: `0x${string}`
  logIndex: number
  transactionHash: Hash
  blockNumber: bigint
}

export interface WalletError {
  code: number
  message: string
  data?: unknown
}

export interface ChainSwitchRequest {
  chainId: number
  chainName: string
}

export interface TokenTransfer {
  from: Address
  to: Address
  amount: bigint
  timestamp: number
  transactionHash: Hash
}

export interface AllowanceInfo {
  owner: Address
  spender: Address
  amount: bigint
  token: Address
}

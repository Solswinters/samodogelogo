/**
 * Wallet domain types
 */

import type { Address } from 'viem'

export interface WalletState {
  address?: Address
  chainId?: number
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  error?: Error
}

export interface TokenBalance {
  address: Address
  symbol: string
  decimals: number
  balance: bigint
  balanceFormatted: string
  valueUSD?: string
}

export interface PlayerStats {
  gamesPlayed: number
  totalClaimed: string
  totalClaimedRaw: bigint
  highestScore: number
  lastClaimTime: number
  nextClaimAvailable: number
}

export interface TransactionStatus {
  hash: Address
  status: 'pending' | 'confirmed' | 'failed'
  blockNumber?: bigint
  confirmations: number
  timestamp: number
  error?: string
}

export interface ClaimValidation {
  canClaim: boolean
  errors: string[]
  warnings: string[]
  estimatedReward: string
  estimatedGas: string
  timeUntilClaim?: number
}

export interface ContractInfo {
  address: Address
  name: string
  symbol?: string
  decimals?: number
  totalSupply?: bigint
  owner?: Address
}

export interface SignatureData {
  message: string
  messageHash: Address
  signature: Address
  signer: Address
  nonce: number
  timestamp: number
}

export type TransactionType = 'claim' | 'approve' | 'transfer' | 'mint' | 'burn' | 'unknown'

export interface TransactionMetadata {
  type: TransactionType
  from: Address
  to: Address
  value?: bigint
  data?: string
  nonce: number
  gasLimit: bigint
  gasPrice?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
}

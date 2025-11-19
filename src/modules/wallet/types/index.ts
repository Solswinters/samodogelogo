/**
 * Wallet module type exports
 */

export * from './blockchain'

// Re-export common viem types for convenience
export type { Address, Hash, Hex } from 'viem'

// Transaction types
export interface Transaction {
  hash: `0x${string}`
  type: TransactionType
  status: TransactionStatus
  timestamp: number
  from?: Address
  to?: Address
  value?: bigint
  error?: string
  data?: unknown
}

export type TransactionType =
  | 'send'
  | 'receive'
  | 'swap'
  | 'approve'
  | 'contract_interaction'
  | 'mint'
  | 'burn'
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'network_switch'

export type TransactionStatus = 'pending' | 'confirming' | 'confirmed' | 'failed' | 'cancelled'

// Token types
export interface Token {
  address: Address
  chainId: number
  name: string
  symbol: string
  decimals: number
  logoUrl?: string
  balance?: bigint
  priceUSD?: number
}

export interface TokenBalance {
  token: Token
  balance: bigint
  valueUSD?: number
}

export interface TokenPrice {
  address: Address
  chainId: number
  priceUSD: number
  priceChange24h?: number
  lastUpdated: number
}

// NFT types
export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface NFTOwnership {
  contractAddress: Address
  tokenId: string
  balance: bigint
  metadata?: NFTMetadata
}

// Wallet types
export interface WalletState {
  address?: Address
  chainId?: number
  isConnected: boolean
  isConnecting: boolean
  balance?: bigint
  ensName?: string
}

// Gas types
export interface GasEstimate {
  low: bigint
  medium: bigint
  high: bigint
  estimatedTime: {
    low: string
    medium: string
    high: string
  }
}

// Approval types
export interface TokenApproval {
  token: Address
  spender: Address
  allowance: bigint
  lastUpdated: number
}

// Reward types
export interface GameReward {
  amount: bigint
  claimed: boolean
  timestamp: number
  txHash?: Hash
}

export interface RewardsClaim {
  amount: bigint
  proof: string[]
  deadline: number
}

// Chain types
export interface ChainInfo {
  id: number
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrl: string
  testnet: boolean
}

// Event types
export interface WalletEvent {
  type: WalletEventType
  timestamp: number
  data?: unknown
}

export type WalletEventType =
  | 'connected'
  | 'disconnected'
  | 'chain_changed'
  | 'account_changed'
  | 'transaction_sent'
  | 'transaction_confirmed'
  | 'transaction_failed'

// Re-export from blockchain.ts
import type { Address } from 'viem'

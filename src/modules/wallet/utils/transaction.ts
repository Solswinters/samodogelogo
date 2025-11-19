/**
 * Transaction utility functions
 */

import { type Address, type Hash } from 'viem'

/**
 * Shorten transaction hash
 */
export function shortenHash(hash: Hash, startChars = 6, endChars = 4): string {
  return `${hash.slice(0, startChars + 2)}...${hash.slice(-endChars)}`
}

/**
 * Shorten address
 */
export function shortenAddress(address: Address, startChars = 6, endChars = 4): string {
  return `${address.slice(0, startChars + 2)}...${address.slice(-endChars)}`
}

/**
 * Get transaction type label
 */
export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    send: 'Send',
    receive: 'Receive',
    swap: 'Swap',
    approve: 'Approve',
    contract_interaction: 'Contract',
    mint: 'Mint',
    burn: 'Burn',
    stake: 'Stake',
    unstake: 'Unstake',
    claim: 'Claim',
  }

  return labels[type] ?? 'Transaction'
}

/**
 * Calculate transaction age
 */
export function getTransactionAge(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

/**
 * Estimate transaction time
 */
export function estimateTransactionTime(gasPrice: bigint): string {
  // Simplified estimation based on gas price
  // Lower gas = slower, higher gas = faster
  const gwei = Number(gasPrice) / 1e9

  if (gwei < 20) return '~5 minutes'
  if (gwei < 50) return '~2 minutes'
  if (gwei < 100) return '~30 seconds'
  return '~15 seconds'
}

/**
 * Parse transaction error
 */
export function parseTransactionError(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('user rejected')) {
    return 'Transaction was rejected'
  }

  if (message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }

  if (message.includes('gas required exceeds')) {
    return 'Transaction would fail, please check parameters'
  }

  if (message.includes('nonce too low')) {
    return 'Transaction nonce is too low, try again'
  }

  if (message.includes('already known')) {
    return 'Transaction already submitted'
  }

  if (message.includes('replacement transaction underpriced')) {
    return 'Transaction replacement underpriced'
  }

  return 'Transaction failed'
}

/**
 * Format gas amount
 */
export function formatGas(gas: bigint): string {
  const num = Number(gas)

  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`
  }

  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`
  }

  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`
  }

  return num.toString()
}

/**
 * Format gwei
 */
export function formatGwei(wei: bigint, decimals = 2): string {
  const gwei = Number(wei) / 1e9
  return `${gwei.toFixed(decimals)} Gwei`
}

/**
 * Calculate transaction fee
 */
export function calculateTransactionFee(gasUsed: bigint, gasPrice: bigint): bigint {
  return gasUsed * gasPrice
}

/**
 * Check if transaction is recent (within 24 hours)
 */
export function isRecentTransaction(timestamp: number): boolean {
  const now = Date.now()
  const diff = now - timestamp
  return diff < 86400000 // 24 hours in milliseconds
}

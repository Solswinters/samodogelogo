/**
 * Blockchain network configuration
 */

import { base, baseSepolia } from 'wagmi/chains'

export const supportedChains = [base, baseSepolia] as const

export const defaultChain = process.env.NODE_ENV === 'production' ? base : baseSepolia

export const CHAIN_NAMES: Record<number, string> = {
  [base.id]: 'Base',
  [baseSepolia.id]: 'Base Sepolia',
}

export const BLOCK_EXPLORERS: Record<number, string> = {
  [base.id]: 'https://basescan.org',
  [baseSepolia.id]: 'https://sepolia.basescan.org',
}

export function getBlockExplorerUrl(chainId: number): string {
  return BLOCK_EXPLORERS[chainId] ?? BLOCK_EXPLORERS[base.id]
}

export function getChainName(chainId: number): string {
  return CHAIN_NAMES[chainId] ?? 'Unknown Chain'
}

export function getTxUrl(chainId: number, txHash: string): string {
  return `${getBlockExplorerUrl(chainId)}/tx/${txHash}`
}

export function getAddressUrl(chainId: number, address: string): string {
  return `${getBlockExplorerUrl(chainId)}/address/${address}`
}

export function isChainSupported(chainId: number): boolean {
  return supportedChains.some(chain => chain.id === chainId)
}

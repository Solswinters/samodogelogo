/**
 * Blockchain network configuration
 */

import { base, baseSepolia } from 'wagmi/chains'

export const CHAIN_IDS = {
  BASE: 8453,
  BASE_SEPOLIA: 84532,
  ETHEREUM: 1,
  SEPOLIA: 11155111,
} as const

export const supportedChains = [base, baseSepolia] as const

export const defaultChain = process.env.NODE_ENV === 'production' ? base : baseSepolia

export const CHAIN_NAMES: Record<number, string> = {
  [CHAIN_IDS.BASE]: 'Base',
  [CHAIN_IDS.BASE_SEPOLIA]: 'Base Sepolia',
  [CHAIN_IDS.ETHEREUM]: 'Ethereum',
  [CHAIN_IDS.SEPOLIA]: 'Sepolia',
}

export const BLOCK_EXPLORERS: Record<number, string> = {
  [CHAIN_IDS.BASE]: 'https://basescan.org',
  [CHAIN_IDS.BASE_SEPOLIA]: 'https://sepolia.basescan.org',
}

export const DEFAULT_CHAIN_ID =
  process.env.NODE_ENV === 'production' ? CHAIN_IDS.BASE : CHAIN_IDS.BASE_SEPOLIA

export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS]

export function getBlockExplorerUrl(chainId: number): string {
  return BLOCK_EXPLORERS[chainId] ?? BLOCK_EXPLORERS[CHAIN_IDS.BASE]
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

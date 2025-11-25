/**
 * Blockchain network configuration
 */

import { base, baseSepolia } from 'wagmi/chains'

/**
 * CHAIN_IDS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CHAIN_IDS.
 */
export const CHAIN_IDS = {
  BASE: 8453,
  BASE_SEPOLIA: 84532,
  ETHEREUM: 1,
  SEPOLIA: 11155111,
} as const

/**
 * supportedChains utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of supportedChains.
 */
export const supportedChains = [base, baseSepolia] as const

/**
 * defaultChain utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of defaultChain.
 */
export const defaultChain = process.env.NODE_ENV === 'production' ? base : baseSepolia

/**
 * CHAIN_NAMES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CHAIN_NAMES.
 */
export const CHAIN_NAMES: Record<number, string> = {
  [CHAIN_IDS.BASE]: 'Base',
  [CHAIN_IDS.BASE_SEPOLIA]: 'Base Sepolia',
  [CHAIN_IDS.ETHEREUM]: 'Ethereum',
  [CHAIN_IDS.SEPOLIA]: 'Sepolia',
}

/**
 * BLOCK_EXPLORERS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of BLOCK_EXPLORERS.
 */
export const BLOCK_EXPLORERS: Record<number, string> = {
  [CHAIN_IDS.BASE]: 'https://basescan.org',
  [CHAIN_IDS.BASE_SEPOLIA]: 'https://sepolia.basescan.org',
}

/**
 * DEFAULT_CHAIN_ID utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DEFAULT_CHAIN_ID.
 */
export const DEFAULT_CHAIN_ID =
  process.env.NODE_ENV === 'production' ? CHAIN_IDS.BASE : CHAIN_IDS.BASE_SEPOLIA

export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS]

/**
 * getBlockExplorerUrl utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getBlockExplorerUrl.
 */
export function getBlockExplorerUrl(chainId: number): string {
  return BLOCK_EXPLORERS[chainId] ?? BLOCK_EXPLORERS[CHAIN_IDS.BASE]
}

/**
 * getChainName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getChainName.
 */
export function getChainName(chainId: number): string {
  return CHAIN_NAMES[chainId] ?? 'Unknown Chain'
}

/**
 * getTxUrl utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getTxUrl.
 */
export function getTxUrl(chainId: number, txHash: string): string {
  return `${getBlockExplorerUrl(chainId)}/tx/${txHash}`
}

/**
 * getAddressUrl utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getAddressUrl.
 */
export function getAddressUrl(chainId: number, address: string): string {
  return `${getBlockExplorerUrl(chainId)}/address/${address}`
}

/**
 * isChainSupported utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isChainSupported.
 */
export function isChainSupported(chainId: number): boolean {
  return supportedChains.some(chain => chain.id === chainId)
}

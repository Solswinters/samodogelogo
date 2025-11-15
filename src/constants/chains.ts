/**
 * Blockchain chain constants
 */

export const CHAIN_IDS = {
  BASE: 8453,
  BASE_SEPOLIA: 84532,
  ETHEREUM: 1,
  SEPOLIA: 11155111,
} as const

export const CHAIN_NAMES: Record<number, string> = {
  [CHAIN_IDS.BASE]: 'Base',
  [CHAIN_IDS.BASE_SEPOLIA]: 'Base Sepolia',
  [CHAIN_IDS.ETHEREUM]: 'Ethereum',
  [CHAIN_IDS.SEPOLIA]: 'Sepolia',
}

export const DEFAULT_CHAIN_ID =
  process.env.NODE_ENV === 'production' ? CHAIN_IDS.BASE : CHAIN_IDS.BASE_SEPOLIA

export type ChainId = (typeof CHAIN_IDS)[keyof typeof CHAIN_IDS]

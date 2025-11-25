/**
 * Chain constants and configurations
 */

import { type Address } from 'viem'

export interface ChainConfig {
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

/**
 * MAINNET_CHAINS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of MAINNET_CHAINS.
 */
export const MAINNET_CHAINS: ChainConfig[] = [
  {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrl: 'https://etherscan.io',
    testnet: false,
  },
  {
    id: 8453,
    name: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrl: 'https://basescan.org',
    testnet: false,
  },
  {
    id: 137,
    name: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrl: 'https://polygonscan.com',
    testnet: false,
  },
  {
    id: 42161,
    name: 'Arbitrum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrl: 'https://arbiscan.io',
    testnet: false,
  },
  {
    id: 10,
    name: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    testnet: false,
  },
]

/**
 * TESTNET_CHAINS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TESTNET_CHAINS.
 */
export const TESTNET_CHAINS: ChainConfig[] = [
  {
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    testnet: true,
  },
  {
    id: 84532,
    name: 'Base Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrl: 'https://sepolia.basescan.org',
    testnet: true,
  },
]

/**
 * ALL_CHAINS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ALL_CHAINS.
 */
export const ALL_CHAINS = [...MAINNET_CHAINS, ...TESTNET_CHAINS]

/**
 * Get chain config by ID
 */
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return ALL_CHAINS.find((chain) => chain.id === chainId)
}

/**
 * Get chain name by ID
 */
export function getChainName(chainId: number): string {
  const chain = getChainConfig(chainId)
  return chain?.name ?? 'Unknown Chain'
}

/**
 * Check if chain is testnet
 */
export function isTestnet(chainId: number): boolean {
  const chain = getChainConfig(chainId)
  return chain?.testnet ?? false
}

/**
 * Common token addresses by chain
 */
export const COMMON_TOKENS: Record<number, Record<string, Address>> = {
  1: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  8453: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
}

/**
 * Get common token address
 */
export function getCommonTokenAddress(chainId: number, symbol: string): Address | undefined {
  return COMMON_TOKENS[chainId]?.[symbol]
}

/**
 * Blockchain chain configurations
 */

export interface ChainConfig {
  id: number
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  testnet: boolean
}

export const supportedChains: Record<number, ChainConfig> = {
  // Base Mainnet
  8453: {
    id: 8453,
    name: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    testnet: false,
  },

  // Base Sepolia (Testnet)
  84532: {
    id: 84532,
    name: 'Base Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
    testnet: true,
  },

  // Optimism
  10: {
    id: 10,
    name: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io'],
    testnet: false,
  },

  // Arbitrum
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    testnet: false,
  },

  // Polygon
  137: {
    id: 137,
    name: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    testnet: false,
  },
}

export function getChainById(chainId: number): ChainConfig | undefined {
  return supportedChains[chainId]
}

export function isTestnet(chainId: number): boolean {
  return supportedChains[chainId]?.testnet || false
}

export function getBlockExplorerUrl(
  chainId: number,
  hash: string,
  type: 'tx' | 'address' = 'tx'
): string {
  const chain = supportedChains[chainId]
  if (!chain) return ''

  const base = chain.blockExplorerUrls[0]
  return `${base}/${type}/${hash}`
}

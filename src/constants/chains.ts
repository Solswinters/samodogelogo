// Blockchain chain configuration constants

export interface ChainConfig {
  id: number
  name: string
  network: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: {
    default: string
    public: string
  }
  blockExplorers: {
    default: {
      name: string
      url: string
    }
  }
  testnet: boolean
}

// Base Mainnet
export const BASE_MAINNET: ChainConfig = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://mainnet.base.org',
    public: 'https://mainnet.base.org',
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
  testnet: false,
}

// Base Sepolia Testnet
export const BASE_SEPOLIA: ChainConfig = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://sepolia.base.org',
    public: 'https://sepolia.base.org',
  },
  blockExplorers: {
    default: {
      name: 'BaseScan Sepolia',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
}

// Chain registry
export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  [BASE_MAINNET.id]: BASE_MAINNET,
  [BASE_SEPOLIA.id]: BASE_SEPOLIA,
}

// Default chain
export const DEFAULT_CHAIN = BASE_MAINNET

// Helper functions
export function getChainById(chainId: number): ChainConfig | undefined {
  return SUPPORTED_CHAINS[chainId]
}

export function isTestnet(chainId: number): boolean {
  const chain = getChainById(chainId)
  return chain?.testnet ?? false
}

export function getBlockExplorerUrl(chainId: number, hash: string, type: 'tx' | 'address' = 'tx'): string {
  const chain = getChainById(chainId)
  if (!chain) {
    return '#'
  }
  return `${chain.blockExplorers.default.url}/${type}/${hash}`
}

export function getChainName(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.name ?? 'Unknown Chain'
}

// Contract addresses by chain
export const CONTRACT_ADDRESSES: Record<number, {
  gameToken?: string
  gameRewards?: string
}> = {
  [BASE_MAINNET.id]: {
    gameToken: process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS,
    gameRewards: process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS,
  },
  [BASE_SEPOLIA.id]: {
    gameToken: process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS,
    gameRewards: process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS,
  },
}


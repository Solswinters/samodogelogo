/**
 * Wallet module constants
 */

/**
 * WALLET_STATUS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WALLET_STATUS.
 */
export const WALLET_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const

/**
 * TRANSACTION_STATUS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TRANSACTION_STATUS.
 */
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const

/**
 * SUPPORTED_CHAINS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SUPPORTED_CHAINS.
 */
export const SUPPORTED_CHAINS = {
  BASE: {
    id: 8453,
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.base.org'] },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://basescan.org' },
    },
  },
  BASE_SEPOLIA: {
    id: 84532,
    name: 'Base Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://sepolia.base.org'] },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
    },
  },
} as const

/**
 * DEFAULT_CHAIN_ID utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DEFAULT_CHAIN_ID.
 */
export const DEFAULT_CHAIN_ID = SUPPORTED_CHAINS.BASE.id

/**
 * TOKEN_DECIMALS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TOKEN_DECIMALS.
 */
export const TOKEN_DECIMALS = 18

/**
 * GAS_LIMITS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAS_LIMITS.
 */
export const GAS_LIMITS = {
  CLAIM: 100000,
  TRANSFER: 50000,
  APPROVE: 50000,
} as const

export type WalletStatus = (typeof WALLET_STATUS)[keyof typeof WALLET_STATUS]
export type TransactionStatus = (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS]

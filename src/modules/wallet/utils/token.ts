/**
 * Token utility functions
 */

import { type Address } from 'viem'

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number, maxDecimals = 4): string {
  const divisor = BigInt(10 ** decimals)
  const whole = amount / divisor
  const remainder = amount % divisor

  if (remainder === 0n) {
    return whole.toString()
  }

  const remainderStr = remainder.toString().padStart(decimals, '0')
  const trimmed = remainderStr.slice(0, maxDecimals).replace(/0+$/, '')

  return trimmed ? `${whole}.${trimmed}` : whole.toString()
}

/**
 * Parse token amount to bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [whole = '0', fraction = '0'] = amount.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  const combined = whole + paddedFraction
  return BigInt(combined)
}

/**
 * Check if address is native token
 */
export function isNativeToken(address: Address): boolean {
  return address.toLowerCase() === '0x0000000000000000000000000000000000000000'
}

/**
 * Get token logo URL from common sources
 */
export function getTokenLogoUrl(address: Address, chainId: number): string | null {
  const checksummedAddress = address

  // Try Trust Wallet assets
  const trustWalletUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${checksummedAddress}/logo.png`

  // Try CoinGecko
  const coinGeckoUrl = `https://assets.coingecko.com/coins/images/ethereum/standard/${checksummedAddress.toLowerCase()}.png`

  // Return first available (Trust Wallet preferred)
  return chainId === 1 ? trustWalletUrl : coinGeckoUrl
}

/**
 * Shorten token symbol
 */
export function shortenSymbol(symbol: string, maxLength = 6): string {
  if (symbol.length <= maxLength) return symbol
  return `${symbol.slice(0, maxLength - 1)}…`
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue: bigint, newValue: bigint): number {
  if (oldValue === 0n) return 0

  const change = newValue - oldValue
  const percentage = (Number(change) / Number(oldValue)) * 100

  return Math.round(percentage * 100) / 100
}

/**
 * Format USD value
 */
export function formatUSD(amount: number, maxDecimals = 2): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  })

  return formatter.format(amount)
}

/**
 * Format token price
 */
export function formatTokenPrice(price: number): string {
  if (price >= 1) {
    return formatUSD(price, 2)
  } else if (price >= 0.01) {
    return formatUSD(price, 4)
  } else if (price >= 0.0001) {
    return formatUSD(price, 6)
  } else {
    return formatUSD(price, 8)
  }
}

/**
 * Calculate token value in USD
 */
export function calculateTokenValue(amount: bigint, decimals: number, priceUSD: number): number {
  const tokenAmount = Number(formatTokenAmount(amount, decimals, 18))
  return tokenAmount * priceUSD
}

/**
 * Get token identifier
 */
export function getTokenIdentifier(address: Address, chainId: number): string {
  return `${chainId}:${address.toLowerCase()}`
}

/**
 * Parse token identifier
 */
export function parseTokenIdentifier(identifier: string): {
  chainId: number
  address: Address
} | null {
  const [chainIdStr, address] = identifier.split(':')
  if (!chainIdStr || !address) return null

  return {
    chainId: parseInt(chainIdStr),
    address: address as Address,
  }
}

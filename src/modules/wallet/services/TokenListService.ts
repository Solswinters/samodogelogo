/**
 * Token list management service
 */

import { type Address } from 'viem'
import type { TokenInfo } from '../types/blockchain'

export class TokenListService {
  private tokens: Map<Address, TokenInfo>

  constructor() {
    this.tokens = new Map()
    this.loadDefaultTokens()
  }

  private loadDefaultTokens(): void {
    // Add default tokens (Base mainnet example)
    const defaultTokens: TokenInfo[] = [
      {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      },
      {
        address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as Address,
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
        logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
      },
    ]

    defaultTokens.forEach((token) => {
      this.tokens.set(token.address, token)
    })
  }

  addToken(token: TokenInfo): void {
    this.tokens.set(token.address, token)
  }

  removeToken(address: Address): void {
    this.tokens.delete(address)
  }

  getToken(address: Address): TokenInfo | undefined {
    return this.tokens.get(address)
  }

  getAllTokens(): TokenInfo[] {
    return Array.from(this.tokens.values())
  }

  searchTokens(query: string): TokenInfo[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllTokens().filter(
      (token) =>
        token.name.toLowerCase().includes(lowerQuery) ||
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
    )
  }

  getTokenBySymbol(symbol: string): TokenInfo | undefined {
    return this.getAllTokens().find((token) => token.symbol.toLowerCase() === symbol.toLowerCase())
  }

  importTokenList(tokens: TokenInfo[]): void {
    tokens.forEach((token) => this.addToken(token))
  }

  clearCustomTokens(): void {
    this.tokens.clear()
    this.loadDefaultTokens()
  }
}

/**
 * tokenListService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of tokenListService.
 */
export const tokenListService = new TokenListService()

/**
 * Token price service
 */

export interface TokenPrice {
  token: string
  price: number
  change24h: number
  volume24h: number
  lastUpdated: number
}

export class PriceService {
  private cache: Map<string, TokenPrice>
  private cacheDuration = 60000 // 1 minute

  constructor() {
    this.cache = new Map()
  }

  async getPrice(tokenAddress: string): Promise<TokenPrice | null> {
    const cached = this.cache.get(tokenAddress)

    if (cached && Date.now() - cached.lastUpdated < this.cacheDuration) {
      return cached
    }

    try {
      // In production, integrate with CoinGecko, CoinMarketCap, or DEX aggregators
      const mockPrice: TokenPrice = {
        token: tokenAddress,
        price: Math.random() * 100,
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 1000000,
        lastUpdated: Date.now(),
      }

      this.cache.set(tokenAddress, mockPrice)
      return mockPrice
    } catch (error) {
      console.error('Failed to fetch token price', { error, tokenAddress })
      return null
    }
  }

  async getPrices(tokenAddresses: string[]): Promise<Map<string, TokenPrice>> {
    const prices = new Map<string, TokenPrice>()

    await Promise.all(
      tokenAddresses.map(async address => {
        const price = await this.getPrice(address)
        if (price) {
          prices.set(address, price)
        }
      })
    )

    return prices
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const priceService = new PriceService()

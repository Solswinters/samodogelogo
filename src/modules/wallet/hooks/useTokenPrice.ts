import { useState, useEffect } from 'react'

export interface TokenPrice {
  price: number
  currency: string
  change24h: number
}

export function useTokenPrice(tokenAddress?: string) {
  const [price, setPrice] = useState<TokenPrice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tokenAddress) return

    const fetchPrice = async () => {
      setLoading(true)
      try {
        // Fetch price from API
        const response = await fetch(`/api/token-price/${tokenAddress}`)
        if (!response.ok) throw new Error('Failed to fetch price')
        const data = await response.json()
        setPrice(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setPrice(null)
      } finally {
        setLoading(false)
      }
    }

    void fetchPrice()

    // Poll for updates every 30 seconds
    const interval = setInterval(() => void fetchPrice(), 30000)
    return () => clearInterval(interval)
  }, [tokenAddress])

  return { price, loading, error }
}

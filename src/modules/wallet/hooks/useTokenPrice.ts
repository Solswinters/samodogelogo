/**
 * Hook for token price data
 */

import { useState, useEffect } from 'react'
import { priceService, type TokenPrice } from '../services/PriceService'

export function useTokenPrice(tokenAddress: string | undefined, refreshInterval = 60000) {
  const [price, setPrice] = useState<TokenPrice | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!tokenAddress) return

    const fetchPrice = async () => {
      try {
        setIsLoading(true)
        const priceData = await priceService.getPrice(tokenAddress)
        setPrice(priceData)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPrice()

    const interval = setInterval(() => {
      void fetchPrice()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [tokenAddress, refreshInterval])

  return { price, isLoading, error }
}

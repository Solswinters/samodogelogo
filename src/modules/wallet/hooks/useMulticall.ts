/**
 * Hook for batched contract calls
 */

import { useState, useCallback } from 'react'
import { usePublicClient } from 'wagmi'
import { MulticallService, type Call, type CallResult } from '../services/MulticallService'

export function useMulticall() {
  const publicClient = usePublicClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const service = publicClient ? new MulticallService(publicClient) : null

  const multicall = useCallback(
    async <T = unknown>(calls: Call[]): Promise<CallResult<T>[]> => {
      if (!service) {
        throw new Error('Public client not available')
      }

      setIsLoading(true)
      setError(null)

      try {
        const results = await service.multicall<T>(calls)
        return results
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Multicall failed')
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [service]
  )

  return {
    multicall,
    isLoading,
    error,
  }
}

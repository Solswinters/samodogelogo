/**
 * Hook for latency tracking
 */

import { useState, useEffect, useCallback } from 'react'
import { LatencyService } from '../services/LatencyService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const latencyService = new LatencyService()

/**
 * useLatency utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useLatency.
 */
export function useLatency() {
  const { send, on, isConnected } = useWebSocket()
  const [latency, setLatency] = useState(0)
  const [jitter, setJitter] = useState(0)
  const [quality, setQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent')

  // Send ping every 2 seconds
  useEffect(() => {
    if (!isConnected) return

    const sendPing = () => {
      const pingId = latencyService.sendPing()
      send('ping', { id: pingId })
    }

    sendPing() // Send immediately
    const interval = setInterval(sendPing, 2000)

    return () => clearInterval(interval)
  }, [isConnected, send])

  // Listen for pong
  useEffect(() => {
    const unsubscribe = on('pong', (event) => {
      const { id } = event.data as { id: string }
      latencyService.recordPong(id)

      setLatency(latencyService.getLatency())
      setJitter(latencyService.getJitter())
      setQuality(latencyService.getQuality())
    })

    return unsubscribe
  }, [on])

  const refresh = useCallback(() => {
    setLatency(latencyService.getLatency())
    setJitter(latencyService.getJitter())
    setQuality(latencyService.getQuality())
  }, [])

  return {
    latency,
    jitter,
    quality,
    minLatency: latencyService.getMinLatency(),
    maxLatency: latencyService.getMaxLatency(),
    lagCompensation: latencyService.getLagCompensation(),
    refresh,
  }
}

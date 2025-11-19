/**
 * Connection state hook
 */

'use client'

import { useState, useEffect } from 'react'
import { ConnectionState, ConnectionStatus } from '../state/ConnectionState'

const connectionState = new ConnectionState()

export function useConnectionState() {
  const [status, setStatus] = useState<ConnectionStatus>(connectionState.getStatus())
  const [metrics, setMetrics] = useState(connectionState.getMetrics())

  useEffect(() => {
    const unsubscribe = connectionState.subscribe(setStatus)

    const metricsInterval = setInterval(() => {
      setMetrics(connectionState.getMetrics())
    }, 1000)

    return () => {
      unsubscribe()
      clearInterval(metricsInterval)
    }
  }, [])

  return {
    status,
    metrics,
    isConnected: connectionState.isConnected(),
    isConnecting: connectionState.isConnecting(),
  }
}

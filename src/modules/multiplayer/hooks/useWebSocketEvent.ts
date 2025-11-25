/**
 * Hook for subscribing to WebSocket events
 */

import { useEffect } from 'react'
import { useWebSocket } from './useWebSocket'
import type { WebSocketEventType, WebSocketEvent, EventHandler } from '../services/WebSocketService'

/**
 * useWebSocketEvent utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useWebSocketEvent.
 */
export function useWebSocketEvent<T = unknown>(
  type: WebSocketEventType,
  handler: EventHandler<T>,
  deps: React.DependencyList = []
) {
  const { on } = useWebSocket()

  useEffect(() => {
    const unsubscribe = on<T>(type, handler)
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, on, ...deps])
}

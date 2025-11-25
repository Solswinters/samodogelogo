/**
 * Connection status indicator component
 */

'use client'

import { useWebSocket } from '../hooks/useWebSocket'
import { useLatency } from '../hooks/useLatency'
import { Badge } from '@/shared/components/Badge'
import { Tooltip } from '@/shared/components/Tooltip'

/**
 * ConnectionIndicator utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ConnectionIndicator.
 */
export function ConnectionIndicator() {
  const { isConnected } = useWebSocket()
  const { latency, quality } = useLatency()

  if (!isConnected) {
    return (
      <Tooltip content="Disconnected">
        <Badge variant="error" className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          Offline
        </Badge>
      </Tooltip>
    )
  }

  const qualityColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    fair: 'bg-yellow-500',
    poor: 'bg-red-500',
  }

  const qualityVariants = {
    excellent: 'success',
    good: 'primary',
    fair: 'warning',
    poor: 'error',
  } as const

  return (
    <Tooltip content={`Latency: ${latency}ms (${quality})`}>
      <Badge variant={qualityVariants[quality]} className="flex items-center gap-2">
        <div className={`h-2 w-2 animate-pulse rounded-full ${qualityColors[quality]}`} />
        {latency}ms
      </Badge>
    </Tooltip>
  )
}

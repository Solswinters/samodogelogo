/**
 * Network statistics component
 */

'use client'

import { Card } from '@/shared/components/Card'
import { useLatency } from '../hooks/useLatency'

/**
 * NetworkStats utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of NetworkStats.
 */
export function NetworkStats() {
  const { latency, jitter, packetLoss, getQuality } = useLatency()

  const quality = getQuality()

  const getQualityColor = () => {
    switch (quality) {
      case 'excellent':
        return 'text-green-500'
      case 'good':
        return 'text-blue-500'
      case 'fair':
        return 'text-yellow-500'
      case 'poor':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Card className="p-3">
      <h3 className="mb-2 text-sm font-semibold text-white">Network Stats</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Ping:</span>
          <span className={`font-mono ${getQualityColor()}`}>{latency}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Jitter:</span>
          <span className="font-mono text-gray-300">{jitter.toFixed(1)}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Loss:</span>
          <span className="font-mono text-gray-300">{(packetLoss * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Quality:</span>
          <span className={`font-semibold uppercase ${getQualityColor()}`}>{quality}</span>
        </div>
      </div>
    </Card>
  )
}

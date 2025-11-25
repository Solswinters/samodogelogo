/**
 * Ping display component
 */

'use client'

import { useLatency } from '../hooks/useLatency'

/**
 * PingDisplay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of PingDisplay.
 */
export function PingDisplay() {
  const { latency, getQuality } = useLatency()

  const quality = getQuality()

  const getColorClass = () => {
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
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Ping:</span>
      <span className={`font-mono font-semibold ${getColorClass()}`}>{latency}ms</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`h-3 w-1 ${
              level <=
              (quality === 'excellent' ? 4 : quality === 'good' ? 3 : quality === 'fair' ? 2 : 1)
                ? getColorClass().replace('text-', 'bg-')
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

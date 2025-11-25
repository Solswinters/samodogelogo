/**
 * Connection status indicator component
 */

'use client'

import { useAccount } from 'wagmi'

export interface StatusIndicatorProps {
  showText?: boolean
}

/**
 * StatusIndicator utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of StatusIndicator.
 */
export function StatusIndicator({ showText = true }: StatusIndicatorProps) {
  const { isConnected, isConnecting, isDisconnected } = useAccount()

  const getStatus = () => {
    if (isConnecting) {
      return { text: 'Connecting...', color: 'bg-yellow-500', pulse: true }
    }
    if (isConnected) {
      return { text: 'Connected', color: 'bg-green-500', pulse: false }
    }
    return { text: 'Disconnected', color: 'bg-gray-500', pulse: false }
  }

  const status = getStatus()

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`h-2 w-2 rounded-full ${status.color}`} />
        {status.pulse && (
          <div className={`absolute inset-0 h-2 w-2 animate-ping rounded-full ${status.color}`} />
        )}
      </div>
      {showText && <span className="text-sm text-gray-400">{status.text}</span>}
    </div>
  )
}

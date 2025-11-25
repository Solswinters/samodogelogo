/**
 * Network display badge component
 */

'use client'

import { useNetwork } from '../hooks/useNetwork'

/**
 * NetworkBadge utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of NetworkBadge.
 */
export function NetworkBadge() {
  const { chain, isSupported } = useNetwork()

  if (!chain) {
    return null
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
        isSupported ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
      }`}
    >
      {chain.hasIcon && chain.iconUrl && (
        <img src={chain.iconUrl} alt={chain.name} className="h-4 w-4" />
      )}
      <span>{chain.name}</span>
      {!isSupported && <span className="text-xs">(Unsupported)</span>}
    </div>
  )
}

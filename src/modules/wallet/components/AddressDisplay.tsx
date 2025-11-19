/**
 * Address display component with copy functionality
 */

'use client'

import { useState } from 'react'
import { type Address } from 'viem'
import { formatAddress } from '../utils/blockchain'

export interface AddressDisplayProps {
  address: Address
  chars?: number
  showCopy?: boolean
  showFull?: boolean
}

export function AddressDisplay({
  address,
  chars = 4,
  showCopy = true,
  showFull = false,
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy address', error)
    }
  }

  const displayAddress = showFull ? address : formatAddress(address, chars)

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-gray-300">{displayAddress}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          title="Copy address"
        >
          {copied ? '✓' : '📋'}
        </button>
      )}
    </div>
  )
}

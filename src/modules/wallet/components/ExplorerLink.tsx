/**
 * Block explorer link component
 */

'use client'

import { type Address, type Hash } from 'viem'
import { useBlockExplorer } from '../hooks/useBlockExplorer'

interface ExplorerLinkProps {
  type: 'transaction' | 'address' | 'token' | 'block'
  value: Hash | Address | number
  children?: React.ReactNode
  className?: string
  showIcon?: boolean
}

export function ExplorerLink({
  type,
  value,
  children,
  className = '',
  showIcon = true,
}: ExplorerLinkProps) {
  const { getTransactionUrl, getAddressUrl, isAvailable } = useBlockExplorer()

  if (!isAvailable) {
    return <span className={className}>{children ?? String(value)}</span>
  }

  const url =
    type === 'transaction'
      ? getTransactionUrl(value as Hash)
      : type === 'address'
        ? getAddressUrl(value as Address)
        : null

  if (!url) {
    return <span className={className}>{children ?? String(value)}</span>
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline ${className}`}
    >
      {children ?? String(value)}
      {showIcon && (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </a>
  )
}

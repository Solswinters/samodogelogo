/**
 * Transaction action button component
 */

'use client'

import { type ReactNode } from 'react'

export interface TransactionButtonProps {
  onClick: () => void
  children: ReactNode
  isPending?: boolean
  isConfirming?: boolean
  isSuccess?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

/**
 * TransactionButton utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TransactionButton.
 */
export function TransactionButton({
  onClick,
  children,
  isPending = false,
  isConfirming = false,
  isSuccess = false,
  disabled = false,
  variant = 'primary',
}: TransactionButtonProps) {
  const isLoading = isPending || isConfirming

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105',
    secondary: 'bg-gray-700 hover:bg-gray-600',
    danger: 'bg-red-600 hover:bg-red-700',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`rounded-lg px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}
        {isSuccess ? '✓' : ''}{' '}
        {isPending ? 'Pending...' : isConfirming ? 'Confirming...' : children}
      </span>
    </button>
  )
}

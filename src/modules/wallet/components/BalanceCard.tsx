/**
 * Balance display card component
 */

'use client'

import { useBalance } from '../hooks/useBalance'
import { useTokenPrice } from '../hooks/useTokenPrice'

export interface BalanceCardProps {
  showUSD?: boolean
}

/**
 * BalanceCard utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of BalanceCard.
 */
export function BalanceCard({ showUSD = true }: BalanceCardProps) {
  const { balance, formatted, symbol, isLoading } = useBalance()
  const { price } = useTokenPrice(undefined) // Native token

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-700 bg-gray-800 p-6">
        <div className="h-8 w-32 rounded bg-gray-700" />
      </div>
    )
  }

  const usdValue = balance && price ? (Number(formatted) * price.price).toFixed(2) : '0.00'

  return (
    <div className="rounded-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
      <p className="mb-2 text-sm text-gray-400">Balance</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">
          {formatted ? parseFloat(formatted).toFixed(4) : '0.0000'}
        </span>
        <span className="text-lg text-gray-400">{symbol}</span>
      </div>
      {showUSD && <p className="mt-2 text-sm text-gray-500">≈ ${usdValue} USD</p>}
    </div>
  )
}

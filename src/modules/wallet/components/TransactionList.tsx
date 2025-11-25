/**
 * Transaction history list component
 */

'use client'

import { useAccount } from 'wagmi'
import { useTransactionsStore } from '../stores/transactions-store'
import { formatAddress } from '../utils/blockchain'
import { getBlockExplorerUrl } from '../utils/blockchain'

/**
 * TransactionList utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TransactionList.
 */
export function TransactionList() {
  const { chain } = useAccount()
  const { transactions } = useTransactionsStore()

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center text-gray-400">
        No transactions yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map(tx => (
        <div
          key={tx.hash}
          className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:bg-gray-750"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-gray-300">
                {formatAddress(tx.hash as `0x${string}`)}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  tx.status === 'success'
                    ? 'bg-green-900 text-green-300'
                    : tx.status === 'failed'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-yellow-900 text-yellow-300'
                }`}
              >
                {tx.status}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
              <span>From: {formatAddress(tx.from)}</span>
              {tx.to && <span>To: {formatAddress(tx.to)}</span>}
              <span>{new Date(tx.timestamp * 1000).toLocaleString()}</span>
            </div>
          </div>

          {chain && (
            <a
              href={getBlockExplorerUrl(chain.id, tx.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              View →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

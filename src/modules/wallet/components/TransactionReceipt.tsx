/**
 * Transaction receipt component
 */

'use client'

import { type Hash } from 'viem'
import { useWaitForTransaction } from 'wagmi'
import { ExplorerLink } from './ExplorerLink'
import { TransactionStatusBadge, type TransactionStatus } from './TransactionStatusBadge'
import { Card } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import { formatDistanceToNow } from '@/shared/date'

interface TransactionReceiptProps {
  hash: Hash
  timestamp?: number
}

export function TransactionReceipt({ hash, timestamp }: TransactionReceiptProps) {
  const { data: receipt, isLoading } = useWaitForTransaction({ hash })

  if (isLoading) {
    return (
      <Card className="p-4 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    )
  }

  if (!receipt) {
    return null
  }

  const status: TransactionStatus = receipt.status === 'success' ? 'confirmed' : 'failed'

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Transaction Receipt</h3>
        <TransactionStatusBadge status={status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Hash:</span>
          <ExplorerLink type="transaction" value={hash}>
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </ExplorerLink>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Block:</span>
          <span className="text-white">{receipt.blockNumber.toString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Gas Used:</span>
          <span className="text-white">{receipt.gasUsed.toString()}</span>
        </div>

        {receipt.from && (
          <div className="flex justify-between">
            <span className="text-gray-400">From:</span>
            <ExplorerLink type="address" value={receipt.from}>
              {receipt.from.slice(0, 6)}...{receipt.from.slice(-4)}
            </ExplorerLink>
          </div>
        )}

        {receipt.to && (
          <div className="flex justify-between">
            <span className="text-gray-400">To:</span>
            <ExplorerLink type="address" value={receipt.to}>
              {receipt.to.slice(0, 6)}...{receipt.to.slice(-4)}
            </ExplorerLink>
          </div>
        )}

        {timestamp && (
          <div className="flex justify-between">
            <span className="text-gray-400">Time:</span>
            <span className="text-white">{formatDistanceToNow(new Date(timestamp))}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

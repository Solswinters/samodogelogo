/**
 * Comprehensive wallet dashboard component
 */

'use client'

import { WalletInfo } from './WalletInfo'
import { BalanceCard } from './BalanceCard'
import { NetworkBadge } from './NetworkBadge'
import { TokenList } from './TokenList'
import { TransactionList } from './TransactionList'
import { StatusIndicator } from './StatusIndicator'
import { useAccount } from 'wagmi'

export function WalletDashboard() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-8">
        <div className="text-center">
          <p className="mb-4 text-gray-400">Connect your wallet to view dashboard</p>
          <StatusIndicator />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Wallet Dashboard</h2>
        <div className="flex items-center gap-4">
          <StatusIndicator />
          <NetworkBadge />
        </div>
      </div>

      {/* Balance and Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <BalanceCard />
        <WalletInfo />
      </div>

      {/* Tokens */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Your Tokens</h3>
        <TokenList />
      </div>

      {/* Transactions */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h3>
        <TransactionList />
      </div>
    </div>
  )
}

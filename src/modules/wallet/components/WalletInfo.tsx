/**
 * Comprehensive wallet information component
 */

'use client'

import { useAccount } from 'wagmi'
import { useBalance } from '../hooks/useBalance'
import { useNetwork } from '../hooks/useNetwork'
import { useENSName } from '../hooks/useENS'
import { AddressDisplay } from './AddressDisplay'

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { formatted, symbol } = useBalance()
  const { name: chainName } = useNetwork()
  const { name: ensName } = useENSName(address)

  if (!isConnected || !address) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center text-gray-400">
        No wallet connected
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Wallet Information</h3>

      <div className="space-y-4">
        {ensName && (
          <div>
            <p className="text-sm text-gray-400">ENS Name</p>
            <p className="font-semibold text-white">{ensName}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-400">Address</p>
          <AddressDisplay address={address} />
        </div>

        <div>
          <p className="text-sm text-gray-400">Network</p>
          <p className="font-semibold text-white">{chainName || 'Unknown'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Balance</p>
          <p className="font-semibold text-white">
            {formatted ? parseFloat(formatted).toFixed(4) : '0.0000'} {symbol}
          </p>
        </div>
      </div>
    </div>
  )
}

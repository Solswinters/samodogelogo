/**
 * Token list display component
 */

'use client'

import { useState } from 'react'
import { type Address } from 'viem'
import { tokenListService } from '../services/TokenListService'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { formatTokenAmount } from '../utils/blockchain'

interface TokenListItemProps {
  address: Address
  name: string
  symbol: string
  decimals: number
  logo?: string
}

function TokenListItem({ address, name, symbol, decimals, logo }: TokenListItemProps) {
  const { balance, isLoading } = useTokenBalance({ tokenAddress: address })

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:bg-gray-750">
      <div className="flex items-center gap-3">
        {logo ? (
          <img src={logo} alt={symbol} className="h-10 w-10 rounded-full" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
            <span className="text-sm font-semibold text-gray-300">{symbol[0]}</span>
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{symbol}</p>
          <p className="text-sm text-gray-400">{name}</p>
        </div>
      </div>

      <div className="text-right">
        {isLoading ? (
          <div className="h-5 w-20 animate-pulse rounded bg-gray-700" />
        ) : (
          <>
            <p className="font-semibold text-white">
              {balance ? formatTokenAmount(balance, decimals) : '0'}
            </p>
            <p className="text-sm text-gray-400">{symbol}</p>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * TokenList utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of TokenList.
 */
export function TokenList() {
  const [searchQuery, setSearchQuery] = useState('')

  const tokens = searchQuery
    ? tokenListService.searchTokens(searchQuery)
    : tokenListService.getAllTokens()

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search tokens..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
      />

      <div className="space-y-2">
        {tokens.length > 0 ? (
          tokens.map((token) => (
            <TokenListItem
              key={token.address}
              address={token.address}
              name={token.name}
              symbol={token.symbol}
              decimals={token.decimals}
              logo={token.logo}
            />
          ))
        ) : (
          <p className="py-8 text-center text-gray-400">No tokens found</p>
        )}
      </div>
    </div>
  )
}

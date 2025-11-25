/**
 * Chain icon component
 */

'use client'

interface ChainIconProps {
  chainId: number
  size?: number
  className?: string
}

/**
 * ChainIcon utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ChainIcon.
 */
export function ChainIcon({ chainId, size = 24, className = '' }: ChainIconProps) {
  const chainInfo = getChainInfo(chainId)

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: chainInfo.color,
      }}
      title={chainInfo.name}
    >
      <span className="font-semibold text-white" style={{ fontSize: size * 0.5 }}>
        {chainInfo.symbol}
      </span>
    </div>
  )
}

function getChainInfo(chainId: number): {
  name: string
  symbol: string
  color: string
} {
  switch (chainId) {
    case 1:
      return { name: 'Ethereum', symbol: 'Ξ', color: '#627EEA' }
    case 8453:
      return { name: 'Base', symbol: 'B', color: '#0052FF' }
    case 137:
      return { name: 'Polygon', symbol: 'P', color: '#8247E5' }
    case 42161:
      return { name: 'Arbitrum', symbol: 'A', color: '#28A0F0' }
    case 10:
      return { name: 'Optimism', symbol: 'O', color: '#FF0420' }
    case 56:
      return { name: 'BSC', symbol: 'B', color: '#F0B90B' }
    case 43114:
      return { name: 'Avalanche', symbol: 'A', color: '#E84142' }
    case 250:
      return { name: 'Fantom', symbol: 'F', color: '#1969FF' }
    default:
      return { name: 'Unknown', symbol: '?', color: '#6B7280' }
  }
}

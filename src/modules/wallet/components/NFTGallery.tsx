/**
 * NFT gallery component
 */

'use client'

import { useState } from 'react'
import { type Address } from 'viem'
import { NFTCard } from './NFTCard'

interface NFTItem {
  contractAddress: Address
  tokenId: string
}

interface NFTGalleryProps {
  nfts: NFTItem[]
  onNFTClick?: (nft: NFTItem) => void
  columns?: 2 | 3 | 4
}

export function NFTGallery({ nfts, onNFTClick, columns = 3 }: NFTGalleryProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null)

  const handleNFTClick = (nft: NFTItem) => {
    setSelectedNFT(nft)
    onNFTClick?.(nft)
  }

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  if (nfts.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-gray-700 bg-gray-800 p-8">
        <p className="text-gray-400">No NFTs found</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {nfts.map((nft, index) => (
        <NFTCard
          key={`${nft.contractAddress}-${nft.tokenId}-${index}`}
          contractAddress={nft.contractAddress}
          tokenId={nft.tokenId}
          onClick={() => handleNFTClick(nft)}
        />
      ))}
    </div>
  )
}

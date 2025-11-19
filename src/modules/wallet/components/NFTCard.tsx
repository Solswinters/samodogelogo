/**
 * NFT card component
 */

'use client'

import { type Address } from 'viem'
import { useNFT } from '../hooks/useNFT'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import { Skeleton } from '@/shared/components/Skeleton'

interface NFTCardProps {
  contractAddress: Address
  tokenId: string
  onClick?: () => void
}

export function NFTCard({ contractAddress, tokenId, onClick }: NFTCardProps) {
  const { nft, balance, isLoading } = useNFT(contractAddress, tokenId)

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    )
  }

  if (!nft) {
    return (
      <Card className="overflow-hidden">
        <div className="flex h-48 items-center justify-center bg-gray-700">
          <p className="text-gray-400">Failed to load NFT</p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <img
          src={nft.image}
          alt={nft.name}
          className="h-full w-full object-cover"
          onError={e => {
            e.currentTarget.src = '/placeholder-nft.png'
          }}
        />
        {balance > 1n && (
          <div className="absolute top-2 right-2">
            <Badge variant="primary">x{balance.toString()}</Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-white truncate">{nft.name}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {nft.attributes.slice(0, 3).map((attr, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {attr.trait_type}: {attr.value}
              </Badge>
            ))}
            {nft.attributes.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{nft.attributes.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

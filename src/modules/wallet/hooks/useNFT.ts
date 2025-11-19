/**
 * Hook for NFT operations
 */

import { useState, useEffect, useCallback } from 'react'
import { type Address } from 'viem'
import { usePublicClient, useAccount } from 'wagmi'
import { NFTService, type NFT } from '../services/NFTService'

export function useNFT(contractAddress: Address, tokenId?: string) {
  const publicClient = usePublicClient()
  const { address: accountAddress } = useAccount()
  const [nft, setNFT] = useState<NFT | null>(null)
  const [balance, setBalance] = useState<bigint>(0n)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const service = publicClient ? new NFTService(publicClient) : null

  const fetchNFTMetadata = useCallback(async () => {
    if (!service || !tokenId) return

    setIsLoading(true)
    setError(null)

    try {
      const metadata = await service.getNFTMetadata(contractAddress, tokenId)
      setNFT(metadata)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch NFT')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [service, contractAddress, tokenId])

  const fetchBalance = useCallback(async () => {
    if (!service || !accountAddress) return

    setIsLoading(true)
    setError(null)

    try {
      let balance: bigint
      if (tokenId) {
        // ERC1155
        balance = await service.getERC1155Balance(contractAddress, accountAddress, tokenId)
      } else {
        // ERC721
        balance = await service.getERC721Balance(contractAddress, accountAddress)
      }
      setBalance(balance)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balance')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [service, contractAddress, accountAddress, tokenId])

  useEffect(() => {
    void fetchNFTMetadata()
  }, [fetchNFTMetadata])

  useEffect(() => {
    void fetchBalance()
  }, [fetchBalance])

  return {
    nft,
    balance,
    isLoading,
    error,
    refetch: useCallback(() => {
      void fetchNFTMetadata()
      void fetchBalance()
    }, [fetchNFTMetadata, fetchBalance]),
  }
}

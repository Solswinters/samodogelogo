/**
 * Service for NFT operations
 */

import { type Address, type PublicClient } from 'viem'

export interface NFT {
  tokenId: string
  contractAddress: Address
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface NFTBalance {
  contractAddress: Address
  tokenId: string
  balance: bigint
}

export class NFTService {
  private client: PublicClient

  constructor(client: PublicClient) {
    this.client = client
  }

  /**
   * Get NFT metadata
   */
  async getNFTMetadata(contractAddress: Address, tokenId: string): Promise<NFT | null> {
    try {
      // Get token URI
      const tokenURI = (await this.client.readContract({
        address: contractAddress,
        abi: [
          {
            inputs: [{ name: 'tokenId', type: 'uint256' }],
            name: 'tokenURI',
            outputs: [{ name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'tokenURI',
        args: [BigInt(tokenId)],
      })) as string

      if (!tokenURI) return null

      // Fetch metadata
      const response = await fetch(tokenURI)
      if (!response.ok) return null

      const metadata = (await response.json()) as Omit<NFT, 'tokenId' | 'contractAddress'>

      return {
        tokenId,
        contractAddress,
        ...metadata,
      }
    } catch (error) {
      console.error('Failed to fetch NFT metadata:', error)
      return null
    }
  }

  /**
   * Get NFT balance for ERC721
   */
  async getERC721Balance(contractAddress: Address, ownerAddress: Address): Promise<bigint> {
    try {
      const balance = (await this.client.readContract({
        address: contractAddress,
        abi: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'balanceOf',
        args: [ownerAddress],
      })) as bigint

      return balance
    } catch (error) {
      console.error('Failed to fetch ERC721 balance:', error)
      return 0n
    }
  }

  /**
   * Get NFT balance for ERC1155
   */
  async getERC1155Balance(
    contractAddress: Address,
    ownerAddress: Address,
    tokenId: string
  ): Promise<bigint> {
    try {
      const balance = (await this.client.readContract({
        address: contractAddress,
        abi: [
          {
            inputs: [
              { name: 'account', type: 'address' },
              { name: 'id', type: 'uint256' },
            ],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'balanceOf',
        args: [ownerAddress, BigInt(tokenId)],
      })) as bigint

      return balance
    } catch (error) {
      console.error('Failed to fetch ERC1155 balance:', error)
      return 0n
    }
  }

  /**
   * Check if contract supports interface (ERC165)
   */
  async supportsInterface(contractAddress: Address, interfaceId: string): Promise<boolean> {
    try {
      const supported = (await this.client.readContract({
        address: contractAddress,
        abi: [
          {
            inputs: [{ name: 'interfaceId', type: 'bytes4' }],
            name: 'supportsInterface',
            outputs: [{ name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'supportsInterface',
        args: [interfaceId as `0x${string}`],
      })) as boolean

      return supported
    } catch (error) {
      console.error('Failed to check interface support:', error)
      return false
    }
  }
}

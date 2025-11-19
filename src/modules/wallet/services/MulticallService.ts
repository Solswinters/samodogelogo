/**
 * Service for batched contract calls (Multicall)
 */

import { type PublicClient, type Address } from 'viem'

export interface Call {
  address: Address
  abi: unknown[]
  functionName: string
  args?: unknown[]
}

export interface CallResult<T = unknown> {
  success: boolean
  data?: T
  error?: Error
}

export class MulticallService {
  private client: PublicClient

  constructor(client: PublicClient) {
    this.client = client
  }

  /**
   * Execute multiple contract calls in a single request
   */
  async multicall<T = unknown>(calls: Call[]): Promise<CallResult<T>[]> {
    try {
      const results = await this.client.multicall({
        contracts: calls.map(call => ({
          address: call.address,
          abi: call.abi,
          functionName: call.functionName,
          args: call.args,
        })),
        allowFailure: true,
      })

      return results.map(result => {
        if (result.status === 'success') {
          return {
            success: true,
            data: result.result as T,
          }
        } else {
          return {
            success: false,
            error: new Error(result.error?.message ?? 'Call failed'),
          }
        }
      })
    } catch (error) {
      console.error('Multicall failed:', error)
      return calls.map(() => ({
        success: false,
        error: error instanceof Error ? error : new Error('Multicall failed'),
      }))
    }
  }

  /**
   * Get multiple token balances in one call
   */
  async getTokenBalances(
    tokenAddresses: Address[],
    ownerAddress: Address
  ): Promise<Map<Address, bigint>> {
    const calls: Call[] = tokenAddresses.map(tokenAddress => ({
      address: tokenAddress,
      abi: [
        {
          inputs: [{ name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'balanceOf',
      args: [ownerAddress],
    }))

    const results = await this.multicall<bigint>(calls)

    const balances = new Map<Address, bigint>()
    tokenAddresses.forEach((address, index) => {
      const result = results[index]
      if (result?.success && result.data !== undefined) {
        balances.set(address, result.data)
      } else {
        balances.set(address, 0n)
      }
    })

    return balances
  }

  /**
   * Get multiple token metadata in one call
   */
  async getTokenMetadata(tokenAddresses: Address[]): Promise<
    Map<
      Address,
      {
        name: string
        symbol: string
        decimals: number
      }
    >
  > {
    const calls: Call[] = []

    // Add name calls
    tokenAddresses.forEach(address => {
      calls.push({
        address,
        abi: [
          {
            name: 'name',
            outputs: [{ name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'name',
      })
    })

    // Add symbol calls
    tokenAddresses.forEach(address => {
      calls.push({
        address,
        abi: [
          {
            name: 'symbol',
            outputs: [{ name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'symbol',
      })
    })

    // Add decimals calls
    tokenAddresses.forEach(address => {
      calls.push({
        address,
        abi: [
          {
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'decimals',
      })
    })

    const results = await this.multicall(calls)

    const metadata = new Map<Address, { name: string; symbol: string; decimals: number }>()

    const count = tokenAddresses.length
    tokenAddresses.forEach((address, index) => {
      const nameResult = results[index]
      const symbolResult = results[index + count]
      const decimalsResult = results[index + count * 2]

      metadata.set(address, {
        name: nameResult?.success && nameResult.data ? String(nameResult.data) : 'Unknown',
        symbol: symbolResult?.success && symbolResult.data ? String(symbolResult.data) : '???',
        decimals: decimalsResult?.success && decimalsResult.data ? Number(decimalsResult.data) : 18,
      })
    })

    return metadata
  }
}

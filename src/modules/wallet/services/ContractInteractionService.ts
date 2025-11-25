import { PublicClient, WalletClient, Address } from 'viem'

import { IService } from '@/common/interfaces'

/**
 * Service for managing contract interactions
 */

export interface ContractCallParams {
  address: Address
  abi: unknown[]
  functionName: string
  args?: unknown[]
}

export interface TransactionResult {
  hash: Address
  success: boolean
  error?: string
}

export class ContractInteractionService implements IService {
  public readonly serviceName = 'ContractInteractionService'

  private publicClient?: PublicClient
  private walletClient?: WalletClient

  /**
   * Initialize clients
   */
  init(publicClient: PublicClient, walletClient?: WalletClient): void {
    this.publicClient = publicClient
    this.walletClient = walletClient
  }

  /**
   * Read from contract
   */
  async read<T>(params: ContractCallParams): Promise<T> {
    if (!this.publicClient) {
      throw new Error('Public client not initialized')
    }

    const result = await this.publicClient.readContract({
      address: params.address,
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
    })

    return result as T
  }

  /**
   * Write to contract
   */
  async write(params: ContractCallParams): Promise<TransactionResult> {
    if (!this.walletClient) {
      throw new Error('Wallet client not initialized')
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      })

      return {
        hash: hash as Address,
        success: true,
      }
    } catch (error) {
      return {
        hash: '0x0' as Address,
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed',
      }
    }
  }

  /**
   * Simulate contract call
   */
  async simulate(params: ContractCallParams): Promise<{ success: boolean; error?: string }> {
    if (!this.publicClient) {
      throw new Error('Public client not initialized')
    }

    try {
      await this.publicClient.simulateContract({
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Simulation failed',
      }
    }
  }

  destroy(): void {
    this.publicClient = undefined
    this.walletClient = undefined
  }
}

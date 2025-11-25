/**
 * Smart contract interaction service
 */

import { type Address, type WriteContractReturnType } from 'viem'
import { writeContract, readContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '../config/web3'
import { logger } from '@/shared/logger'

export interface ContractCallParams {
  address: Address
  abi: unknown[]
  functionName: string
  args?: unknown[]
  value?: bigint
}

export interface ContractReadParams {
  address: Address
  abi: unknown[]
  functionName: string
  args?: unknown[]
}

export class ContractService {
  async write(params: ContractCallParams): Promise<WriteContractReturnType> {
    try {
      logger.info('Writing to contract', { function: params.functionName })

      const hash = await writeContract(config, {
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
        value: params.value,
      })

      logger.info('Contract write successful', { hash })
      return hash
    } catch (error) {
      logger.error('Contract write failed', { error, function: params.functionName })
      throw error
    }
  }

  async read<T>(params: ContractReadParams): Promise<T> {
    try {
      const result = await readContract(config, {
        address: params.address,
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      })

      return result as T
    } catch (error) {
      logger.error('Contract read failed', { error, function: params.functionName })
      throw error
    }
  }

  async waitForTransaction(hash: `0x${string}`): Promise<void> {
    try {
      logger.info('Waiting for transaction', { hash })

      const receipt = await waitForTransactionReceipt(config, { hash })

      if (receipt.status === 'success') {
        logger.info('Transaction confirmed', { hash, blockNumber: receipt.blockNumber })
      } else {
        throw new Error('Transaction failed')
      }
    } catch (error) {
      logger.error('Transaction wait failed', { error, hash })
      throw error
    }
  }

  async writeAndWait(params: ContractCallParams): Promise<void> {
    const hash = await this.write(params)
    await this.waitForTransaction(hash)
  }
}

/**
 * contractService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of contractService.
 */
export const contractService = new ContractService()

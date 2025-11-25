/**
 * Gas estimation and management service
 */

import { type Address } from 'viem'
import { config } from '../config/web3'
import { estimateGas, getGasPrice } from '@wagmi/core'
import { formatGwei } from '../utils/blockchain'

export interface GasEstimation {
  gasLimit: bigint
  gasPrice: bigint
  totalCost: bigint
  totalCostGwei: string
  totalCostEth: string
}

export class GasService {
  async estimateContractGas(
    address: Address,
    abi: unknown[],
    functionName: string,
    args?: unknown[],
    value?: bigint
  ): Promise<bigint> {
    try {
      const gas = await estimateGas(config, {
        to: address,
        data: undefined, // Would need to encode function call
        value,
      })

      return gas
    } catch (error) {
      console.error('Gas estimation failed', { error })
      // Return a safe default
      return 300000n
    }
  }

  async getCurrentGasPrice(): Promise<bigint> {
    try {
      const gasPrice = await getGasPrice(config)
      return gasPrice
    } catch (error) {
      console.error('Failed to get gas price', { error })
      return 0n
    }
  }

  async getGasEstimation(
    address: Address,
    abi: unknown[],
    functionName: string,
    args?: unknown[],
    value?: bigint
  ): Promise<GasEstimation> {
    const [gasLimit, gasPrice] = await Promise.all([
      this.estimateContractGas(address, abi, functionName, args, value),
      this.getCurrentGasPrice(),
    ])

    const totalCost = gasLimit * gasPrice

    return {
      gasLimit,
      gasPrice,
      totalCost,
      totalCostGwei: formatGwei(totalCost),
      totalCostEth: (Number(totalCost) / 1e18).toFixed(6),
    }
  }

  calculateGasCost(gasLimit: bigint, gasPrice: bigint): bigint {
    return gasLimit * gasPrice
  }

  formatGasPrice(gasPrice: bigint): string {
    return formatGwei(gasPrice)
  }
}

/**
 * gasService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of gasService.
 */
export const gasService = new GasService()

/**
 * Gas estimation service
 */

import { IService } from "@/common/interfaces";

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedCost: bigint;
  estimatedCostUSD?: string;
}

export class GasEstimationService implements IService {
  public readonly serviceName = "GasEstimationService";
  private ethPrice = 2000; // Default ETH price in USD

  /**
   * Estimate gas for transaction
   */
  async estimateGas(params: {
    to: string;
    data?: string;
    value?: bigint;
  }): Promise<GasEstimate> {
    // Mock implementation
    const gasLimit = 200000n;
    const gasPrice = 20000000000n; // 20 gwei
    const maxFeePerGas = 30000000000n; // 30 gwei
    const maxPriorityFeePerGas = 2000000000n; // 2 gwei

    const estimatedCost = gasLimit * gasPrice;
    const estimatedCostUSD = this.weiToUSD(estimatedCost);

    return {
      gasLimit,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      estimatedCost,
      estimatedCostUSD,
    };
  }

  /**
   * Set ETH price for USD conversion
   */
  setEthPrice(priceUSD: number): void {
    this.ethPrice = priceUSD;
  }

  /**
   * Convert wei to USD
   */
  private weiToUSD(wei: bigint): string {
    const eth = Number(wei) / 1e18;
    return (eth * this.ethPrice).toFixed(2);
  }

  destroy(): void {
    // Cleanup if needed
  }
}


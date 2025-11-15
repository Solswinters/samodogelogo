/**
 * Multi-chain support infrastructure
 */

import { IService } from "@/common/interfaces";

export interface ChainInfo {
  id: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
}

export class MultiChainService implements IService {
  public readonly serviceName = "MultiChainService";
  private supportedChains: Map<number, ChainInfo> = new Map();
  private currentChainId?: number;

  /**
   * Register a supported chain
   */
  registerChain(chain: ChainInfo): void {
    this.supportedChains.set(chain.id, chain);
  }

  /**
   * Get chain info
   */
  getChain(chainId: number): ChainInfo | undefined {
    return this.supportedChains.get(chainId);
  }

  /**
   * Get all supported chains
   */
  getAllChains(): ChainInfo[] {
    return Array.from(this.supportedChains.values());
  }

  /**
   * Check if chain is supported
   */
  isChainSupported(chainId: number): boolean {
    return this.supportedChains.has(chainId);
  }

  /**
   * Set current chain
   */
  setCurrentChain(chainId: number): void {
    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} is not supported`);
    }
    this.currentChainId = chainId;
  }

  /**
   * Get current chain
   */
  getCurrentChain(): ChainInfo | undefined {
    return this.currentChainId ? this.getChain(this.currentChainId) : undefined;
  }

  destroy(): void {
    this.supportedChains.clear();
  }
}


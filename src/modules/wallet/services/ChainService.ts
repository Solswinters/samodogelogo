/**
 * Chain and network management service
 */

import { type Chain } from 'viem'
import { base, baseSepolia, mainnet, sepolia } from 'viem/chains'

export class ChainService {
  private supportedChains: Chain[] = [base, baseSepolia, mainnet, sepolia]

  getSupportedChains(): Chain[] {
    return this.supportedChains
  }

  getChainById(chainId: number): Chain | undefined {
    return this.supportedChains.find((chain) => chain.id === chainId)
  }

  getChainByName(name: string): Chain | undefined {
    return this.supportedChains.find((chain) => chain.name.toLowerCase() === name.toLowerCase())
  }

  isChainSupported(chainId: number): boolean {
    return this.supportedChains.some((chain) => chain.id === chainId)
  }

  getChainExplorerUrl(chainId: number): string | undefined {
    const chain = this.getChainById(chainId)
    return chain?.blockExplorers?.default?.url
  }

  getChainRpcUrl(chainId: number): string | undefined {
    const chain = this.getChainById(chainId)
    return chain?.rpcUrls.default.http[0]
  }

  getChainNativeCurrency(chainId: number) {
    const chain = this.getChainById(chainId)
    return chain?.nativeCurrency
  }

  getMainnetChains(): Chain[] {
    return [base, mainnet]
  }

  getTestnetChains(): Chain[] {
    return [baseSepolia, sepolia]
  }

  isMainnet(chainId: number): boolean {
    return this.getMainnetChains().some((chain) => chain.id === chainId)
  }

  isTestnet(chainId: number): boolean {
    return this.getTestnetChains().some((chain) => chain.id === chainId)
  }
}

/**
 * chainService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of chainService.
 */
export const chainService = new ChainService()

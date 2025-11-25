/**
 * Chain configuration for wallet module
 */

import { base, baseSepolia } from "@reown/appkit/networks";

/**
 * SUPPORTED_CHAINS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SUPPORTED_CHAINS.
 */
export const SUPPORTED_CHAINS = [base, baseSepolia] as const;

/**
 * CHAIN_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CHAIN_CONFIG.
 */
export const CHAIN_CONFIG = {
  DEFAULT_CHAIN_ID: base.id,
  TESTNET_CHAIN_ID: baseSepolia.id,

  // Chain metadata
  CHAINS: {
    [base.id]: {
      id: base.id,
      name: "Base",
      nativeCurrency: base.nativeCurrency,
      rpcUrls: base.rpcUrls,
      blockExplorers: base.blockExplorers,
      isTestnet: false,
    },
    [baseSepolia.id]: {
      id: baseSepolia.id,
      name: "Base Sepolia",
      nativeCurrency: baseSepolia.nativeCurrency,
      rpcUrls: baseSepolia.rpcUrls,
      blockExplorers: baseSepolia.blockExplorers,
      isTestnet: true,
    },
  },
} as const;

/**
 * getChainById utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getChainById.
 */
export function getChainById(chainId: number) {
  return CHAIN_CONFIG.CHAINS[chainId];
}

/**
 * getDefaultChain utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getDefaultChain.
 */
export function getDefaultChain() {
  return getChainById(CHAIN_CONFIG.DEFAULT_CHAIN_ID);
}

/**
 * isTestnet utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isTestnet.
 */
export function isTestnet(chainId: number): boolean {
  const chain = getChainById(chainId);
  return chain?.isTestnet ?? false;
}


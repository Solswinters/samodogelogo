/**
 * Chain configuration for wallet module
 */

import { base, baseSepolia } from "@reown/appkit/networks";

export const SUPPORTED_CHAINS = [base, baseSepolia] as const;

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

export function getChainById(chainId: number) {
  return CHAIN_CONFIG.CHAINS[chainId];
}

export function getDefaultChain() {
  return getChainById(CHAIN_CONFIG.DEFAULT_CHAIN_ID);
}

export function isTestnet(chainId: number): boolean {
  const chain = getChainById(chainId);
  return chain?.isTestnet ?? false;
}


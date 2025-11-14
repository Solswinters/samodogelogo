import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

// Create a metadata object
const metadata = {
  name: 'Jump Game',
  description: 'Onchain Jump Obstacle Game with Token Rewards',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create query client
export const queryClient = new QueryClient();

// Create wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [base, baseSepolia],
  projectId,
  ssr: true,
});

// Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, baseSepolia],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

export const config = wagmiAdapter.wagmiConfig;


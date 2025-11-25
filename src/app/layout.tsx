import type { Metadata } from 'next'

import { cookieToInitialState } from 'wagmi'
import { headers } from 'next/headers'

import '@/styles/animations.css'
import '@/styles/globals.css'
import '@/styles/print.css'
import '@/styles/utilities.css'
import Web3Provider from '@/modules/wallet/components/Web3Provider'
import { Providers } from './providers'
import { config } from '@/modules/wallet/config/web3'

export const metadata: Metadata = {
  title: 'Jump Game - Onchain Rewards',
  description: 'Play the jump obstacle game and earn tokens on Base',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))

  return (
    <html lang="en">
      <body className="antialiased">
        <Web3Provider initialState={initialState}>
          <Providers>{children}</Providers>
        </Web3Provider>
      </body>
    </html>
  )
}

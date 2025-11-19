import type { Metadata } from 'next'
import { headers } from 'next/headers'
import '@/styles/globals.css'
import { cookieToInitialState } from 'wagmi'
import { config } from '@/modules/wallet/config/web3'
import Web3Provider from '@/modules/wallet/components/Web3Provider'
import { Providers } from './providers'

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

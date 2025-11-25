/**
 * SEO utilities and metadata
 */

import type { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

/**
 * generateMetadata utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateMetadata.
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = '/og-image.png',
    url = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
  } = config

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Samodoge Jump Game',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@yourusername',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * defaultSEO utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of defaultSEO.
 */
export const defaultSEO: SEOConfig = {
  title: 'Samodoge Jump Game - Play & Earn Crypto Rewards',
  description:
    'Play the ultimate obstacle jump game and earn token rewards on Base blockchain. Compete in multiplayer tournaments and climb the leaderboard.',
  keywords: [
    'crypto game',
    'blockchain game',
    'play to earn',
    'Base network',
    'jump game',
    'obstacle course',
    'multiplayer',
    'web3 gaming',
  ],
}

/**
 * generateStructuredData utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateStructuredData.
 */
export function generateStructuredData(type: 'Game' | 'Organization') {
  if (type === 'Game') {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: 'Samodoge Jump Game',
      description: defaultSEO.description,
      genre: 'Action/Arcade',
      gamePlatform: 'Web Browser',
      applicationCategory: 'Game',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Samodoge',
    url: process.env.NEXT_PUBLIC_APP_URL,
  }
}

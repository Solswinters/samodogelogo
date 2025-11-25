/**
 * Environment configuration
 */

export interface EnvironmentConfig {
  nodeEnv: 'development' | 'production' | 'test'
  apiUrl: string
  wsUrl: string
  chainId: number
  contractAddresses: {
    gameToken: string
    gameRewards: string
  }
  analytics: {
    enabled: boolean
    googleAnalyticsId?: string
  }
  sentry: {
    enabled: boolean
    dsn?: string
  }
}

function getConfig(): EnvironmentConfig {
  const nodeEnv = (process.env.NODE_ENV || 'development') as EnvironmentConfig['nodeEnv']

  return {
    nodeEnv,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
    contractAddresses: {
      gameToken: process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS || '',
      gameRewards: process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS || '',
    },
    analytics: {
      enabled: nodeEnv === 'production',
      googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    },
    sentry: {
      enabled: nodeEnv === 'production',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
  }
}

/**
 * env utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of env.
 */
export const env = getConfig()

// Validate required environment variables
/**
 * validateEnvironment utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateEnvironment.
 */
export function validateEnvironment() {
  const required = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_WS_URL', 'NEXT_PUBLIC_CHAIN_ID']

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0 && env.nodeEnv === 'production') {
    console.error('Missing required environment variables:', missing)
  }
}

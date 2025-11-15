/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

export interface EnvironmentVariables {
  // App
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_APP_URL: string

  // Blockchain
  NEXT_PUBLIC_GAME_TOKEN_ADDRESS: string
  NEXT_PUBLIC_GAME_REWARDS_ADDRESS: string
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string

  // Server
  NEXT_PUBLIC_SOCKET_URL?: string
  NEXT_PUBLIC_API_URL?: string

  // Optional
  NEXT_PUBLIC_CHAIN_ID?: string
  NEXT_PUBLIC_ENABLE_ANALYTICS?: string
}

const requiredVars = [
  'NEXT_PUBLIC_GAME_TOKEN_ADDRESS',
  'NEXT_PUBLIC_GAME_REWARDS_ADDRESS',
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
] as const

const optionalVars = [
  'NEXT_PUBLIC_SOCKET_URL',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_CHAIN_ID',
  'NEXT_PUBLIC_ENABLE_ANALYTICS',
] as const

export function validateEnvironment(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  }

  // Check optional variables
  for (const varName of optionalVars) {
    if (!process.env[varName]) {
      warnings.push(`Optional environment variable not set: ${varName}`)
    }
  }

  // Validate APP_URL format
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_APP_URL)
    } catch {
      errors.push('NEXT_PUBLIC_APP_URL must be a valid URL')
    }
  }

  // Validate addresses (basic check)
  const addresses = ['NEXT_PUBLIC_GAME_TOKEN_ADDRESS', 'NEXT_PUBLIC_GAME_REWARDS_ADDRESS']

  for (const addrVar of addresses) {
    const addr = process.env[addrVar]
    if (addr && !addr.startsWith('0x')) {
      errors.push(`${addrVar} must start with 0x`)
    }
    if (addr && addr.length !== 42) {
      errors.push(`${addrVar} must be 42 characters long`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function getEnvironment(): Partial<EnvironmentVariables> {
  return {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_GAME_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS,
    NEXT_PUBLIC_GAME_REWARDS_ADDRESS: process.env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  }
}

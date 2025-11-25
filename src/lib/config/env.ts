import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  PORT: z.string().default('3000'),
  NEXT_PUBLIC_GAME_TOKEN_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  NEXT_PUBLIC_GAME_REWARDS_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  NEXT_PUBLIC_CHAIN_ID: z.string().default('8453'),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  VERIFIER_PRIVATE_KEY: z.string().optional(),
  BASESCAN_API_KEY: z.string().optional(),
  PRIVATE_KEY: z.string().optional(),
  NEXT_PUBLIC_ENABLE_MULTIPLAYER: z.string().default('true'),
  NEXT_PUBLIC_ENABLE_REWARDS: z.string().default('true'),
  NEXT_PUBLIC_MAX_PLAYERS_PER_ROOM: z.string().default('4'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  SOCKET_CORS_ORIGIN: z.string().optional(),
  NEXT_PUBLIC_SOCKET_URL: z.string().optional(),
})

function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (err: unknown) {
    console.error('❌ Invalid environment variables:')
    if (err instanceof z.ZodError) {
      err.issues.forEach((issue) => {
        console.error(`  ${issue.path.join('.')}: ${issue.message}`)
      })
    }
    throw new Error('Invalid environment variables')
  }
}

/**
 * env utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of env.
 */
export const env = validateEnv()

/**
 * config utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of config.
 */
export const config = {
  app: {
    env: env.NODE_ENV,
    url: env.NEXT_PUBLIC_APP_URL ?? `http://localhost:${env.PORT}`,
    port: parseInt(env.PORT, 10),
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },
  blockchain: {
    gameTokenAddress: env.NEXT_PUBLIC_GAME_TOKEN_ADDRESS as `0x${string}` | undefined,
    gameRewardsAddress: env.NEXT_PUBLIC_GAME_REWARDS_ADDRESS as `0x${string}` | undefined,
    chainId: parseInt(env.NEXT_PUBLIC_CHAIN_ID, 10),
  },
  web3: {
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
  features: {
    enableMultiplayer: env.NEXT_PUBLIC_ENABLE_MULTIPLAYER === 'true',
    enableRewards: env.NEXT_PUBLIC_ENABLE_REWARDS === 'true',
    maxPlayersPerRoom: parseInt(env.NEXT_PUBLIC_MAX_PLAYERS_PER_ROOM, 10),
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  keys: {
    verifierPrivateKey: env.VERIFIER_PRIVATE_KEY,
    basescanApiKey: env.BASESCAN_API_KEY,
    privateKey: env.PRIVATE_KEY,
  },
  socket: {
    url: env.NEXT_PUBLIC_SOCKET_URL ?? `http://localhost:${env.PORT}`,
    corsOrigin: env.SOCKET_CORS_ORIGIN ?? env.NEXT_PUBLIC_APP_URL ?? `http://localhost:${env.PORT}`,
  },
} as const

export type AppConfig = typeof config
export type Environment = z.infer<typeof envSchema>

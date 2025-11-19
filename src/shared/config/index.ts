/**
 * Application configuration management
 */

export interface AppConfig {
  app: {
    name: string
    version: string
    environment: 'development' | 'production' | 'test'
  }
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  features: {
    enableMultiplayer: boolean
    enableStaking: boolean
    enableAchievements: boolean
    enableLeaderboard: boolean
  }
  game: {
    defaultDifficulty: string
    maxComboMultiplier: number
    syncInterval: number
  }
}

const config: AppConfig = {
  app: {
    name: 'Jump Game',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: (process.env.NODE_ENV) || 'development',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    retries: 3,
  },
  features: {
    enableMultiplayer: process.env.NEXT_PUBLIC_ENABLE_MULTIPLAYER === 'true',
    enableStaking: process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true',
    enableAchievements: process.env.NEXT_PUBLIC_ENABLE_ACHIEVEMENTS !== 'false',
    enableLeaderboard: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD !== 'false',
  },
  game: {
    defaultDifficulty: process.env.NEXT_PUBLIC_DEFAULT_DIFFICULTY || 'normal',
    maxComboMultiplier: 5,
    syncInterval: 50,
  },
}

export default config
export const getConfig = () => config

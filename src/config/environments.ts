// Environment-specific configurations

export interface EnvironmentConfig {
  name: 'development' | 'production' | 'test'
  apiUrl: string
  socketUrl: string
  enableLogging: boolean
  enableAnalytics: boolean
  enableDevTools: boolean
  cacheEnabled: boolean
  rateLimitEnabled: boolean
  minifyAssets: boolean
}

// Development configuration
export const developmentConfig: EnvironmentConfig = {
  name: 'development',
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000',
  enableLogging: true,
  enableAnalytics: false,
  enableDevTools: true,
  cacheEnabled: false,
  rateLimitEnabled: false,
  minifyAssets: false,
}

// Production configuration
export const productionConfig: EnvironmentConfig = {
  name: 'production',
  apiUrl: '/api',
  socketUrl: '',
  enableLogging: false,
  enableAnalytics: true,
  enableDevTools: false,
  cacheEnabled: true,
  rateLimitEnabled: true,
  minifyAssets: true,
}

// Test configuration
export const testConfig: EnvironmentConfig = {
  name: 'test',
  apiUrl: 'http://localhost:3000/api',
  socketUrl: 'http://localhost:3000',
  enableLogging: false,
  enableAnalytics: false,
  enableDevTools: false,
  cacheEnabled: false,
  rateLimitEnabled: false,
  minifyAssets: false,
}

// Get current environment configuration
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development'

  switch (env) {
    case 'production':
      return productionConfig
    case 'test':
      return testConfig
    case 'development':
    default:
      return developmentConfig
  }
}

// Export current config
export const currentEnvConfig = getEnvironmentConfig()

// Helper functions
export const isDevelopment = () => currentEnvConfig.name === 'development'
export const isProduction = () => currentEnvConfig.name === 'production'
export const isTest = () => currentEnvConfig.name === 'test'


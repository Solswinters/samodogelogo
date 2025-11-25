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
/**
 * developmentConfig utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of developmentConfig.
 */
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
/**
 * productionConfig utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of productionConfig.
 */
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
/**
 * testConfig utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of testConfig.
 */
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
/**
 * getEnvironmentConfig utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getEnvironmentConfig.
 */
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
/**
 * currentEnvConfig utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of currentEnvConfig.
 */
export const currentEnvConfig = getEnvironmentConfig()

// Helper functions
/**
 * isDevelopment utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isDevelopment.
 */
export const isDevelopment = () => currentEnvConfig.name === 'development'
/**
 * isProduction utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isProduction.
 */
export const isProduction = () => currentEnvConfig.name === 'production'
/**
 * isTest utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isTest.
 */
export const isTest = () => currentEnvConfig.name === 'test'


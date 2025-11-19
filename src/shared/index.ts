/**
 * Central exports for shared modules
 */

// Components
export * from './components'

// Hooks
export * from './hooks'

// Utils
export * from './utils'
export * from './array'
export * from './string'
export * from './object'
export * from './date'
export * from './math'

// Services
export { logger, LogLevel } from './logger'
export {
  AppError,
  ValidationError,
  NetworkError,
  AuthenticationError,
  NotFoundError,
  handleError,
  isOperationalError,
} from './error-handler'
export { cache } from './cache'
export { storage } from './storage'
export { eventBus } from './event-bus'
export { apiClient, type ApiResponse, type ApiError } from './api'
export { retry, retryWithJitter, type RetryOptions } from './retry'
export { debounce, throttle, debounceLeading } from './debounce'
export * from './validation'
export * from './constants'
export * from './http'
export { default as config, getConfig } from './config'
export { performanceMonitor, measureAsync, measureSync } from './performance'
export * from './types'

// React utilities
export { SuspenseBoundary } from './react/Suspense'
export { ClientOnly } from './react/ClientOnly'

// Test utilities
export * from './test-utils'

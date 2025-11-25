/**
 * Global error handler with logging and reporting
 */

import { logger } from './logger'
import type { AppError, ErrorMetadata } from './errors'
import { isRetryableError } from './errors'

export interface ErrorContext {
  userId?: string
  action?: string
  metadata?: ErrorMetadata
  silent?: boolean
  reportable?: boolean
}

export interface ErrorReport {
  error: Error
  context?: ErrorContext
  timestamp: number
  userAgent?: string
  url?: string
}

export class ErrorHandler {
  private static errorQueue: ErrorReport[] = []
  private static maxQueueSize = 100

  static handle(error: unknown, context?: ErrorContext): void {
    if (context?.silent) {
      return
    }

    const normalizedError = this.normalizeError(error)

    if (!context?.silent) {
      logger.error(normalizedError.message, normalizedError, context?.metadata)

      if (context?.action) {
        logger.error(`Error during action: ${context.action}`, normalizedError)
      }
    }

    const shouldReport =
      context?.reportable !== false &&
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'production'

    if (shouldReport) {
      this.reportError(normalizedError, context)
    }
  }

  private static normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error
    }
    if (typeof error === 'string') {
      return new Error(error)
    }
    if (typeof error === 'object' && error !== null) {
      return new Error(JSON.stringify(error))
    }
    return new Error('Unknown error occurred')
  }

  private static reportError(error: Error, context?: ErrorContext): void {
    const report: ErrorReport = {
      error,
      context,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }

    this.errorQueue.push(report)

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }

    // Send to error tracking service
    this.sendToTrackingService(report)
  }

  private static sendToTrackingService(report: ErrorReport): void {
    // Placeholder for error reporting service integration
    // e.g., Sentry, Rollbar, etc.
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Report:', report)
    }
  }

  static getErrorQueue(): ErrorReport[] {
    return [...this.errorQueue]
  }

  static clearErrorQueue(): void {
    this.errorQueue = []
  }

  static async handleAsync<T>(
    fn: () => Promise<T>,
    fallback?: T,
    context?: ErrorContext
  ): Promise<T | undefined> {
    try {
      return await fn()
    } catch (error) {
      this.handle(error, context)
      return fallback
    }
  }

  static handleSync<T>(fn: () => T, fallback?: T, context?: ErrorContext): T | undefined {
    try {
      return fn()
    } catch (error) {
      this.handle(error, context)
      return fallback
    }
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof Error && 'code' in error && 'statusCode' in error
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unknown error occurred'
  }

  static getErrorCode(error: unknown): string {
    if (this.isAppError(error)) {
      return error.code
    }
    return 'UNKNOWN_ERROR'
  }

  static getUserFriendlyMessage(error: unknown): string {
    const message = this.getErrorMessage(error)

    if (this.isAppError(error)) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return 'Network connection issue. Please check your internet connection.'
        case 'VALIDATION_ERROR':
          return `Invalid input: ${message}`
        case 'UNAUTHORIZED':
          return 'Please sign in to continue.'
        case 'FORBIDDEN':
          return 'You do not have permission to perform this action.'
        case 'NOT_FOUND':
          return 'The requested resource was not found.'
        case 'RATE_LIMIT':
          return 'Too many requests. Please try again later.'
        case 'TIMEOUT_ERROR':
          return 'The request took too long. Please try again.'
        default:
          return message
      }
    }

    return 'Something went wrong. Please try again.'
  }

  static isRetryable(error: unknown): boolean {
    return isRetryableError(error)
  }

  /**
   * Execute function with automatic retry on failure
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 1000,
    context?: ErrorContext
  ): Promise<T> {
    let lastError: unknown

    for (let i = 0; i < retries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        this.handle(error, { ...context, metadata: { ...context?.metadata, attempt: i + 1 } })

        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
        }
      }
    }

    throw lastError
  }

  /**
   * Create error boundary wrapper for functions
   */
  static boundary<T extends unknown[], R>(
    fn: (...args: T) => R,
    fallback?: R,
    context?: ErrorContext
  ): (...args: T) => R | undefined {
    return (...args: T) => {
      try {
        return fn(...args)
      } catch (error) {
        this.handle(error, context)
        return fallback
      }
    }
  }
}

/**
 * handleError utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of handleError.
 */
export const handleError = ErrorHandler.handle.bind(ErrorHandler)
/**
 * handleAsyncError utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of handleAsyncError.
 */
export const handleAsyncError = ErrorHandler.handleAsync.bind(ErrorHandler)
/**
 * handleSyncError utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of handleSyncError.
 */
export const handleSyncError = ErrorHandler.handleSync.bind(ErrorHandler)
/**
 * withRetry utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of withRetry.
 */
export const withRetry = ErrorHandler.withRetry.bind(ErrorHandler)

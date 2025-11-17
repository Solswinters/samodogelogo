/**
 * Global error handler with logging and reporting
 */

import { logger } from './logger'
import type { AppError } from './errors'

export interface ErrorContext {
  userId?: string
  action?: string
  metadata?: Record<string, unknown>
}

export class ErrorHandler {
  static handle(error: unknown, context?: ErrorContext): void {
    if (error instanceof Error) {
      logger.error(error.message, error, context?.metadata)

      if (context?.action) {
        logger.error(`Error during action: ${context.action}`, error)
      }

      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        // Send to error tracking service in production
        this.reportError(error, context)
      }
    } else {
      logger.error('Unknown error occurred', undefined, { error, context })
    }
  }

  private static reportError(error: Error, context?: ErrorContext): void {
    // Placeholder for error reporting service integration
    // e.g., Sentry, Rollbar, etc.
    console.error('Error Report:', { error, context })
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
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
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

export const handleError = ErrorHandler.handle.bind(ErrorHandler)
export const handleAsyncError = ErrorHandler.handleAsync.bind(ErrorHandler)
export const handleSyncError = ErrorHandler.handleSync.bind(ErrorHandler)
export const withRetry = ErrorHandler.withRetry.bind(ErrorHandler)

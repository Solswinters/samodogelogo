/**
 * Centralized error handling
 */

import { logger } from '../logger'

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super('NOT_FOUND', message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super('CONFLICT', message, 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super('RATE_LIMIT_EXCEEDED', message, 429)
  }
}

/**
 * Error handler class
 */
class ErrorHandler {
  /**
   * Handle error
   */
  handle(error: Error | AppError): void {
    if (error instanceof AppError) {
      this.handleAppError(error)
    } else {
      this.handleUnknownError(error)
    }
  }

  /**
   * Handle application error
   */
  private handleAppError(error: AppError): void {
    logger.error(error.message, {
      code: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      stack: error.stack,
    })

    if (!error.isOperational) {
      // Critical error - might need to restart or alert
      this.handleCriticalError(error)
    }
  }

  /**
   * Handle unknown error
   */
  private handleUnknownError(error: Error): void {
    logger.fatal('Unknown error occurred', {
      message: error.message,
      stack: error.stack,
    })

    this.handleCriticalError(error)
  }

  /**
   * Handle critical error
   */
  private handleCriticalError(error: Error): void {
    // Send to monitoring service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error)
    }

    // Could trigger alerts, restart services, etc.
  }

  /**
   * Format error for API response
   */
  formatError(error: Error | AppError): {
    error: {
      code: string
      message: string
      statusCode: number
    }
  } {
    if (error instanceof AppError) {
      return {
        error: {
          code: error.code,
          message: error.message,
          statusCode: error.statusCode,
        },
      }
    }

    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
        statusCode: 500,
      },
    }
  }

  /**
   * Check if error is operational
   */
  isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational
    }
    return false
  }
}

/**
 * Global error handler instance
 */
export const errorHandler = new ErrorHandler()

/**
 * Setup global error handlers
 */
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    errorHandler.handle(event.reason)
  })

  // Handle uncaught errors
  window.addEventListener('error', event => {
    errorHandler.handle(event.error)
  })
}

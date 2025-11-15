/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextRequest } from 'next/server'
import { internalServerErrorResponse, badRequestResponse } from './response'
import { Logger } from './logging'

const logger = new Logger('ERROR_HANDLER')

// Custom error types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(401, 'UNAUTHORIZED', message, details)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(403, 'FORBIDDEN', message, details)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not found', details?: unknown) {
    super(404, 'NOT_FOUND', message, details)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded', details?: unknown) {
    super(429, 'RATE_LIMIT_EXCEEDED', message, details)
    this.name = 'RateLimitError'
  }
}

// Global error handler middleware
export function errorHandler() {
  return async (request: NextRequest, handler: () => Promise<Response>): Promise<Response> => {
    try {
      return await handler()
    } catch (error) {
      // Log the error
      logger.error('Request error', error as Error, {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
      })

      // Handle known error types
      if (error instanceof ApiError) {
        return internalServerErrorResponse(error.message, {
          code: error.code,
          details: error.details,
        })
      }

      // Handle validation errors
      if (error instanceof ValidationError) {
        return badRequestResponse(error.message, error.details)
      }

      // Handle syntax errors (JSON parsing)
      if (error instanceof SyntaxError) {
        return badRequestResponse('Invalid JSON in request body')
      }

      // Handle unknown errors
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

      return internalServerErrorResponse(errorMessage, {
        type: error instanceof Error ? error.name : 'Unknown',
      })
    }
  }
}

// Error boundary for async operations
export async function withErrorHandler<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    logger.error(`Error in ${context ?? 'async operation'}`, error as Error)
    throw error
  }
}

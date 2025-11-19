/**
 * Centralized error handling utilities
 */

import { logger } from '../logger'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public isOperational = true
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 503)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export function handleError(error: unknown): { message: string; code?: string } {
  if (error instanceof AppError) {
    logger.error(error.message, { code: error.code, statusCode: error.statusCode })
    return {
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    logger.error('Unexpected error', error)
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    }
  }

  logger.error('Unknown error type', { error })
  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
  }
}

export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

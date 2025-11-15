/**
 * Error handling utilities
 */

import { ERROR_CODES, AppError } from '@/common/errors'

export function handleContractError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('user rejected')) {
      return 'Transaction was rejected by user'
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction'
    }
    if (error.message.includes('nonce')) {
      return 'Transaction nonce error. Please try again'
    }
    if (error.message.includes('gas')) {
      return 'Gas estimation failed. Please try again'
    }
    return error.message
  }
  return 'An unknown error occurred'
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(ERROR_CODES.API_ERROR, error.message)
  }

  return new AppError(ERROR_CODES.UNKNOWN_ERROR, 'An unknown error occurred')
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout')
    )
  }
  return false
}

export function formatError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An error occurred'
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    console.error('Error caught:', error)
    return fallback
  }
}

export function createErrorMessage(code: string, message: string): Error {
  return new Error(`[${code}] ${message}`)
}

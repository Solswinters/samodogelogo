/**
 * Custom error classes for the application
 */

export interface ErrorMetadata {
  timestamp?: number
  userId?: string
  sessionId?: string
  [key: string]: unknown
}

export class AppError extends Error {
  public readonly timestamp: number
  public readonly metadata?: ErrorMetadata

  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    metadata?: ErrorMetadata
  ) {
    super(message)
    this.name = 'AppError'
    this.timestamp = Date.now()
    this.metadata = metadata
    Object.setPrototypeOf(this, AppError.prototype)
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      metadata: this.metadata,
    }
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field?: string,
    metadata?: ErrorMetadata
  ) {
    super(message, 'VALIDATION_ERROR', 400, metadata)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    public readonly resource?: string,
    metadata?: ErrorMetadata
  ) {
    super(message, 'NOT_FOUND', 404, metadata)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', metadata?: ErrorMetadata) {
    super(message, 'UNAUTHORIZED', 401, metadata)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', metadata?: ErrorMetadata) {
    super(message, 'FORBIDDEN', 403, metadata)
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class ConflictError extends AppError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, 'CONFLICT', 409, metadata)
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = 'Too many requests',
    public readonly retryAfter?: number,
    metadata?: ErrorMetadata
  ) {
    super(message, 'RATE_LIMIT', 429, metadata)
    this.name = 'RateLimitError'
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}

export class NetworkError extends AppError {
  constructor(
    message: string = 'Network error occurred',
    public readonly retryable: boolean = true,
    metadata?: ErrorMetadata
  ) {
    super(message, 'NETWORK_ERROR', 503, metadata)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export class ContractError extends AppError {
  constructor(
    message: string,
    public readonly txHash?: string,
    public readonly chainId?: number,
    metadata?: ErrorMetadata
  ) {
    super(message, 'CONTRACT_ERROR', 500, metadata)
    this.name = 'ContractError'
    Object.setPrototypeOf(this, ContractError.prototype)
  }
}

export class GameError extends AppError {
  constructor(
    message: string,
    public readonly gameState?: string,
    metadata?: ErrorMetadata
  ) {
    super(message, 'GAME_ERROR', 500, metadata)
    this.name = 'GameError'
    Object.setPrototypeOf(this, GameError.prototype)
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Operation timed out', metadata?: ErrorMetadata) {
    super(message, 'TIMEOUT_ERROR', 408, metadata)
    this.name = 'TimeoutError'
    Object.setPrototypeOf(this, TimeoutError.prototype)
  }
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return error.retryable
  }
  if (error instanceof TimeoutError) {
    return true
  }
  if (error instanceof AppError) {
    return error.statusCode >= 500
  }
  return false
}

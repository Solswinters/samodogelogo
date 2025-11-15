import type { NextRequest } from 'next/server'

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// Log entry interface
export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Logger class
export class Logger {
  private context: string

  constructor(context: string = 'APP') {
    this.context = context
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message: `[${this.context}] ${message}`,
      timestamp: new Date().toISOString(),
      metadata,
    }

    // In production, send to logging service (e.g., Winston, Datadog)
    const output = JSON.stringify(entry)

    // eslint-disable-next-line no-console
    switch (level) {
      case LogLevel.ERROR:
        // eslint-disable-next-line no-console
        console.error(output)
        break
      case LogLevel.WARN:
        // eslint-disable-next-line no-console
        console.warn(output)
        break
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.debug(output)
        }
        break
      default:
        // eslint-disable-next-line no-console
        console.log(output)
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata)
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata)
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, metadata)
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    const errorMetadata = {
      ...metadata,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
    }
    this.log(LogLevel.ERROR, message, errorMetadata)
  }
}

// Request logging middleware
export function requestLogger(logger: Logger = new Logger('API')) {
  return async (request: NextRequest, handler: () => Promise<Response>): Promise<Response> => {
    const startTime = Date.now()
    const { method, url } = request
    const requestId = crypto.randomUUID()

    logger.info('Request started', {
      requestId,
      method,
      url,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
    })

    try {
      const response = await handler()
      const duration = Date.now() - startTime

      logger.info('Request completed', {
        requestId,
        method,
        url,
        status: response.status,
        duration: `${duration}ms`,
      })

      return response
    } catch (error) {
      const duration = Date.now() - startTime

      logger.error('Request failed', error, {
        requestId,
        method,
        url,
        duration: `${duration}ms`,
      })

      throw error
    }
  }
}

// Create logger instances for different contexts
export const gameLogger = new Logger('GAME')
export const contractLogger = new Logger('CONTRACT')
export const multiplayerLogger = new Logger('MULTIPLAYER')
export const apiLogger = new Logger('API')

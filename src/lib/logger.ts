import type { NextRequest } from 'next/server'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  metadata?: Record<string, unknown>
  error?: Error
}

export class Logger {
  private context: string
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private minLevel: LogLevel = LogLevel.INFO

  constructor(context: string = 'APP') {
    this.context = context
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
    }
    return levels[level] >= levels[this.minLevel]
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      level,
      message: `[${this.context}] ${message}`,
      timestamp: new Date().toISOString(),
      context: this.context,
      metadata,
      error,
    }

    this.logs.push(entry)

    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    this.outputToConsole(entry)
  }

  private outputToConsole(entry: LogEntry): void {
    const output = JSON.stringify({
      level: entry.level,
      message: entry.message,
      timestamp: entry.timestamp,
      metadata: entry.metadata,
    })

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(output, entry.error)
        break
      case LogLevel.WARN:
        console.warn(output)
        break
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.debug(output)
        }
        break
      default:
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
    this.log(LogLevel.ERROR, message, metadata, error)
  }

  getLogs(limit?: number): LogEntry[] {
    return limit ? this.logs.slice(-limit) : [...this.logs]
  }

  clear(): void {
    this.logs = []
  }
}

/**
 * requestLogger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of requestLogger.
 */
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

      logger.error('Request failed', error as Error, {
        requestId,
        method,
        url,
        duration: `${duration}ms`,
      })

      throw error
    }
  }
}

/**
 * logger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of logger.
 */
export const logger = new Logger('APP')
/**
 * gameLogger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of gameLogger.
 */
export const gameLogger = new Logger('GAME')
/**
 * contractLogger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of contractLogger.
 */
export const contractLogger = new Logger('CONTRACT')
/**
 * multiplayerLogger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of multiplayerLogger.
 */
export const multiplayerLogger = new Logger('MULTIPLAYER')
/**
 * apiLogger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of apiLogger.
 */
export const apiLogger = new Logger('API')

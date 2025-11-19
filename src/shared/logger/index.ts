/**
 * Centralized logger with levels and structured output
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
}

class Logger {
  private minLevel: LogLevel = LogLevel.INFO
  private isDevelopment = process.env.NODE_ENV === 'development'

  setMinLevel(level: LogLevel) {
    this.minLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  private formatEntry(entry: LogEntry): string {
    const parts = [`[${entry.timestamp}]`, `[${entry.level.toUpperCase()}]`, entry.message]

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(entry.context))
    }

    if (entry.error) {
      parts.push(`\n${entry.error.stack || entry.error.message}`)
    }

    return parts.join(' ')
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formatted = this.formatEntry(entry)

    if (this.isDevelopment) {
      // In development, use native console with colors
      switch (level) {
        case LogLevel.DEBUG:
          // eslint-disable-next-line no-console
          console.debug(formatted)
          break
        case LogLevel.INFO:
          // eslint-disable-next-line no-console
          console.info(formatted)
          break
        case LogLevel.WARN:
          // eslint-disable-next-line no-console
          console.warn(formatted)
          break
        case LogLevel.ERROR:
          // eslint-disable-next-line no-console
          console.error(formatted)
          break
      }
    } else {
      // In production, you could send to logging service
      // For now, just console.log
      // eslint-disable-next-line no-console
      console.log(formatted)
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, contextOrError?: Record<string, unknown> | Error, error?: Error) {
    if (contextOrError instanceof Error) {
      this.log(LogLevel.ERROR, message, undefined, contextOrError)
    } else {
      this.log(LogLevel.ERROR, message, contextOrError, error)
    }
  }
}

export const logger = new Logger()
export default logger

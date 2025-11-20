/**
 * Centralized logging utility
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
  context?: string
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  remoteEndpoint?: string
}

class Logger {
  private config: LoggerConfig = {
    level: LogLevel.INFO,
    enableConsole: true,
    enableRemote: false,
  }

  private buffer: LogEntry[] = []
  private maxBufferSize = 100

  /**
   * Configure logger
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Debug log
   */
  debug(message: string, data?: any, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context)
  }

  /**
   * Info log
   */
  info(message: string, data?: any, context?: string): void {
    this.log(LogLevel.INFO, message, data, context)
  }

  /**
   * Warning log
   */
  warn(message: string, data?: any, context?: string): void {
    this.log(LogLevel.WARN, message, data, context)
  }

  /**
   * Error log
   */
  error(message: string, data?: any, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context)
  }

  /**
   * Fatal log
   */
  fatal(message: string, data?: any, context?: string): void {
    this.log(LogLevel.FATAL, message, data, context)
  }

  /**
   * Generic log method
   */
  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    if (level < this.config.level) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    }

    this.buffer.push(entry)

    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift()
    }

    if (this.config.enableConsole) {
      this.logToConsole(entry)
    }

    if (this.config.enableRemote) {
      this.logToRemote(entry)
    }
  }

  /**
   * Log to console
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = entry.context ? `[${entry.context}]` : ''
    const message = `${prefix} ${entry.message}`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.data)
        break
      case LogLevel.INFO:
        console.info(message, entry.data)
        break
      case LogLevel.WARN:
        console.warn(message, entry.data)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message, entry.data)
        break
    }
  }

  /**
   * Log to remote endpoint
   */
  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) return

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })
    } catch (error) {
      // Fail silently to prevent infinite logging loops
    }
  }

  /**
   * Get log buffer
   */
  getBuffer(): LogEntry[] {
    return [...this.buffer]
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.buffer = []
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.buffer.filter(entry => entry.level === level)
  }

  /**
   * Get logs by context
   */
  getLogsByContext(context: string): LogEntry[] {
    return this.buffer.filter(entry => entry.context === context)
  }

  /**
   * Export logs
   */
  exportLogs(): string {
    return JSON.stringify(this.buffer, null, 2)
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger()

/**
 * Configure logger on initialization
 */
if (typeof window !== 'undefined') {
  logger.configure({
    level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
    enableConsole: true,
    enableRemote: process.env.NODE_ENV === 'production',
    remoteEndpoint: '/api/logs',
  })
}

/**
 * Centralized logging system
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  error?: Error
}

class Logger {
  private level: LogLevel = LogLevel.INFO
  private handlers: ((entry: LogEntry) => void)[] = []

  setLevel(level: LogLevel) {
    this.level = level
  }

  addHandler(handler: (entry: LogEntry) => void) {
    this.handlers.push(handler)
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    if (level < this.level) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    }

    this.handlers.forEach((handler) => handler(entry))

    // Console output
    const levelName = LogLevel[level]
    const contextStr = context ? JSON.stringify(context) : ''

    if (level === LogLevel.ERROR) {
      console.error(`[${levelName}] ${message}`, contextStr, error)
    } else if (level === LogLevel.WARN) {
      console.warn(`[${levelName}] ${message}`, contextStr)
    } else {
      console.log(`[${levelName}] ${message}`, contextStr)
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

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log(LogLevel.ERROR, message, context, error)
  }
}

/**
 * logger utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of logger.
 */
export const logger = new Logger()

// Production: Send to analytics
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  logger.addHandler((entry) => {
    if (entry.level >= LogLevel.WARN) {
      // Send to external service (e.g., Sentry, Datadog)
      console.log('Would send to analytics:', entry)
    }
  })
}

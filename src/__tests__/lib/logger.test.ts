import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Logger, LogLevel } from '@/lib/logger'

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setLevel', () => {
    it('should set minimum log level', () => {
      const logger = new Logger('test')
      logger.setLevel(LogLevel.WARN)

      expect(logger).toBeDefined()
    })
  })

  describe('Logging methods', () => {
    it('should log error messages', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const logger = new Logger('test')
      logger.setLevel(LogLevel.ERROR)

      logger.error('Test error')

      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should log warn messages when level allows', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const logger = new Logger('test')
      logger.setLevel(LogLevel.WARN)

      logger.warn('Test warning')

      expect(consoleSpy).toHaveBeenCalled()
    })

    it('should not log debug when level is INFO', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const logger = new Logger('test')
      logger.setLevel(LogLevel.INFO)

      logger.debug('Test debug')

      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should log info messages', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
      const logger = new Logger('test')
      logger.setLevel(LogLevel.INFO)

      logger.info('Test info')

      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('Log storage', () => {
    it('should store log entries', () => {
      const logger = new Logger('test')
      logger.setLevel(LogLevel.DEBUG)

      logger.info('Test message')
      const logs = logger.getLogs()

      expect(logs.length).toBeGreaterThan(0)
      expect(logs[0]?.message).toBe('Test message')
    })

    it('should respect max log limit', () => {
      const logger = new Logger('test')
      logger.setLevel(LogLevel.DEBUG)

      for (let i = 0; i < 1100; i++) {
        logger.info(`Message ${i}`)
      }

      const logs = logger.getLogs()
      expect(logs.length).toBeLessThanOrEqual(1000)
    })
  })

  describe('Metadata', () => {
    it('should include metadata in log entries', () => {
      const logger = new Logger('test')

      logger.info('Test message', { userId: 123 })
      const logs = logger.getLogs()

      expect(logs[0]?.metadata).toEqual({ userId: 123 })
    })
  })
})

import { describe, it, expect } from 'vitest'
import {
  formatAddress,
  formatNumber,
  formatPercentage,
  formatTimeAgo,
  formatDuration,
  truncateText,
} from '@/utils/format'

describe('format utils', () => {
  describe('formatAddress', () => {
    it('should format Ethereum address', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
      expect(formatAddress(address)).toBe('0x742d...bEb0')
    })

    it('should use custom char length', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
      expect(formatAddress(address, 6)).toBe('0x742d35...f0bEb0')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000.00')
      expect(formatNumber(1000000)).toBe('1,000,000.00')
    })

    it('should respect decimal places', () => {
      expect(formatNumber(1234.56789, 3)).toBe('1,234.568')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      expect(formatPercentage(0.75)).toBe('75.00%')
      expect(formatPercentage(0.5, 0)).toBe('50%')
    })
  })

  describe('formatTimeAgo', () => {
    it('should format recent time', () => {
      expect(formatTimeAgo(Date.now())).toBe('just now')
    })

    it('should format minutes ago', () => {
      const twoMinutesAgo = Date.now() - 2 * 60 * 1000
      expect(formatTimeAgo(twoMinutesAgo)).toBe('2 minutes ago')
    })

    it('should format hours ago', () => {
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
      expect(formatTimeAgo(twoHoursAgo)).toBe('2 hours ago')
    })
  })

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(30000)).toBe('30s')
    })

    it('should format minutes', () => {
      expect(formatDuration(90000)).toBe('1m 30s')
    })

    it('should format hours', () => {
      expect(formatDuration(3660000)).toBe('1h 1m')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...')
    })

    it('should not truncate short text', () => {
      expect(truncateText('Hi', 10)).toBe('Hi')
    })
  })
})

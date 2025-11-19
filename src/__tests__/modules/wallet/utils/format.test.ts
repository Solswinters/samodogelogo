import { formatAddress, formatBalance, formatTokenAmount } from '@/modules/wallet/utils/format'

describe('Wallet Format Utilities', () => {
  describe('formatAddress', () => {
    it('should truncate long addresses', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const formatted = formatAddress(address)
      expect(formatted).toBe('0x1234...7890')
    })

    it('should handle short addresses', () => {
      const address = '0x1234'
      const formatted = formatAddress(address)
      expect(formatted).toBe('0x1234')
    })

    it('should handle null/undefined', () => {
      expect(formatAddress(null)).toBe('')
      expect(formatAddress(undefined)).toBe('')
    })
  })

  describe('formatBalance', () => {
    it('should format balance with decimals', () => {
      expect(formatBalance('1000000000000000000', 18)).toBe('1.0')
      expect(formatBalance('1500000000000000000', 18)).toBe('1.5')
    })

    it('should handle zero balance', () => {
      expect(formatBalance('0', 18)).toBe('0')
    })

    it('should round to specified decimals', () => {
      expect(formatBalance('1234567890000000000', 18, 2)).toBe('1.23')
    })
  })

  describe('formatTokenAmount', () => {
    it('should format token amounts with symbol', () => {
      expect(formatTokenAmount('1000000000000000000', 18, 'ETH')).toBe('1.0 ETH')
    })

    it('should handle large amounts', () => {
      expect(formatTokenAmount('1000000000000000000000', 18, 'ETH')).toContain('K')
    })
  })
})

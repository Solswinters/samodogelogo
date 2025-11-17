import { describe, it, expect } from 'vitest'
import { Sanitizer } from '@/lib/sanitizer'

describe('Sanitizer', () => {
  describe('html', () => {
    it('should escape HTML special characters', () => {
      expect(Sanitizer.html('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      )
    })
  })

  describe('filename', () => {
    it('should sanitize filenames', () => {
      expect(Sanitizer.filename('file/../../../etc/passwd')).toBe('file_._._etc_passwd')
    })

    it('should limit length to 255 characters', () => {
      const longName = 'a'.repeat(300)
      expect(Sanitizer.filename(longName).length).toBeLessThanOrEqual(255)
    })
  })

  describe('email', () => {
    it('should lowercase and trim emails', () => {
      expect(Sanitizer.email('  TEST@EXAMPLE.COM  ')).toBe('test@example.com')
    })
  })

  describe('walletAddress', () => {
    it('should format Ethereum addresses correctly', () => {
      const addr = Sanitizer.walletAddress('0x1234567890123456789012345678901234567890')
      expect(addr).toMatch(/^0x[0-9a-f]{40}$/)
    })

    it('should add 0x prefix if missing', () => {
      const addr = Sanitizer.walletAddress('1234567890123456789012345678901234567890')
      expect(addr.startsWith('0x')).toBe(true)
    })
  })

  describe('integer', () => {
    it('should keep only digits and leading minus', () => {
      expect(Sanitizer.integer('abc-123def456-')).toBe('-123456')
    })
  })

  describe('float', () => {
    it('should keep digits, decimal point, and leading minus', () => {
      expect(Sanitizer.float('abc-123.456def.789')).toBe('-123.456')
    })
  })

  describe('boolean', () => {
    it('should convert truthy strings to true', () => {
      expect(Sanitizer.boolean('true')).toBe(true)
      expect(Sanitizer.boolean('TRUE')).toBe(true)
      expect(Sanitizer.boolean('1')).toBe(true)
      expect(Sanitizer.boolean('yes')).toBe(true)
    })

    it('should convert other strings to false', () => {
      expect(Sanitizer.boolean('false')).toBe(false)
      expect(Sanitizer.boolean('0')).toBe(false)
      expect(Sanitizer.boolean('no')).toBe(false)
    })
  })
})

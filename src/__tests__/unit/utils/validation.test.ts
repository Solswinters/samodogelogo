import { describe, it, expect } from 'vitest'
import {
  isValidAddress,
  isValidScore,
  isValidNumber,
  isPositiveInteger,
  isInRange,
  sanitizeString,
} from '@/utils/validation'

describe('validation utils', () => {
  describe('isValidAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')).toBe(true)
      expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true)
    })

    it('should reject invalid addresses', () => {
      expect(isValidAddress('0xinvalid')).toBe(false)
      expect(isValidAddress('not-an-address')).toBe(false)
      expect(isValidAddress('0x123')).toBe(false)
    })
  })

  describe('isValidScore', () => {
    it('should validate valid scores', () => {
      expect(isValidScore(0)).toBe(true)
      expect(isValidScore(100)).toBe(true)
      expect(isValidScore(1000000)).toBe(true)
    })

    it('should reject invalid scores', () => {
      expect(isValidScore(-1)).toBe(false)
      expect(isValidScore(1000001)).toBe(false)
      expect(isValidScore(1.5)).toBe(false)
    })
  })

  describe('isValidNumber', () => {
    it('should validate numbers', () => {
      expect(isValidNumber(0)).toBe(true)
      expect(isValidNumber(123.45)).toBe(true)
      expect(isValidNumber(-10)).toBe(true)
    })

    it('should reject non-numbers', () => {
      expect(isValidNumber(NaN)).toBe(false)
      expect(isValidNumber(Infinity)).toBe(false)
      expect(isValidNumber('123')).toBe(false)
    })
  })

  describe('isPositiveInteger', () => {
    it('should validate positive integers', () => {
      expect(isPositiveInteger(1)).toBe(true)
      expect(isPositiveInteger(100)).toBe(true)
    })

    it('should reject non-positive integers', () => {
      expect(isPositiveInteger(0)).toBe(false)
      expect(isPositiveInteger(-1)).toBe(false)
      expect(isPositiveInteger(1.5)).toBe(false)
    })
  })

  describe('isInRange', () => {
    it('should check if value is in range', () => {
      expect(isInRange(5, 0, 10)).toBe(true)
      expect(isInRange(0, 0, 10)).toBe(true)
      expect(isInRange(10, 0, 10)).toBe(true)
    })

    it('should reject values outside range', () => {
      expect(isInRange(-1, 0, 10)).toBe(false)
      expect(isInRange(11, 0, 10)).toBe(false)
    })
  })

  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeString('<script>alert()</script>')).toBe('scriptalert()/script')
      expect(sanitizeString('Hello <World>')).toBe('Hello World')
    })

    it('should trim whitespace', () => {
      expect(sanitizeString('  test  ')).toBe('test')
    })
  })
})

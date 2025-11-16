/**
 * Unit tests for math helper utilities
 */

import { describe, it, expect } from 'vitest'
import {
  getRandomNumber,
  clamp,
  lerp,
  normalize,
  mapRange,
  roundToDecimal,
  percentage,
} from '@/utils/math-helpers'

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

describe('math helper utilities', () => {
  describe('getRandomNumber', () => {
    it('should return a number within the specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = getRandomNumber(1, 10)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
      }
    })

    it('should return min when min equals max', () => {
      expect(getRandomNumber(5, 5)).toBe(5)
    })
  })

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(0, -10, -1)).toBe(-1)
    })
  })

  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0)).toBe(0)
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(0, 10, 1)).toBe(10)
    })

    it('should work with negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0)
    })
  })

  describe('normalize', () => {
    it('should normalize value to 0-1 range', () => {
      expect(normalize(5, 0, 10)).toBe(0.5)
      expect(normalize(0, 0, 10)).toBe(0)
      expect(normalize(10, 0, 10)).toBe(1)
    })

    it('should handle negative ranges', () => {
      expect(normalize(0, -10, 10)).toBe(0.5)
    })
  })

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50)
      expect(mapRange(2.5, 0, 10, 0, 1)).toBe(0.25)
    })

    it('should handle reverse mapping', () => {
      expect(mapRange(50, 0, 100, 100, 0)).toBe(50)
    })
  })

  describe('roundToDecimal', () => {
    it('should round to specified decimal places', () => {
      expect(roundToDecimal(3.14159, 2)).toBe(3.14)
      expect(roundToDecimal(3.14159, 4)).toBe(3.1416)
      expect(roundToDecimal(3.5, 0)).toBe(4)
    })

    it('should handle negative numbers', () => {
      expect(roundToDecimal(-3.14159, 2)).toBe(-3.14)
    })
  })

  describe('percentage', () => {
    it('should calculate percentage correctly', () => {
      expect(percentage(50, 100)).toBe(50)
      expect(percentage(25, 100)).toBe(25)
      expect(percentage(100, 200)).toBe(50)
    })

    it('should return 0 when total is 0', () => {
      expect(percentage(50, 0)).toBe(0)
    })

    it('should handle values greater than total', () => {
      expect(percentage(150, 100)).toBe(150)
    })
  })
})

/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

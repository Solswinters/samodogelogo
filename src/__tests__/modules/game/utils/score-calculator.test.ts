import {
  calculateScore,
  calculateCombo,
  calculateTimeBonus,
} from '@/modules/game/utils/score-calculator'

describe('Score Calculator', () => {
  describe('calculateScore', () => {
    it('should calculate base score', () => {
      expect(calculateScore(100, 1, 0)).toBe(100)
    })

    it('should apply multiplier', () => {
      expect(calculateScore(100, 2, 0)).toBe(200)
    })

    it('should include combo bonus', () => {
      expect(calculateScore(100, 1, 5)).toBe(150)
    })

    it('should apply both multiplier and combo', () => {
      expect(calculateScore(100, 2, 5)).toBe(250)
    })
  })

  describe('calculateCombo', () => {
    it('should calculate combo multiplier', () => {
      expect(calculateCombo(0)).toBe(1)
      expect(calculateCombo(5)).toBe(1.5)
      expect(calculateCombo(10)).toBe(2)
    })

    it('should cap combo multiplier', () => {
      expect(calculateCombo(100)).toBeLessThanOrEqual(5)
    })
  })

  describe('calculateTimeBonus', () => {
    it('should give bonus for fast completion', () => {
      expect(calculateTimeBonus(10)).toBeGreaterThan(0)
    })

    it('should give less bonus for slow completion', () => {
      const fast = calculateTimeBonus(10)
      const slow = calculateTimeBonus(100)
      expect(fast).toBeGreaterThan(slow)
    })
  })
})

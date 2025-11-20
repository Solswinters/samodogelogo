import { ColorConverter } from '@/lib/color'

describe('ColorConverter', () => {
  describe('hexToRgb', () => {
    it('should convert hex to RGB', () => {
      expect(ColorConverter.hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(ColorConverter.hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(ColorConverter.hexToRgb('#ff5733')).toEqual({ r: 255, g: 87, b: 51 })
    })

    it('should handle hex without #', () => {
      expect(ColorConverter.hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('should return null for invalid hex', () => {
      expect(ColorConverter.hexToRgb('invalid')).toBeNull()
    })
  })

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(ColorConverter.rgbToHex(255, 255, 255)).toBe('#ffffff')
      expect(ColorConverter.rgbToHex(0, 0, 0)).toBe('#000000')
      expect(ColorConverter.rgbToHex(255, 87, 51)).toBe('#ff5733')
    })
  })

  describe('isValidHex', () => {
    it('should validate hex colors', () => {
      expect(ColorConverter.isValidHex('#ffffff')).toBe(true)
      expect(ColorConverter.isValidHex('ffffff')).toBe(true)
      expect(ColorConverter.isValidHex('#fff')).toBe(false)
      expect(ColorConverter.isValidHex('invalid')).toBe(false)
    })
  })

  describe('lighten', () => {
    it('should lighten a color', () => {
      const original = '#808080' // gray
      const lightened = ColorConverter.lighten(original, 20)
      expect(lightened).not.toBe(original)
      // Should be lighter (not testing exact value due to rounding)
    })
  })

  describe('darken', () => {
    it('should darken a color', () => {
      const original = '#808080' // gray
      const darkened = ColorConverter.darken(original, 20)
      expect(darkened).not.toBe(original)
      // Should be darker (not testing exact value due to rounding)
    })
  })

  describe('withAlpha', () => {
    it('should add alpha channel', () => {
      expect(ColorConverter.withAlpha('#ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)')
      expect(ColorConverter.withAlpha('#000000', 1)).toBe('rgba(0, 0, 0, 1)')
    })
  })

  describe('random', () => {
    it('should generate valid random hex color', () => {
      const color = ColorConverter.random()
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(ColorConverter.isValidHex(color)).toBe(true)
    })
  })
})

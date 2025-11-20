/**
 * Color conversion and manipulation utilities
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export class ColorConverter {
  /**
   * Convert hex to RGB
   */
  static hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  /**
   * Convert RGB to hex
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  /**
   * Convert HSL to RGB
   */
  static hslToRgb(h: number, s: number, l: number): RGB {
    h /= 360
    s /= 100
    l /= 100

    let r: number, g: number, b: number

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  /**
   * Lighten a color
   */
  static lighten(hex: string, amount: number): string {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl.l = Math.min(100, hsl.l + amount)

    const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l)
    return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b)
  }

  /**
   * Darken a color
   */
  static darken(hex: string, amount: number): string {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)
    hsl.l = Math.max(0, hsl.l - amount)

    const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l)
    return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b)
  }

  /**
   * Generate color with alpha
   */
  static withAlpha(hex: string, alpha: number): string {
    const rgb = this.hexToRgb(hex)
    if (!rgb) return hex
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
  }

  /**
   * Check if color is valid hex
   */
  static isValidHex(hex: string): boolean {
    return /^#?[0-9A-F]{6}$/i.test(hex)
  }

  /**
   * Generate random hex color
   */
  static random(): string {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    )
  }
}

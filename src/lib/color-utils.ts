/**
 * Color manipulation utilities
 */

/**
 * hexToRgb utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of hexToRgb.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
 * rgbToHex utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of rgbToHex.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

/**
 * isValidHex utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidHex.
 */
export function isValidHex(hex: string): boolean {
  return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex)
}

/**
 * lighten utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of lighten.
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return hex
  }

  const amount = Math.round(2.55 * percent)
  const r = Math.min(255, rgb.r + amount)
  const g = Math.min(255, rgb.g + amount)
  const b = Math.min(255, rgb.b + amount)

  return rgbToHex(r, g, b)
}

/**
 * darken utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of darken.
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    return hex
  }

  const amount = Math.round(2.55 * percent)
  const r = Math.max(0, rgb.r - amount)
  const g = Math.max(0, rgb.g - amount)
  const b = Math.max(0, rgb.b - amount)

  return rgbToHex(r, g, b)
}

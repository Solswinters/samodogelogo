/**
 * Data compression utilities for efficient storage and transfer
 */

export class Compressor {
  /**
   * Compress string using run-length encoding
   */
  static rle(input: string): string {
    if (!input) {return input}

    let result = ''
    let count = 1

    for (let i = 0; i < input.length; i++) {
      const current = input[i]
      const next = input[i + 1]

      if (current === next) {
        count++
      } else {
        result += current + (count > 1 ? count : '')
        count = 1
      }
    }

    return result
  }

  /**
   * Decompress run-length encoded string
   */
  static unrle(input: string): string {
    if (!input) {return input}

    let result = ''
    let i = 0

    while (i < input.length) {
      const char = input[i]
      let numStr = ''

      i++
      while (i < input.length && /\d/.test(input[i] ?? '')) {
        numStr += input[i]
        i++
      }

      const count = numStr ? parseInt(numStr, 10) : 1
      result += (char ?? '').repeat(count)
    }

    return result
  }

  /**
   * Compress JSON by removing whitespace
   */
  static json(input: string): string {
    try {
      const parsed = JSON.parse(input) as unknown
      return JSON.stringify(parsed)
    } catch {
      return input
    }
  }

  /**
   * Compress array of numbers using delta encoding
   */
  static deltaEncode(numbers: number[]): number[] {
    if (numbers.length === 0) {return numbers}

    const result = [numbers[0] ?? 0]
    for (let i = 1; i < numbers.length; i++) {
      result.push((numbers[i] ?? 0) - (numbers[i - 1] ?? 0))
    }
    return result
  }

  /**
   * Decompress delta-encoded numbers
   */
  static deltaDecode(deltas: number[]): number[] {
    if (deltas.length === 0) {return deltas}

    const result = [deltas[0] ?? 0]
    for (let i = 1; i < deltas.length; i++) {
      result.push((result[i - 1] ?? 0) + (deltas[i] ?? 0))
    }
    return result
  }

  /**
   * Simple dictionary-based compression
   */
  static dictionary(input: string, dictionary: Record<string, string>): string {
    let result = input

    for (const [key, value] of Object.entries(dictionary)) {
      result = result.split(value).join(key)
    }

    return result
  }

  /**
   * Decompress dictionary-based compression
   */
  static undictionary(input: string, dictionary: Record<string, string>): string {
    let result = input

    for (const [key, value] of Object.entries(dictionary)) {
      result = result.split(key).join(value)
    }

    return result
  }

  /**
   * Calculate compression ratio
   */
  static compressionRatio(original: string, compressed: string): number {
    if (original.length === 0) {return 0}
    return ((original.length - compressed.length) / original.length) * 100
  }

  /**
   * Compress coordinates array (useful for game positions)
   */
  static compressCoordinates(coords: Array<{ x: number; y: number }>): string {
    const xs = coords.map(c => Math.round(c.x))
    const ys = coords.map(c => Math.round(c.y))

    const xDeltas = this.deltaEncode(xs)
    const yDeltas = this.deltaEncode(ys)

    return JSON.stringify({ x: xDeltas, y: yDeltas })
  }

  /**
   * Decompress coordinates array
   */
  static decompressCoordinates(compressed: string): Array<{ x: number; y: number }> {
    try {
      const parsed = JSON.parse(compressed) as { x: number[]; y: number[] }
      const xs = this.deltaDecode(parsed.x)
      const ys = this.deltaDecode(parsed.y)

      return xs.map((x, i) => ({ x, y: ys[i] ?? 0 }))
    } catch {
      return []
    }
  }

  /**
   * Base64 encode (for binary data)
   */
  static base64Encode(input: string): string {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(input).toString('base64')
    }
    return btoa(input)
  }

  /**
   * Base64 decode
   */
  static base64Decode(input: string): string {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(input, 'base64').toString()
    }
    return atob(input)
  }

  /**
   * Compress object keys (shorten common keys)
   */
  static compressKeys<T extends Record<string, unknown>>(
    obj: T,
    keyMap: Record<string, string>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      const newKey = keyMap[key] ?? key
      result[newKey] = value
    }

    return result
  }

  /**
   * Decompress object keys
   */
  static decompressKeys<T extends Record<string, unknown>>(
    obj: Record<string, unknown>,
    keyMap: Record<string, string>
  ): T {
    const result: Record<string, unknown> = {}
    const reverseMap = Object.fromEntries(Object.entries(keyMap).map(([k, v]) => [v, k]))

    for (const [key, value] of Object.entries(obj)) {
      const newKey = reverseMap[key] ?? key
      result[newKey] = value
    }

    return result as T
  }
}

import { Compression } from '@/shared/utils/compression'

describe('Compression', () => {
  describe('compressString and decompressString', () => {
    it('should compress and decompress a string', () => {
      const original = 'Hello World! This is a test string.'
      const compressed = Compression.compressString(original)
      const decompressed = Compression.decompressString(compressed)

      expect(decompressed).toBe(original)
    })

    it('should handle empty strings', () => {
      expect(Compression.compressString('')).toBe('')
      expect(Compression.decompressString('')).toBe('')
    })

    it('should handle repeated patterns well', () => {
      const original = 'aaaaaabbbbbbcccccc'
      const compressed = Compression.compressString(original)
      const decompressed = Compression.decompressString(compressed)

      expect(decompressed).toBe(original)
    })
  })

  describe('compressJSON and decompressJSON', () => {
    it('should compress and decompress JSON objects', () => {
      const original = { name: 'Test', value: 123, nested: { key: 'value' } }
      const compressed = Compression.compressJSON(original)
      const decompressed = Compression.decompressJSON(compressed)

      expect(decompressed).toEqual(original)
    })

    it('should handle arrays', () => {
      const original = [1, 2, 3, 4, 5]
      const compressed = Compression.compressJSON(original)
      const decompressed = Compression.decompressJSON(compressed)

      expect(decompressed).toEqual(original)
    })
  })

  describe('getCompressionRatio', () => {
    it('should calculate compression ratio', () => {
      const original = 'a'.repeat(1000)
      const compressed = Compression.compressString(original)
      const ratio = Compression.getCompressionRatio(original, compressed)

      expect(ratio).toBeGreaterThan(0)
      expect(ratio).toBeLessThanOrEqual(1)
    })

    it('should return 0 for empty strings', () => {
      expect(Compression.getCompressionRatio('', '')).toBe(0)
    })
  })
})

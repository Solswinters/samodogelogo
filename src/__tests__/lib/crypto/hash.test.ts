import { HashUtils } from '@/lib/crypto'

describe('HashUtils', () => {
  describe('simpleMD5', () => {
    it('should generate consistent hash', () => {
      const hash1 = HashUtils.simpleMD5('test')
      const hash2 = HashUtils.simpleMD5('test')
      expect(hash1).toBe(hash2)
    })

    it('should generate different hashes for different inputs', () => {
      const hash1 = HashUtils.simpleMD5('test1')
      const hash2 = HashUtils.simpleMD5('test2')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('random', () => {
    it('should generate random hash', () => {
      const hash = HashUtils.random()
      expect(hash).toHaveLength(32)
      expect(hash).toMatch(/^[0-9a-f]+$/)
    })

    it('should generate hash of specified length', () => {
      const hash = HashUtils.random(16)
      expect(hash).toHaveLength(16)
    })

    it('should generate different hashes', () => {
      const hash1 = HashUtils.random()
      const hash2 = HashUtils.random()
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('uuid', () => {
    it('should generate valid UUID v4', () => {
      const uuid = HashUtils.uuid()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('should generate unique UUIDs', () => {
      const uuid1 = HashUtils.uuid()
      const uuid2 = HashUtils.uuid()
      expect(uuid1).not.toBe(uuid2)
    })
  })

  describe('checksum', () => {
    it('should generate consistent checksum', () => {
      const data = 'test data'
      const checksum1 = HashUtils.checksum(data)
      const checksum2 = HashUtils.checksum(data)
      expect(checksum1).toBe(checksum2)
    })

    it('should generate different checksums for different data', () => {
      const checksum1 = HashUtils.checksum('data1')
      const checksum2 = HashUtils.checksum('data2')
      expect(checksum1).not.toBe(checksum2)
    })
  })
})

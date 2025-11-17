import { describe, it, expect } from 'vitest'
import { CryptoHash } from '@/lib/crypto-hash'

describe('CryptoHash', () => {
  describe('fnv1a', () => {
    it('should generate consistent hashes', () => {
      const hash1 = CryptoHash.fnv1a('test')
      const hash2 = CryptoHash.fnv1a('test')
      expect(hash1).toBe(hash2)
    })

    it('should generate different hashes for different inputs', () => {
      const hash1 = CryptoHash.fnv1a('test1')
      const hash2 = CryptoHash.fnv1a('test2')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('murmur3', () => {
    it('should generate consistent hashes', () => {
      const hash1 = CryptoHash.murmur3('test')
      const hash2 = CryptoHash.murmur3('test')
      expect(hash1).toBe(hash2)
    })

    it('should respect seed parameter', () => {
      const hash1 = CryptoHash.murmur3('test', 0)
      const hash2 = CryptoHash.murmur3('test', 1)
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('uuid', () => {
    it('should generate valid UUID v4', () => {
      const uuid = CryptoHash.uuid()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    it('should generate unique UUIDs', () => {
      const uuid1 = CryptoHash.uuid()
      const uuid2 = CryptoHash.uuid()
      expect(uuid1).not.toBe(uuid2)
    })
  })

  describe('shortId', () => {
    it('should generate IDs of specified length', () => {
      const id = CryptoHash.shortId(10)
      expect(id.length).toBe(10)
    })

    it('should generate unique IDs', () => {
      const id1 = CryptoHash.shortId()
      const id2 = CryptoHash.shortId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('hashObject', () => {
    it('should generate consistent hashes for objects', () => {
      const obj = { foo: 'bar', baz: 123 }
      const hash1 = CryptoHash.hashObject(obj)
      const hash2 = CryptoHash.hashObject(obj)
      expect(hash1).toBe(hash2)
    })

    it('should ignore key order', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { b: 2, a: 1 }
      const hash1 = CryptoHash.hashObject(obj1)
      const hash2 = CryptoHash.hashObject(obj2)
      expect(hash1).toBe(hash2)
    })
  })

  describe('verify', () => {
    it('should verify correct hashes', () => {
      const data = 'test data'
      const hash = CryptoHash.murmur3(data)
      expect(CryptoHash.verify(data, hash)).toBe(true)
    })

    it('should reject incorrect hashes', () => {
      const data = 'test data'
      const wrongHash = 'incorrect'
      expect(CryptoHash.verify(data, wrongHash)).toBe(false)
    })

    it('should verify hashes with salt', () => {
      const data = 'test data'
      const salt = 'mysalt'
      const hash = CryptoHash.hashWithSalt(data, salt)
      expect(CryptoHash.verify(data, hash, salt)).toBe(true)
    })
  })

  describe('sessionId', () => {
    it('should generate session IDs with timestamp', () => {
      const id = CryptoHash.sessionId()
      expect(id).toContain('-')
      const parts = id.split('-')
      expect(parts.length).toBe(2)
    })
  })

  describe('combineHashes', () => {
    it('should combine multiple hashes consistently', () => {
      const hash1 = CryptoHash.murmur3('a')
      const hash2 = CryptoHash.murmur3('b')
      const combined1 = CryptoHash.combineHashes(hash1, hash2)
      const combined2 = CryptoHash.combineHashes(hash1, hash2)
      expect(combined1).toBe(combined2)
    })
  })
})

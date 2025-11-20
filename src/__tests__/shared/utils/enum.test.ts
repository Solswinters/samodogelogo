import { EnumUtils } from '@/shared/utils/enum'

enum TestEnum {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
}

enum NumericEnum {
  A = 1,
  B = 2,
  C = 3,
}

describe('EnumUtils', () => {
  describe('getKeys', () => {
    it('should get all keys from string enum', () => {
      const keys = EnumUtils.getKeys(TestEnum)
      expect(keys).toEqual(['ONE', 'TWO', 'THREE'])
    })

    it('should get all keys from numeric enum', () => {
      const keys = EnumUtils.getKeys(NumericEnum)
      expect(keys).toEqual(['A', 'B', 'C'])
    })
  })

  describe('getValues', () => {
    it('should get all values from enum', () => {
      const values = EnumUtils.getValues(TestEnum)
      expect(values).toEqual(['one', 'two', 'three'])
    })
  })

  describe('getEntries', () => {
    it('should get all entries from enum', () => {
      const entries = EnumUtils.getEntries(TestEnum)
      expect(entries).toEqual([
        ['ONE', 'one'],
        ['TWO', 'two'],
        ['THREE', 'three'],
      ])
    })
  })

  describe('hasValue', () => {
    it('should check if value exists in enum', () => {
      expect(EnumUtils.hasValue(TestEnum, 'one')).toBe(true)
      expect(EnumUtils.hasValue(TestEnum, 'four')).toBe(false)
    })
  })

  describe('getKeyByValue', () => {
    it('should get key by value', () => {
      expect(EnumUtils.getKeyByValue(TestEnum, 'one')).toBe('ONE')
      expect(EnumUtils.getKeyByValue(TestEnum, 'two')).toBe('TWO')
      expect(EnumUtils.getKeyByValue(TestEnum, 'invalid' as any)).toBeUndefined()
    })
  })

  describe('toOptions', () => {
    it('should convert enum to options array', () => {
      const options = EnumUtils.toOptions(TestEnum)
      expect(options).toEqual([
        { label: 'ONE', value: 'one' },
        { label: 'TWO', value: 'two' },
        { label: 'THREE', value: 'three' },
      ])
    })
  })

  describe('parse', () => {
    it('should parse valid values', () => {
      expect(EnumUtils.parse(TestEnum, 'one')).toBe('one')
      expect(EnumUtils.parse(TestEnum, 'two')).toBe('two')
    })

    it('should return undefined for invalid values', () => {
      expect(EnumUtils.parse(TestEnum, 'invalid')).toBeUndefined()
    })

    it('should return default value for invalid values', () => {
      expect(EnumUtils.parse(TestEnum, 'invalid', 'one')).toBe('one')
    })
  })
})

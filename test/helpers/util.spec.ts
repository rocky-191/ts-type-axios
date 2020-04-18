import {
  isFormData,
  isPlainObject,
  isDate,
  isURLSearchParams,
  extend,
  deepMerge
} from '../../src/helpers/util'

describe('helpers:util', () => {
  describe('isXXX', () => {
    test('should validate date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    test('should validate object', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(2)).toBeFalsy()
    })

    test('should validate formdata', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData(new Date())).toBeFalsy()
    })

    test('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be a mutable', () => {
      const a = Object.create(null)
      const b = { name: 123 }
      extend(a, b)
      expect(a.name).toBe(123)
    })
    test('should extend properties', () => {
      const a = { foo: 123, bar: 678 }
      const b = { bar: 456 }
      const c = extend(a, b)
      expect(c.foo).toBe(123)
      expect(c.bar).toBe(456)
    })
  })

  describe('deepMerge', () => {
    test('should be a mutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }
      deepMerge(a, b, c)
      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })
  })
})

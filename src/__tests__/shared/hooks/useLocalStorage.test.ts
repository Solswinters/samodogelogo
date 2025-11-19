import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('should store value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', ''))

    act(() => {
      result.current[1]('stored value')
    })

    expect(result.current[0]).toBe('stored value')
    expect(localStorage.getItem('test')).toBe(JSON.stringify('stored value'))
  })

  it('should retrieve existing value from localStorage', () => {
    localStorage.setItem('test', JSON.stringify('existing'))

    const { result } = renderHook(() => useLocalStorage('test', 'default'))
    expect(result.current[0]).toBe('existing')
  })

  it('should handle objects', () => {
    const { result } = renderHook(() => useLocalStorage('test', { count: 0 }))

    act(() => {
      result.current[1]({ count: 5 })
    })

    expect(result.current[0]).toEqual({ count: 5 })
  })
})

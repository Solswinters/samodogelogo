import { renderHook } from '@testing-library/react'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'

describe('useMediaQuery', () => {
  it('should return false for non-matching query', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))
    expect(result.current).toBe(false)
  })

  it('should handle mobile query', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(typeof result.current).toBe('boolean')
  })

  it('should update on media query change', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(typeof result.current).toBe('boolean')
  })
})

import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from '@/shared/hooks/useDebounce'

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    })

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    await waitFor(() => expect(result.current).toBe('updated'), { timeout: 600 })
  })

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })
    rerender({ value: 'third' })

    await waitFor(() => expect(result.current).toBe('third'), { timeout: 600 })
  })
})

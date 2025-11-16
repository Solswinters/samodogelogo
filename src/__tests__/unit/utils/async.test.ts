/**
 * Unit tests for async utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { retry, sleep, withTimeout, debounce, throttle } from '@/utils/async'

describe('async utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('sleep', () => {
    it('should resolve after the specified time', async () => {
      const promise = sleep(1000)
      vi.advanceTimersByTime(1000)
      await expect(promise).resolves.toBeUndefined()
    })
  })

  describe('retry', () => {
    it('should succeed on first try', async () => {
      const fn = vi.fn().mockResolvedValue('success')
      const result = await retry(fn, 3, 100)
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success')

      const promise = retry(fn, 3, 100)

      // Advance timers for retries
      await vi.advanceTimersByTimeAsync(100)
      await vi.advanceTimersByTimeAsync(200)

      const result = await promise
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should throw error after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('persistent error'))

      const promise = retry(fn, 3, 100)

      // Advance timers for all retries
      await vi.advanceTimersByTimeAsync(100)
      await vi.advanceTimersByTimeAsync(200)
      await vi.advanceTimersByTimeAsync(300)

      await expect(promise).rejects.toThrow('persistent error')
      expect(fn).toHaveBeenCalledTimes(3)
    })
  })

  describe('withTimeout', () => {
    it('should resolve if promise completes before timeout', async () => {
      const promise = Promise.resolve('success')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const result = await withTimeout(promise, 1000)
      expect(result).toBe('success')
    })

    it('should reject if promise exceeds timeout', async () => {
      const promise = new Promise<void>(resolve => setTimeout(resolve, 2000))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const timeoutPromise = withTimeout(promise, 1000)

      vi.advanceTimersByTime(1000)

      await expect(timeoutPromise).rejects.toThrow('Operation timed out')
    })
  })

  describe('debounce', () => {
    it('should delay function execution', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 1000)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1000)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should reset delay on subsequent calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 1000)

      debouncedFn()
      vi.advanceTimersByTime(500)
      debouncedFn()
      vi.advanceTimersByTime(500)

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(500)

      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should execute immediately and then throttle', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 1000)

      throttledFn()
      expect(fn).toHaveBeenCalledTimes(1)

      throttledFn()
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1000)

      throttledFn()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})

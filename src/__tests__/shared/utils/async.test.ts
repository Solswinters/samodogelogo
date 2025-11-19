import {
  retry,
  timeout,
  debounceAsync,
  parallel,
  allSettled,
  createAbortable,
} from '@/shared/utils/async'

describe('async utilities', () => {
  describe('retry', () => {
    it('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      const result = await retry(fn, { maxAttempts: 3 })
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')

      const result = await retry(fn, { maxAttempts: 3, delay: 10 })
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should throw after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'))
      await expect(retry(fn, { maxAttempts: 2, delay: 10 })).rejects.toThrow('fail')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('timeout', () => {
    it('should resolve if promise completes in time', async () => {
      const promise = Promise.resolve('success')
      const result = await timeout(promise, 1000)
      expect(result).toBe('success')
    })

    it('should reject if promise times out', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('too late'), 100))
      await expect(timeout(promise, 50)).rejects.toThrow('Operation timed out')
    })
  })

  describe('parallel', () => {
    it('should execute all promises in parallel', async () => {
      const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
      const results = await parallel(promises)
      expect(results).toEqual([1, 2, 3])
    })

    it('should reject if any promise fails', async () => {
      const promises = [Promise.resolve(1), Promise.reject(new Error('fail')), Promise.resolve(3)]
      await expect(parallel(promises)).rejects.toThrow('fail')
    })
  })

  describe('allSettled', () => {
    it('should return all results regardless of rejections', async () => {
      const promises = [Promise.resolve(1), Promise.reject(new Error('fail')), Promise.resolve(3)]
      const results = await allSettled(promises)
      expect(results).toHaveLength(3)
      expect(results[0]).toEqual({ status: 'fulfilled', value: 1 })
      expect(results[1]).toEqual({ status: 'rejected', reason: expect.any(Error) })
      expect(results[2]).toEqual({ status: 'fulfilled', value: 3 })
    })
  })

  describe('debounceAsync', () => {
    jest.useFakeTimers()

    it('should debounce async function calls', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      const debounced = debounceAsync(fn, 100)

      debounced()
      debounced()
      debounced()

      expect(fn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      await Promise.resolve()

      expect(fn).toHaveBeenCalledTimes(1)
    })

    jest.useRealTimers()
  })

  describe('createAbortable', () => {
    it('should create abortable promise', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('done'), 100))
      const { promise: abortable, abort } = createAbortable(promise)

      abort()
      await expect(abortable).rejects.toThrow('Aborted')
    })
  })
})

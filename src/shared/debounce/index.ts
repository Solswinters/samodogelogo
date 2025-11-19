/**
 * Debounce and throttle utilities
 */

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, waitMs)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastRun = 0
  let timeoutId: NodeJS.Timeout | null = null

  return function throttled(...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastRun >= limitMs) {
      func(...args)
      lastRun = now
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(
        () => {
          func(...args)
          lastRun = Date.now()
        },
        limitMs - (now - lastRun)
      )
    }
  }
}

export function debounceLeading<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  let lastRun = 0

  return function debounced(...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastRun >= waitMs) {
      func(...args)
      lastRun = now
    }

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      lastRun = Date.now()
    }, waitMs)
  }
}

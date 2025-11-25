/**
 * Debounce utility for performance optimization
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * debounce utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of debounce.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

/**
 * Debounce with leading edge
 */
export function debounceLeading<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  let lastCall: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    const context = this
    const now = Date.now()

    if (!lastCall || now - lastCall > wait) {
      func.apply(context, args)
      lastCall = now
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      lastCall = null
    }, wait)
  }
}

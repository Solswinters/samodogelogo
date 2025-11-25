/**
 * Throttle utility for performance optimization
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * throttle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of throttle.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Throttle with trailing edge
 */
export function throttleTrailing<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  let lastArgs: Parameters<T> | null = null
  let lastContext: any = null

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args
    lastContext = this

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false

        if (lastArgs && lastContext) {
          func.apply(lastContext, lastArgs)
          lastArgs = null
          lastContext = null
        }
      }, limit)
    }
  }
}

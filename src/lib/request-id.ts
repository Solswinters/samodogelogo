/**
 * Request ID generation and tracking
 */

import { generateUUID } from './crypto-utils'

class RequestIDManager {
  private currentRequestId: string | null = null

  generate(): string {
    const id = generateUUID()
    this.currentRequestId = id
    return id
  }

  getCurrent(): string | null {
    return this.currentRequestId
  }

  clear(): void {
    this.currentRequestId = null
  }

  withRequestId<T>(fn: () => T): T {
    const requestId = this.generate()
    try {
      return fn()
    } finally {
      this.clear()
    }
  }

  async withRequestIdAsync<T>(fn: () => Promise<T>): Promise<T> {
    const requestId = this.generate()
    try {
      return await fn()
    } finally {
      this.clear()
    }
  }
}

/**
 * requestIdManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of requestIdManager.
 */
export const requestIdManager = new RequestIDManager()

/**
 * generateRequestId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateRequestId.
 */
export function generateRequestId(): string {
  return requestIdManager.generate()
}

/**
 * getCurrentRequestId utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getCurrentRequestId.
 */
export function getCurrentRequestId(): string | null {
  return requestIdManager.getCurrent()
}

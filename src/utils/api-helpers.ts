// API utility helpers

/**
 * Format API error message for display
 */
export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}

/**
 * Check if response is successful
 */
export function isSuccessResponse(status: number): boolean {
  return status >= 200 && status < 300
}

/**
 * Extract error message from API response
 */
export function extractErrorMessage(response: {
  error?: { message?: string; code?: string }
}): string {
  return response.error?.message ?? response.error?.code ?? 'Unknown error'
}

/**
 * Build query string from object
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)

  return filtered.length > 0 ? `?${filtered.join('&')}` : ''
}

/**
 * Parse pagination info from response
 */
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export function parsePaginationInfo(data: {
  pagination?: Partial<PaginationInfo>
}): PaginationInfo | null {
  if (!data.pagination) {return null}

  return {
    page: data.pagination.page ?? 1,
    pageSize: data.pagination.pageSize ?? 20,
    total: data.pagination.total ?? 0,
    totalPages: data.pagination.totalPages ?? 1,
    hasNextPage: data.pagination.hasNextPage ?? false,
    hasPreviousPage: data.pagination.hasPreviousPage ?? false,
  }
}

/**
 * Retry failed requests with exponential backoff
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError ?? new Error('Request failed after retries')
}

/**
 * Debounce API calls
 */
export function debounceApiCall<T extends unknown[]>(
  fn: (...args: T) => Promise<unknown>,
  delay: number = 500
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      void fn(...args)
    }, delay)
  }
}

/**
 * Throttle API calls
 */
export function throttleApiCall<T extends unknown[]>(
  fn: (...args: T) => Promise<unknown>,
  delay: number = 1000
): (...args: T) => void {
  let lastCall = 0

  return (...args: T) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      void fn(...args)
    }
  }
}

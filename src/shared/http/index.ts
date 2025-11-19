/**
 * HTTP utilities and helpers
 */

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      let stringValue: string
      if (typeof value === 'string') {
        stringValue = value
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        stringValue = value.toString()
      } else if (typeof value === 'object') {
        stringValue = JSON.stringify(value)
      } else {
        stringValue = ''
      }
      searchParams.append(key, stringValue)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function parseQueryString<T extends Record<string, string>>(search: string): T {
  const params = new URLSearchParams(search)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result as T
}

export function getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  }
}

export function isHttpError(statusCode: number): boolean {
  return statusCode >= 400
}

export function isClientError(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500
}

export function isServerError(statusCode: number): boolean {
  return statusCode >= 500
}

export function getStatusText(statusCode: number): string {
  const statusTexts: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  }

  return statusTexts[statusCode] ?? 'Unknown Status'
}

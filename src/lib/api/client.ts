/**
 * API client for making HTTP requests
 */

import { API_CONSTANTS } from '@/config/constants'

export interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  onRetry?: (attempt: number) => void
}

export class APIClient {
  private baseURL: string

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  /**
   * Make a GET request
   */
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  /**
   * Make a POST request
   */
  async post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  }

  /**
   * Make a PUT request
   */
  async put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  /**
   * Make a request with retry logic
   */
  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
      timeout = API_CONSTANTS.REQUEST_TIMEOUT,
      retries = API_CONSTANTS.MAX_RETRIES,
      onRetry,
      ...fetchOptions
    } = options

    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(fullURL, fetchOptions, timeout)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
      } catch (error) {
        lastError = error as Error

        if (attempt < retries) {
          if (onRetry) {
            onRetry(attempt + 1)
          }

          // Exponential backoff
          const delay =
            API_CONSTANTS.RETRY_DELAY * Math.pow(API_CONSTANTS.BACKOFF_MULTIPLIER, attempt)
          await this.sleep(delay)
        }
      }
    }

    throw lastError
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(id)
      return response
    } catch (error) {
      clearTimeout(id)
      throw error
    }
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Global API client instance
 */
export const apiClient = new APIClient()

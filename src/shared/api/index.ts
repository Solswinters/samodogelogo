/**
 * API client with typed responses
 */

import { retry } from '../retry'
import { logger } from '../logger'

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  statusCode?: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await retry(
        async () => {
          const res = await fetch(url, {
            ...options,
            headers: {
              ...this.defaultHeaders,
              ...options.headers,
            },
          })

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`)
          }

          return res
        },
        {
          maxAttempts: 3,
          shouldRetry: (error, attempt) => {
            logger.warn(`API request failed, attempt ${attempt}`, { error: error.message })
            return attempt < 3
          },
        }
      )

      const data = (await response.json()) as T

      return {
        data,
        success: true,
        statusCode: response.status,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('API request failed', { error: errorMessage, endpoint })

      return {
        data: {} as T,
        success: false,
        error: errorMessage,
        statusCode: 500,
      }
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'
)

export default apiClient

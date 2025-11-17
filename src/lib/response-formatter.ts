/**
 * API response formatter utilities
 */

import type { ApiResponse } from './api-response'

export function formatSuccessResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: Date.now(),
      ...meta,
    },
  }
}

export function formatErrorResponse(
  message: string,
  code: string,
  meta?: Record<string, unknown>
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
    },
    meta: {
      timestamp: Date.now(),
      ...meta,
    },
  }
}

export function formatPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      timestamp: Date.now(),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    },
  }
}

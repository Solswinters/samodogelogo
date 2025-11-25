/**
 * API response formatter utilities
 */

import type { ApiResponse } from './api-response'

/**
 * formatSuccessResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatSuccessResponse.
 */
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

/**
 * formatErrorResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatErrorResponse.
 */
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

/**
 * formatPaginatedResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatPaginatedResponse.
 */
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

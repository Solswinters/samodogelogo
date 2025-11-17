/**
 * Standard API response utilities
 */

import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    timestamp: number
    [key: string]: unknown
  }
}

export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: Date.now(),
      },
    },
    { status }
  )
}

export function errorResponse(
  message: string,
  code: string = 'ERROR',
  status: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
      meta: {
        timestamp: Date.now(),
      },
    },
    { status }
  )
}

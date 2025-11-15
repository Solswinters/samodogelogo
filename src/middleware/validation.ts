/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import type { z } from 'zod'
import { ERROR_CODES, createError } from '@/constants/errors'
import { HTTP_STATUS } from '@/constants/api'

// Generic validation middleware factory
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (
    request: NextRequest,
    handler: (data: T) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      const body: unknown = await request.json()
      const validation = schema.safeParse(body)

      if (!validation.success) {
        const firstError = validation.error.errors[0]
        const errorMessage = firstError?.message ?? 'Validation failed'

        return NextResponse.json(createError(ERROR_CODES.INVALID_INPUT, errorMessage), {
          status: HTTP_STATUS.BAD_REQUEST,
        })
      }

      return await handler(validation.data)
    } catch (error) {
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          createError(ERROR_CODES.INVALID_INPUT, 'Invalid JSON in request body'),
          { status: HTTP_STATUS.BAD_REQUEST }
        )
      }

      throw error
    }
  }
}

// Validate query parameters
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): {
  success: boolean
  data?: T
  error?: string
} {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const validation = schema.safeParse(params)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: firstError?.message ?? 'Validation failed',
      }
    }

    return {
      success: true,
      data: validation.data,
    }
  } catch {
    return {
      success: false,
      error: 'Failed to parse query parameters',
    }
  }
}

// Validate headers
export function validateHeaders<T>(
  schema: z.ZodSchema<T>,
  headers: Headers
): {
  success: boolean
  data?: T
  error?: string
} {
  try {
    const headerObj = Object.fromEntries(headers.entries())
    const validation = schema.safeParse(headerObj)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return {
        success: false,
        error: firstError?.message ?? 'Validation failed',
      }
    }

    return {
      success: true,
      data: validation.data,
    }
  } catch {
    return {
      success: false,
      error: 'Failed to parse headers',
    }
  }
}

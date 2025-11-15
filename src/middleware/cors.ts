/**
 * CORS middleware configuration
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL ?? '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export function corsMiddleware(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: CORS_HEADERS,
    })
  }

  return null
}

export function addCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export function createCorsResponse(data: unknown, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status })
  return addCorsHeaders(response)
}

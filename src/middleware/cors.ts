import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

export interface CorsConfig {
  origins?: string[] | '*'
  methods?: string[]
  headers?: string[]
  credentials?: boolean
  maxAge?: number
}

// Default CORS configuration
const DEFAULT_CORS_CONFIG: CorsConfig = {
  origins: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: [
    'Content-Type',
    'Authorization',
    'X-Wallet-Address',
    'X-Wallet-Signature',
    'X-Wallet-Message',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
}

// Check if origin is allowed
function isOriginAllowed(origin: string | null, allowedOrigins: string[] | '*'): boolean {
  if (!origin) {return false}
  if (allowedOrigins === '*') {return true}
  return allowedOrigins.includes(origin)
}

// Add CORS headers to response
export function addCorsHeaders(
  response: NextResponse,
  request: NextRequest,
  config: CorsConfig = DEFAULT_CORS_CONFIG
): NextResponse {
  const origin = request.headers.get('origin')
  const allowedOrigins = config.origins ?? DEFAULT_CORS_CONFIG.origins!

  // Set Access-Control-Allow-Origin
  if (allowedOrigins === '*') {
    response.headers.set('Access-Control-Allow-Origin', '*')
  } else if (origin && isOriginAllowed(origin, allowedOrigins)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }

  // Set other CORS headers
  if (config.methods) {
    response.headers.set('Access-Control-Allow-Methods', config.methods.join(', '))
  }

  if (config.headers) {
    response.headers.set('Access-Control-Allow-Headers', config.headers.join(', '))
  }

  if (config.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  if (config.maxAge) {
    response.headers.set('Access-Control-Max-Age', config.maxAge.toString())
  }

  return response
}

// CORS middleware
export function cors(config: CorsConfig = DEFAULT_CORS_CONFIG) {
  return async (request: NextRequest, handler: () => Promise<Response>): Promise<Response> => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 })
      return addCorsHeaders(response, request, config)
    }

    // Handle actual request
    const response = await handler()
    const nextResponse = new NextResponse(response.body, response)

    return addCorsHeaders(nextResponse, request, config)
  }
}

// Strict CORS - only allow specific origins
export function strictCors(allowedOrigins: string[]) {
  return cors({
    ...DEFAULT_CORS_CONFIG,
    origins: allowedOrigins,
  })
}

// Development CORS - allow all origins (use only in development)
export function devCors() {
  return cors({
    ...DEFAULT_CORS_CONFIG,
    origins: '*',
  })
}

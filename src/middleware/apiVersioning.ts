/**
 * API versioning system
 */

import { NextRequest, NextResponse } from 'next/server'

export type ApiVersion = 'v1' | 'v2'

/**
 * getApiVersion utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getApiVersion.
 */
export function getApiVersion(request: NextRequest): ApiVersion {
  // Check header
  const versionHeader = request.headers.get('X-API-Version')
  if (versionHeader === 'v2') return 'v2'

  // Check URL path
  const url = new URL(request.url)
  if (url.pathname.startsWith('/api/v2')) return 'v2'

  // Default to v1
  return 'v1'
}

/**
 * withVersioning utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of withVersioning.
 */
export function withVersioning(
  handlers: Record<ApiVersion, (req: NextRequest) => Promise<NextResponse>>
) {
  return async (request: NextRequest) => {
    const version = getApiVersion(request)
    const handler = handlers[version]

    if (!handler) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_API_VERSION',
            message: `API version ${version} is not supported`,
          },
        },
        { status: 400 }
      )
    }

    return handler(request)
  }
}

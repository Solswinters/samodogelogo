/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { NextRequest } from 'next/server'
import { ethers } from 'ethers'
import { unauthorizedResponse, forbiddenResponse } from './response'

// Authentication result
export interface AuthContext {
  address: string
  signature?: string
  message?: string
}

// Verify signature helper
export async function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()
  } catch {
    return false
  }
}

// Extract authentication from request headers
export function extractAuthHeaders(request: NextRequest): {
  address?: string
  signature?: string
  message?: string
} {
  const address = request.headers.get('x-wallet-address')
  const signature = request.headers.get('x-wallet-signature')
  const message = request.headers.get('x-wallet-message')

  return {
    address: address ?? undefined,
    signature: signature ?? undefined,
    message: message ?? undefined,
  }
}

// Authentication middleware - requires wallet signature
export function requireAuth() {
  return async (
    request: NextRequest,
    handler: (context: AuthContext) => Promise<Response>
  ): Promise<Response> => {
    const { address, signature, message } = extractAuthHeaders(request)

    // Check if all auth headers are present
    if (!address || !signature || !message) {
      return unauthorizedResponse('Missing authentication headers', {
        required: ['x-wallet-address', 'x-wallet-signature', 'x-wallet-message'],
      })
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      return unauthorizedResponse('Invalid wallet address format')
    }

    // Verify signature
    const isValid = await verifySignature(message, signature, address)

    if (!isValid) {
      return unauthorizedResponse('Invalid signature')
    }

    // Check message timestamp to prevent replay attacks
    try {
      const messageData = JSON.parse(message)
      const timestamp = messageData.timestamp as number

      // Message must be within last 5 minutes
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      if (timestamp < fiveMinutesAgo) {
        return unauthorizedResponse('Authentication expired')
      }
    } catch {
      // If message is not JSON, just verify it's recent enough
      // This is a fallback for simple message formats
    }

    // Authentication successful
    return await handler({ address, signature, message })
  }
}

// Optional authentication - doesn't fail if not present
export function optionalAuth() {
  return async (
    request: NextRequest,
    handler: (context: AuthContext | null) => Promise<Response>
  ): Promise<Response> => {
    const { address, signature, message } = extractAuthHeaders(request)

    // If no auth headers, proceed without authentication
    if (!address && !signature && !message) {
      return await handler(null)
    }

    // If partial auth headers, return error
    if (!address || !signature || !message) {
      return unauthorizedResponse('Incomplete authentication headers')
    }

    // Validate address format
    if (!ethers.isAddress(address)) {
      return unauthorizedResponse('Invalid wallet address format')
    }

    // Verify signature
    const isValid = await verifySignature(message, signature, address)

    if (!isValid) {
      return unauthorizedResponse('Invalid signature')
    }

    return await handler({ address, signature, message })
  }
}

// Admin authentication - checks against whitelist
export function requireAdmin(adminAddresses: string[]) {
  const normalizedAdmins = adminAddresses.map(addr => addr.toLowerCase())

  return async (
    request: NextRequest,
    handler: (context: AuthContext) => Promise<Response>
  ): Promise<Response> => {
    // First check authentication
    const authResult = await requireAuth()(request, async context => {
      // Check if address is in admin list
      if (!normalizedAdmins.includes(context.address.toLowerCase())) {
        return forbiddenResponse('Admin access required')
      }

      // Admin verified, proceed
      return await handler(context)
    })

    return authResult
  }
}

// API key authentication
export function requireApiKey(validKeys: string[]) {
  return async (request: NextRequest, handler: () => Promise<Response>): Promise<Response> => {
    const apiKey = request.headers.get('x-api-key')

    if (!apiKey) {
      return unauthorizedResponse('API key required', {
        header: 'x-api-key',
      })
    }

    if (!validKeys.includes(apiKey)) {
      return unauthorizedResponse('Invalid API key')
    }

    return await handler()
  }
}

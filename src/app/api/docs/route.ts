import type { NextRequest } from 'next/server'
import { successResponse } from '@/middleware/response'

// API documentation
const API_DOCS = {
  version: '1.0.0',
  title: 'SamoDoge Game API',
  description: 'API for SamoDoge Web3 game',
  baseUrl: '/api',
  endpoints: {
    game: {
      claim: {
        path: '/game/claim',
        method: 'POST',
        description: 'Generate signature for reward claim',
        authentication: false,
        rateLimit: '10 requests per minute',
        request: {
          address: 'string (wallet address)',
          score: 'number (0-50000)',
          isWinner: 'boolean',
        },
        response: {
          success: 'boolean',
          data: {
            nonce: 'number',
            signature: 'string',
          },
        },
      },
      leaderboard: {
        path: '/game/leaderboard',
        method: 'GET',
        description: 'Get game leaderboard',
        authentication: false,
        rateLimit: '100 requests per 15 minutes',
        queryParams: {
          page: 'number (default: 1)',
          pageSize: 'number (default: 20, max: 100)',
          period: 'string (daily|weekly|monthly|all-time)',
        },
      },
      stats: {
        path: '/game/stats',
        method: 'GET',
        description: 'Get game statistics',
        authentication: false,
        rateLimit: '100 requests per 15 minutes',
        queryParams: {
          address: 'string (optional, for player-specific stats)',
        },
      },
      verify: {
        path: '/game/verify',
        method: 'POST',
        description: 'Verify game score for anti-cheat',
        authentication: false,
        rateLimit: '10 requests per minute',
        request: {
          address: 'string (wallet address)',
          score: 'number (0-50000)',
          gameData: {
            duration: 'number (milliseconds)',
            obstacles: 'number',
            timestamp: 'number (unix timestamp)',
          },
        },
      },
    },
    health: {
      check: {
        path: '/health',
        method: 'GET',
        description: 'Health check endpoint',
        authentication: false,
        rateLimit: 'unlimited',
      },
    },
  },
  authentication: {
    type: 'Wallet Signature',
    headers: {
      'x-wallet-address': 'Wallet address',
      'x-wallet-signature': 'Signed message',
      'x-wallet-message': 'Message that was signed',
    },
  },
  errors: {
    INVALID_INPUT: {
      code: 'INVALID_INPUT',
      status: 400,
      description: 'Request validation failed',
    },
    UNAUTHORIZED: {
      code: 'UNAUTHORIZED',
      status: 401,
      description: 'Authentication required or invalid',
    },
    FORBIDDEN: {
      code: 'FORBIDDEN',
      status: 403,
      description: 'Access denied',
    },
    NOT_FOUND: {
      code: 'NOT_FOUND',
      status: 404,
      description: 'Resource not found',
    },
    RATE_LIMIT_EXCEEDED: {
      code: 'RATE_LIMIT_EXCEEDED',
      status: 429,
      description: 'Too many requests',
    },
    INTERNAL_SERVER_ERROR: {
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
      description: 'Server error',
    },
    SERVICE_UNAVAILABLE: {
      code: 'SERVICE_UNAVAILABLE',
      status: 503,
      description: 'Service temporarily unavailable',
    },
  },
}

export async function GET(_request: NextRequest) {
  return successResponse(API_DOCS, 'API documentation')
}

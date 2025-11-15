import type { NextRequest } from 'next/server'
import { successResponse } from '@/middleware/response'

// Health check endpoint for monitoring
export async function GET(_request: NextRequest) {
  const uptime = process.uptime()
  const memoryUsage = process.memoryUsage()

  return successResponse(
    {
      status: 'healthy',
      uptime: Math.floor(uptime),
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed: Math.floor(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.floor(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        rss: Math.floor(memoryUsage.rss / 1024 / 1024) + ' MB',
      },
      env: process.env.NODE_ENV,
      version: process.env.npm_package_version ?? 'unknown',
    },
    'Service is healthy'
  )
}

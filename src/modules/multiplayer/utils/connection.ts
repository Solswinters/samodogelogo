/**
 * Connection quality utilities
 */

import { CONNECTION_QUALITY, MAX_PING } from '../constants'
import type { ConnectionQuality } from '../constants'

export function getPingQuality(ping: number): ConnectionQuality {
  if (ping < 50) {
    return CONNECTION_QUALITY.EXCELLENT
  }
  if (ping < 100) {
    return CONNECTION_QUALITY.GOOD
  }
  if (ping < 200) {
    return CONNECTION_QUALITY.FAIR
  }
  return CONNECTION_QUALITY.POOR
}

export function isConnectionAcceptable(ping: number): boolean {
  return ping < MAX_PING
}

export function formatPing(ping: number): string {
  return `${ping}ms`
}

export function getConnectionColor(quality: ConnectionQuality): string {
  const colors = {
    [CONNECTION_QUALITY.EXCELLENT]: '#10b981', // green
    [CONNECTION_QUALITY.GOOD]: '#3b82f6', // blue
    [CONNECTION_QUALITY.FAIR]: '#f59e0b', // yellow
    [CONNECTION_QUALITY.POOR]: '#ef4444', // red
  }

  return colors[quality]
}

export function calculateAveragePing(pings: number[]): number {
  if (pings.length === 0) {
    return 0
  }

  const sum = pings.reduce((acc, ping) => acc + ping, 0)
  return Math.round(sum / pings.length)
}

export function shouldReconnect(attempts: number, maxAttempts: number): boolean {
  return attempts < maxAttempts
}

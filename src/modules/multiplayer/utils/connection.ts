/**
 * Connection quality utilities
 */

import { CONNECTION_QUALITY, MAX_PING } from '../constants'
import type { ConnectionQuality } from '../constants'

/**
 * getPingQuality utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getPingQuality.
 */
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

/**
 * isConnectionAcceptable utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isConnectionAcceptable.
 */
export function isConnectionAcceptable(ping: number): boolean {
  return ping < MAX_PING
}

/**
 * formatPing utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatPing.
 */
export function formatPing(ping: number): string {
  return `${ping}ms`
}

/**
 * getConnectionColor utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getConnectionColor.
 */
export function getConnectionColor(quality: ConnectionQuality): string {
  const colors = {
    [CONNECTION_QUALITY.EXCELLENT]: '#10b981', // green
    [CONNECTION_QUALITY.GOOD]: '#3b82f6', // blue
    [CONNECTION_QUALITY.FAIR]: '#f59e0b', // yellow
    [CONNECTION_QUALITY.POOR]: '#ef4444', // red
  }

  return colors[quality]
}

/**
 * calculateAveragePing utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of calculateAveragePing.
 */
export function calculateAveragePing(pings: number[]): number {
  if (pings.length === 0) {
    return 0
  }

  const sum = pings.reduce((acc, ping) => acc + ping, 0)
  return Math.round(sum / pings.length)
}

/**
 * shouldReconnect utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of shouldReconnect.
 */
export function shouldReconnect(attempts: number, maxAttempts: number): boolean {
  return attempts < maxAttempts
}

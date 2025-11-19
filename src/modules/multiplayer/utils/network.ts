/**
 * Network utility functions
 */

export function isValidWebSocketUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'ws:' || urlObj.protocol === 'wss:'
  } catch {
    return false
  }
}

export function getWebSocketState(readyState: number): string {
  switch (readyState) {
    case 0:
      return 'CONNECTING'
    case 1:
      return 'OPEN'
    case 2:
      return 'CLOSING'
    case 3:
      return 'CLOSED'
    default:
      return 'UNKNOWN'
  }
}

export function calculateBandwidth(bytes: number, durationMs: number): number {
  if (durationMs === 0) return 0
  return (bytes * 8) / (durationMs / 1000) / 1000 // Kb/s
}

export function formatBandwidth(kbps: number): string {
  if (kbps < 1000) {
    return `${kbps.toFixed(1)} Kb/s`
  }
  return `${(kbps / 1000).toFixed(2)} Mb/s`
}

export function estimateLatencyClass(latency: number): string {
  if (latency < 50) return 'excellent'
  if (latency < 100) return 'good'
  if (latency < 150) return 'fair'
  return 'poor'
}

export function calculatePacketLoss(sent: number, received: number): number {
  if (sent === 0) return 0
  return 1 - received / sent
}

export function calculateJitter(latencies: number[]): number {
  if (latencies.length < 2) return 0

  let sum = 0
  for (let i = 1; i < latencies.length; i++) {
    sum += Math.abs(latencies[i] - latencies[i - 1])
  }

  return sum / (latencies.length - 1)
}

export function shouldReconnect(
  attempts: number,
  maxAttempts: number,
  errorType?: string
): boolean {
  if (attempts >= maxAttempts) return false

  const fatalErrors = ['auth_failed', 'banned', 'invalid_version']
  if (errorType && fatalErrors.includes(errorType)) return false

  return true
}

export function calculateReconnectDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  multiplier = 1.5,
  jitter = true
): number {
  let delay = Math.min(baseDelay * Math.pow(multiplier, attempt), maxDelay)

  if (jitter) {
    delay = delay * (0.5 + Math.random() * 0.5)
  }

  return Math.floor(delay)
}

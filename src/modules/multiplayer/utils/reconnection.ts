/**
 * Reconnection utilities
 */

export interface ReconnectionState {
  attempts: number
  lastAttempt: number
  nextAttempt: number
  isReconnecting: boolean
}

export function createReconnectionState(): ReconnectionState {
  return {
    attempts: 0,
    lastAttempt: 0,
    nextAttempt: 0,
    isReconnecting: false,
  }
}

export function calculateBackoff(
  attempt: number,
  baseDelay = 1000,
  maxDelay = 30000,
  multiplier = 2,
  jitter = true
): number {
  let delay = Math.min(baseDelay * Math.pow(multiplier, attempt), maxDelay)

  if (jitter) {
    delay = delay * (0.5 + Math.random() * 0.5)
  }

  return Math.floor(delay)
}

export function shouldAttemptReconnect(
  state: ReconnectionState,
  maxAttempts = 5,
  errorCode?: string
): boolean {
  // Don't reconnect if max attempts reached
  if (state.attempts >= maxAttempts) return false

  // Don't reconnect for fatal errors
  const fatalErrors = ['AUTH_FAILED', 'BANNED', 'INVALID_VERSION']
  if (errorCode && fatalErrors.includes(errorCode)) return false

  // Don't reconnect if already reconnecting
  if (state.isReconnecting) return false

  return true
}

export function canReconnectNow(state: ReconnectionState): boolean {
  return Date.now() >= state.nextAttempt
}

export function updateReconnectionState(
  state: ReconnectionState,
  delay: number
): ReconnectionState {
  return {
    attempts: state.attempts + 1,
    lastAttempt: Date.now(),
    nextAttempt: Date.now() + delay,
    isReconnecting: true,
  }
}

export function resetReconnectionState(state: ReconnectionState): ReconnectionState {
  return {
    attempts: 0,
    lastAttempt: 0,
    nextAttempt: 0,
    isReconnecting: false,
  }
}

export function getReconnectMessage(attempt: number, maxAttempts: number): string {
  if (attempt === 1) return 'Connection lost. Reconnecting...'
  if (attempt >= maxAttempts) return 'Unable to reconnect. Please refresh.'
  return `Reconnecting... (${attempt}/${maxAttempts})`
}

export function estimateReconnectTime(state: ReconnectionState): number {
  if (!state.isReconnecting) return 0
  return Math.max(0, state.nextAttempt - Date.now())
}

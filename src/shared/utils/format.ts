/**
 * Shared formatting utilities
 */

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatPercent(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

export function formatTokenAmount(amount: string, decimals = 18, displayDecimals = 4): string {
  const value = BigInt(amount)
  const divisor = BigInt(10 ** decimals)
  const integerPart = value / divisor
  const fractionalPart = value % divisor

  if (fractionalPart === BigInt(0)) {
    return integerPart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = fractionalStr.slice(0, displayDecimals).replace(/0+$/, '')

  if (trimmedFractional === '') {
    return integerPart.toString()
  }

  return `${integerPart}.${trimmedFractional}`
}

export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) {
    return address
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

export function formatHash(hash: string, startChars = 10, endChars = 8): string {
  if (hash.length <= startChars + endChars) {
    return hash
  }
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {return `${days}d ago`}
  if (hours > 0) {return `${hours}h ago`}
  if (minutes > 0) {return `${minutes}m ago`}
  if (seconds > 0) {return `${seconds}s ago`}
  return 'just now'
}

export function formatDate(timestamp: number, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', options).format(timestamp)
}

export function formatFullDate(timestamp: number): string {
  return formatDate(timestamp, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatShortDate(timestamp: number): string {
  return formatDate(timestamp, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Formatting helper utilities
 */

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals).replace(/\.?0+$/, '')
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${formatNumber(value * 100, decimals)}%`
}

export const formatDate = (date: Date | number): string => {
  const d = typeof date === 'number' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatTime = (date: Date | number): string => {
  const d = typeof date === 'number' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateTime = (date: Date | number): string => {
  return `${formatDate(date)} ${formatTime(date)}`
}

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) {return '0 B'}
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${formatNumber(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
}

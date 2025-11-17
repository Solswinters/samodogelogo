/**
 * Date and time utilities
 */

export function formatRelativeTime(date: Date | number): string {
  const now = Date.now()
  const then = typeof date === 'number' ? date : date.getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) {return 'just now'}
  if (seconds < 3600) {return `${Math.floor(seconds / 60)}m ago`}
  if (seconds < 86400) {return `${Math.floor(seconds / 3600)}h ago`}
  if (seconds < 604800) {return `${Math.floor(seconds / 86400)}d ago`}
  if (seconds < 2592000) {return `${Math.floor(seconds / 604800)}w ago`}
  if (seconds < 31536000) {return `${Math.floor(seconds / 2592000)}mo ago`}
  return `${Math.floor(seconds / 31536000)}y ago`
}

export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

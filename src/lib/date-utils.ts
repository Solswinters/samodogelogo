/**
 * Date and time utilities
 */

/**
 * formatRelativeTime utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatRelativeTime.
 */
export function formatRelativeTime(date: Date | number): string {
  const now = Date.now()
  const then = typeof date === 'number' ? date : date.getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) {
    return 'just now'
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`
  }
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}d ago`
  }
  if (seconds < 2592000) {
    return `${Math.floor(seconds / 604800)}w ago`
  }
  if (seconds < 31536000) {
    return `${Math.floor(seconds / 2592000)}mo ago`
  }
  return `${Math.floor(seconds / 31536000)}y ago`
}

/**
 * isToday utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isToday.
 */
export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * addDays utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addDays.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * addHours utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addHours.
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

/**
 * startOfDay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of startOfDay.
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * endOfDay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of endOfDay.
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * isSameDay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isSameDay.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

/**
 * addMinutes utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addMinutes.
 */
export function addMinutes(date: Date, minutes: number): Date {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

/**
 * addSeconds utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addSeconds.
 */
export function addSeconds(date: Date, seconds: number): Date {
  const result = new Date(date)
  result.setSeconds(result.getSeconds() + seconds)
  return result
}

/**
 * addMonths utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addMonths.
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * addYears utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addYears.
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

/**
 * differenceInDays utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of differenceInDays.
 */
export function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * differenceInHours utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of differenceInHours.
 */
export function differenceInHours(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60))
}

/**
 * differenceInMinutes utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of differenceInMinutes.
 */
export function differenceInMinutes(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60))
}

/**
 * differenceInSeconds utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of differenceInSeconds.
 */
export function differenceInSeconds(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / 1000)
}

/**
 * startOfWeek utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of startOfWeek.
 */
export function startOfWeek(date: Date, startDay = 0): Date {
  const result = startOfDay(date)
  const day = result.getDay()
  const diff = (day < startDay ? 7 : 0) + day - startDay
  result.setDate(result.getDate() - diff)
  return result
}

/**
 * endOfWeek utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of endOfWeek.
 */
export function endOfWeek(date: Date, startDay = 0): Date {
  const result = endOfDay(date)
  const day = result.getDay()
  const diff = (day < startDay ? -7 : 0) + 6 - (day - startDay)
  result.setDate(result.getDate() + diff)
  return result
}

/**
 * startOfMonth utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of startOfMonth.
 */
export function startOfMonth(date: Date): Date {
  const result = startOfDay(date)
  result.setDate(1)
  return result
}

/**
 * endOfMonth utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of endOfMonth.
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1, 0)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * startOfYear utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of startOfYear.
 */
export function startOfYear(date: Date): Date {
  const result = startOfDay(date)
  result.setMonth(0, 1)
  return result
}

/**
 * endOfYear utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of endOfYear.
 */
export function endOfYear(date: Date): Date {
  const result = new Date(date)
  result.setMonth(11, 31)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * isWeekend utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isWeekend.
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

/**
 * isWeekday utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isWeekday.
 */
export function isWeekday(date: Date): boolean {
  return !isWeekend(date)
}

/**
 * getDayName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getDayName.
 */
export function getDayName(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { weekday: 'long' })
}

/**
 * getMonthName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getMonthName.
 */
export function getMonthName(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { month: 'long' })
}

/**
 * formatDate utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatDate.
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * isLeapYear utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isLeapYear.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * getDaysInMonth utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getDaysInMonth.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * getWeekNumber utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getWeekNumber.
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/**
 * isValid utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValid.
 */
export function isValid(date: Date | number | string): boolean {
  const d = new Date(date)
  return !isNaN(d.getTime())
}

/**
 * isBefore utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isBefore.
 */
export function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime()
}

/**
 * isAfter utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isAfter.
 */
export function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime()
}

/**
 * isBetween utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isBetween.
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime()
  return time >= start.getTime() && time <= end.getTime()
}

/**
 * getQuarter utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getQuarter.
 */
export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1
}

/**
 * toISODate utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of toISODate.
 */
export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * fromISODate utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of fromISODate.
 */
export function fromISODate(isoString: string): Date {
  return new Date(isoString)
}

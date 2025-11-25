/**
 * Number formatting utilities
 */

/**
 * formatNumber utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatNumber.
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * formatCurrency utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatCurrency.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

/**
 * formatPercentage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatPercentage.
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * formatCompactNumber utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatCompactNumber.
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
}

/**
 * formatOrdinal utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of formatOrdinal.
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const value = num % 100
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
}

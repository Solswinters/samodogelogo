/**
 * Validation helper utilities
 */

/**
 * isValidAddress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidAddress.
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * isValidTxHash utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidTxHash.
 */
export const isValidTxHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

/**
 * isValidNumber utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidNumber.
 */
export const isValidNumber = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * isPositiveNumber utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isPositiveNumber.
 */
export const isPositiveNumber = (value: unknown): boolean => {
  return isValidNumber(value) && (value as number) > 0
}

/**
 * isValidEmail utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidEmail.
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * isValidURL utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidURL.
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * sanitizeString utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeString.
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * truncateAddress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of truncateAddress.
 */
export const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (!isValidAddress(address)) {
    return address
  }
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

/**
 * validateRange utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateRange.
 */
export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

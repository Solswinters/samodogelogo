/**
 * Environment detection utilities
 */

/**
 * isClient utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isClient.
 */
export const isClient = typeof window !== 'undefined'
/**
 * isServer utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isServer.
 */
export const isServer = !isClient
/**
 * isDevelopment utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isDevelopment.
 */
export const isDevelopment = process.env.NODE_ENV === 'development'
/**
 * isProduction utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isProduction.
 */
export const isProduction = process.env.NODE_ENV === 'production'
/**
 * isTest utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isTest.
 */
export const isTest = process.env.NODE_ENV === 'test'

/**
 * isBrowser utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isBrowser.
 */
export function isBrowser(): boolean {
  return isClient
}

/**
 * isMobile utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isMobile.
 */
export function isMobile(): boolean {
  if (!isClient) {
    return false
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * isIOS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isIOS.
 */
export function isIOS(): boolean {
  if (!isClient) {
    return false
  }
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * isAndroid utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isAndroid.
 */
export function isAndroid(): boolean {
  if (!isClient) {
    return false
  }
  return /Android/i.test(navigator.userAgent)
}

/**
 * isSafari utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isSafari.
 */
export function isSafari(): boolean {
  if (!isClient) {
    return false
  }
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

/**
 * isChrome utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isChrome.
 */
export function isChrome(): boolean {
  if (!isClient) {
    return false
  }
  return /Chrome/i.test(navigator.userAgent) && !/Edge/i.test(navigator.userAgent)
}

/**
 * isFirefox utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isFirefox.
 */
export function isFirefox(): boolean {
  if (!isClient) {
    return false
  }
  return /Firefox/i.test(navigator.userAgent)
}

/**
 * getEnvironment utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getEnvironment.
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  return process.env.NODE_ENV
}

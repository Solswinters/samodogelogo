/**
 * Environment detection utilities
 */

export const isClient = typeof window !== 'undefined'
export const isServer = !isClient
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'

export function isBrowser(): boolean {
  return isClient
}

export function isMobile(): boolean {
  if (!isClient) {return false}
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function isIOS(): boolean {
  if (!isClient) {return false}
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isAndroid(): boolean {
  if (!isClient) {return false}
  return /Android/i.test(navigator.userAgent)
}

export function isSafari(): boolean {
  if (!isClient) {return false}
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export function isChrome(): boolean {
  if (!isClient) {return false}
  return /Chrome/i.test(navigator.userAgent) && !/Edge/i.test(navigator.userAgent)
}

export function isFirefox(): boolean {
  if (!isClient) {return false}
  return /Firefox/i.test(navigator.userAgent)
}

export function getEnvironment(): 'development' | 'production' | 'test' {
  return process.env.NODE_ENV
}

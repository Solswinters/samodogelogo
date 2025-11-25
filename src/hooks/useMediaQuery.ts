/**
 * Media query hook for responsive design
 */

import { useState, useEffect } from 'react'

/**
 * useMediaQuery utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useMediaQuery.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Common breakpoint hooks
/**
 * useIsMobile utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useIsMobile.
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
/**
 * useIsTablet utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useIsTablet.
 */
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
/**
 * useIsDesktop utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useIsDesktop.
 */
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')

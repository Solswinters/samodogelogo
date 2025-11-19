/**
 * Hook to prevent body scroll (for modals)
 */

import { useEffect } from 'react'

export function usePreventScroll(shouldPrevent: boolean) {
  useEffect(() => {
    if (!shouldPrevent) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [shouldPrevent])
}

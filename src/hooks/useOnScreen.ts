import { useEffect, useState, useRef } from 'react'

/**
 * useOnScreen utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useOnScreen.
 */
export function useOnScreen<T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsOnScreen(entry.isIntersecting)
    }, options)

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options])

  return [ref, isOnScreen]
}

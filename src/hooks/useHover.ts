import { useEffect, useRef, useState } from 'react'

/**
 * useHover utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useHover.
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] {
  const [isHovering, setIsHovering] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter)
      node.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return [ref, isHovering]
}

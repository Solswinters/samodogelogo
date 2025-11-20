/**
 * DOM manipulation and selection utilities
 */

export class DOMSelectors {
  /**
   * Safely query selector
   */
  static query<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    if (typeof document === 'undefined') return null
    return document.querySelector<T>(selector)
  }

  /**
   * Safely query all selectors
   */
  static queryAll<T extends HTMLElement = HTMLElement>(selector: string): T[] {
    if (typeof document === 'undefined') return []
    return Array.from(document.querySelectorAll<T>(selector))
  }

  /**
   * Query element by ID
   */
  static byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
    if (typeof document === 'undefined') return null
    return document.getElementById(id) as T | null
  }

  /**
   * Query elements by class name
   */
  static byClass<T extends HTMLElement = HTMLElement>(className: string): T[] {
    if (typeof document === 'undefined') return []
    return Array.from(document.getElementsByClassName(className)) as T[]
  }

  /**
   * Query elements by tag name
   */
  static byTag<T extends HTMLElement = HTMLElement>(tagName: string): T[] {
    if (typeof document === 'undefined') return []
    return Array.from(document.getElementsByTagName(tagName)) as T[]
  }

  /**
   * Check if element matches selector
   */
  static matches(element: HTMLElement, selector: string): boolean {
    if (typeof element === 'undefined') return false
    return element.matches(selector)
  }

  /**
   * Find closest ancestor matching selector
   */
  static closest<T extends HTMLElement = HTMLElement>(
    element: HTMLElement,
    selector: string
  ): T | null {
    if (typeof element === 'undefined') return null
    return element.closest<T>(selector)
  }

  /**
   * Get all siblings of element
   */
  static siblings(element: HTMLElement): HTMLElement[] {
    if (!element.parentNode) return []
    return Array.from(element.parentNode.children).filter(
      (child) => child !== element
    ) as HTMLElement[]
  }

  /**
   * Get next sibling element
   */
  static nextSibling(element: HTMLElement): HTMLElement | null {
    return element.nextElementSibling as HTMLElement | null
  }

  /**
   * Get previous sibling element
   */
  static prevSibling(element: HTMLElement): HTMLElement | null {
    return element.previousElementSibling as HTMLElement | null
  }

  /**
   * Check if element is visible
   */
  static isVisible(element: HTMLElement): boolean {
    if (!element) return false
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element: HTMLElement): boolean {
    if (typeof window === 'undefined' || !element) return false
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  /**
   * Get element dimensions
   */
  static getDimensions(element: HTMLElement): {
    width: number
    height: number
    top: number
    left: number
  } {
    if (!element) return { width: 0, height: 0, top: 0, left: 0 }
    const rect = element.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
    }
  }

  /**
   * Scroll element into view
   */
  static scrollIntoView(element: HTMLElement, options?: ScrollIntoViewOptions): void {
    if (!element) return
    element.scrollIntoView(options || { behavior: 'smooth', block: 'center' })
  }

  /**
   * Add class to element
   */
  static addClass(element: HTMLElement, ...classNames: string[]): void {
    if (!element) return
    element.classList.add(...classNames)
  }

  /**
   * Remove class from element
   */
  static removeClass(element: HTMLElement, ...classNames: string[]): void {
    if (!element) return
    element.classList.remove(...classNames)
  }

  /**
   * Toggle class on element
   */
  static toggleClass(element: HTMLElement, className: string): void {
    if (!element) return
    element.classList.toggle(className)
  }

  /**
   * Check if element has class
   */
  static hasClass(element: HTMLElement, className: string): boolean {
    if (!element) return false
    return element.classList.contains(className)
  }
}

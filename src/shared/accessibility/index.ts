/**
 * Accessibility utilities
 */

/**
 * Screen reader only class (visually hidden but accessible)
 */
export const srOnly = 'sr-only'

/**
 * Focus visible utilities
 */
export const focusRing = {
  default:
    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
  thin: 'focus:outline-none focus:ring-1 focus:ring-purple-500',
  none: 'focus:outline-none',
} as const

/**
 * Skip link utilities
 */
export const skipLink =
  'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-500 focus:text-white focus:rounded'

/**
 * ARIA helpers
 */
export function getAriaProps(options: {
  label?: string
  labelledBy?: string
  describedBy?: string
  expanded?: boolean
  selected?: boolean
  checked?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  hidden?: boolean
  live?: 'off' | 'polite' | 'assertive'
  role?: string
}) {
  const props: Record<string, string | boolean> = {}

  if (options.label) props['aria-label'] = options.label
  if (options.labelledBy) props['aria-labelledby'] = options.labelledBy
  if (options.describedBy) props['aria-describedby'] = options.describedBy
  if (options.expanded !== undefined) props['aria-expanded'] = options.expanded
  if (options.selected !== undefined) props['aria-selected'] = options.selected
  if (options.checked !== undefined) props['aria-checked'] = options.checked
  if (options.disabled !== undefined) props['aria-disabled'] = options.disabled
  if (options.required !== undefined) props['aria-required'] = options.required
  if (options.invalid !== undefined) props['aria-invalid'] = options.invalid
  if (options.hidden !== undefined) props['aria-hidden'] = options.hidden
  if (options.live) props['aria-live'] = options.live
  if (options.role) props['role'] = options.role

  return props
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.classList.add('sr-only')
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Keyboard navigation helpers
 */
export const keyboardNav = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const

/**
 * Focus management utilities
 */
export function focusElement(element: HTMLElement | null) {
  if (element) {
    element.focus()
  }
}

/**
 * focusFirstFocusableChild utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of focusFirstFocusableChild.
 */
export function focusFirstFocusableChild(container: HTMLElement) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (focusable.length > 0) {
    focusable[0]?.focus()
  }
}

/**
 * trapFocus utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of trapFocus.
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled'))

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }
}

/**
 * Reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * High contrast mode detection
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Color scheme preference
 */
export function getPreferredColorScheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

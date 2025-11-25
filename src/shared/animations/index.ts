/**
 * Animation utilities and presets
 */

/**
 * animations utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of animations.
 */
export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',

  // Slide animations
  slideInFromTop: 'animate-in slide-in-from-top duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left duration-300',
  slideInFromRight: 'animate-in slide-in-from-right duration-300',

  // Scale animations
  scaleIn: 'animate-in zoom-in duration-200',
  scaleOut: 'animate-out zoom-out duration-200',

  // Bounce animations
  bounce: 'animate-bounce',

  // Pulse animations
  pulse: 'animate-pulse',

  // Spin animations
  spin: 'animate-spin',

  // Custom transitions
  transition: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },

  // Easing functions
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
  },
} as const

export type AnimationPreset = keyof typeof animations

/**
 * Get animation class string
 */
export function getAnimation(preset: string): string {
  return (animations[preset as keyof typeof animations] as string) || ''
}

/**
 * Combine multiple animation classes
 */
export function combineAnimations(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Animation delay utilities
 */
export const delays = {
  none: 'delay-0',
  xs: 'delay-75',
  sm: 'delay-150',
  md: 'delay-300',
  lg: 'delay-500',
  xl: 'delay-700',
  '2xl': 'delay-1000',
} as const

/**
 * Animation duration utilities
 */
export const durations = {
  fastest: 'duration-75',
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',
  slower: 'duration-700',
  slowest: 'duration-1000',
} as const

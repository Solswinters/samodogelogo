/**
 * Utility for conditional className joining
 * Similar to clsx but lightweight and tailwind-optimized
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter(x => typeof x === 'string' && x.length > 0)
    .join(' ')
    .trim()
}

export default cn

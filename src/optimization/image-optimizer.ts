/**
 * Image optimization utilities
 */

export interface ImageOptimizationOptions {
  quality?: number
  width?: number
  height?: number
  format?: 'webp' | 'jpeg' | 'png'
}

/**
 * optimizeImage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of optimizeImage.
 */
export function optimizeImage(src: string, options: ImageOptimizationOptions = {}): string {
  const { quality = 80, width, height, format = 'webp' } = options

  const params = new URLSearchParams()
  if (quality) params.append('q', quality.toString())
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())
  if (format) params.append('f', format)

  return `${src}?${params.toString()}`
}

/**
 * generateSrcSet utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateSrcSet.
 */
export function generateSrcSet(src: string, widths: number[]): string {
  return widths.map((width) => `${optimizeImage(src, { width })} ${width}w`).join(', ')
}

/**
 * generateSizes utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateSizes.
 */
export function generateSizes(breakpoints: Record<string, number>): string {
  return Object.entries(breakpoints)
    .map(([query, width]) => `${query} ${width}px`)
    .join(', ')
}

/**
 * preloadCriticalImages utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of preloadCriticalImages.
 */
export function preloadCriticalImages(images: string[]) {
  images.forEach((src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

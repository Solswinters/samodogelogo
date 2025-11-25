/**
 * Web Vitals performance metrics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

/**
 * reportWebVitals utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of reportWebVitals.
 */
export function reportWebVitals() {
  onCLS((metric) => {
    console.log('CLS:', metric.value)
    // Send to analytics
  })

  onFID((metric) => {
    console.log('FID:', metric.value)
    // Send to analytics
  })

  onFCP((metric) => {
    console.log('FCP:', metric.value)
    // Send to analytics
  })

  onLCP((metric) => {
    console.log('LCP:', metric.value)
    // Send to analytics
  })

  onTTFB((metric) => {
    console.log('TTFB:', metric.value)
    // Send to analytics
  })
}

/**
 * measurePageLoad utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of measurePageLoad.
 */
export function measurePageLoad() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    console.log('Page load time:', pageLoadTime)
  })
}

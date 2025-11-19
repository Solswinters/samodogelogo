/**
 * Web Vitals performance metrics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

export function reportWebVitals() {
  onCLS(metric => {
    console.log('CLS:', metric.value)
    // Send to analytics
  })

  onFID(metric => {
    console.log('FID:', metric.value)
    // Send to analytics
  })

  onFCP(metric => {
    console.log('FCP:', metric.value)
    // Send to analytics
  })

  onLCP(metric => {
    console.log('LCP:', metric.value)
    // Send to analytics
  })

  onTTFB(metric => {
    console.log('TTFB:', metric.value)
    // Send to analytics
  })
}

export function measurePageLoad() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    console.log('Page load time:', pageLoadTime)
  })
}

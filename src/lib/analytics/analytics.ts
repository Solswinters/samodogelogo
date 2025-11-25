/**
 * Analytics tracking utilities
 */

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

class Analytics {
  private initialized = false

  init() {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      this.initialized = true
    }
  }

  track(event: AnalyticsEvent) {
    if (!this.initialized) return

    // @ts-expect-error - gtag is loaded externally
    if (window.gtag) {
      // @ts-expect-error - gtag is loaded externally
      window.gtag('event', event.name, event.properties)
    }
  }

  page(path: string) {
    if (!this.initialized) return

    // @ts-expect-error - gtag is loaded externally
    if (window.gtag) {
      // @ts-expect-error - gtag is loaded externally
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: path,
      })
    }
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.initialized) return

    // @ts-expect-error - gtag is loaded externally
    if (window.gtag) {
      // @ts-expect-error - gtag is loaded externally
      window.gtag('set', 'user_properties', {
        user_id: userId,
        ...traits,
      })
    }
  }
}

/**
 * analytics utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of analytics.
 */
export const analytics = new Analytics()

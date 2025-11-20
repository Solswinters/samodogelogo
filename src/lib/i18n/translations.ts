/**
 * Internationalization and translation utilities
 */

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja'

export type TranslationKey = string

export interface Translations {
  [key: string]: string | Translations
}

export class I18n {
  private static locale: Locale = 'en'
  private static translations: Record<Locale, Translations> = {
    en: {},
    es: {},
    fr: {},
    de: {},
    zh: {},
    ja: {},
  }

  /**
   * Set current locale
   */
  static setLocale(locale: Locale): void {
    this.locale = locale
  }

  /**
   * Get current locale
   */
  static getLocale(): Locale {
    return this.locale
  }

  /**
   * Load translations for a locale
   */
  static loadTranslations(locale: Locale, translations: Translations): void {
    this.translations[locale] = translations
  }

  /**
   * Get translation for a key
   */
  static t(key: TranslationKey, params?: Record<string, string | number>): string {
    const keys = key.split('.')
    let value: Translations | string = this.translations[this.locale]

    for (const k of keys) {
      if (typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // Replace parameters
    if (params) {
      return Object.entries(params).reduce((str, [param, val]) => {
        return str.replace(new RegExp(`\\{${param}\\}`, 'g'), String(val))
      }, value)
    }

    return value
  }

  /**
   * Check if translation exists
   */
  static has(key: TranslationKey): boolean {
    const keys = key.split('.')
    let value: Translations | string = this.translations[this.locale]

    for (const k of keys) {
      if (typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return false
      }
    }

    return typeof value === 'string'
  }

  /**
   * Get supported locales
   */
  static getSupportedLocales(): Locale[] {
    return Object.keys(this.translations) as Locale[]
  }

  /**
   * Format number according to locale
   */
  static formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    if (typeof Intl === 'undefined') return String(value)
    return new Intl.NumberFormat(this.locale, options).format(value)
  }

  /**
   * Format date according to locale
   */
  static formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    if (typeof Intl === 'undefined') return date.toISOString()
    return new Intl.DateTimeFormat(this.locale, options).format(date)
  }

  /**
   * Format currency according to locale
   */
  static formatCurrency(value: number, currency: string): string {
    if (typeof Intl === 'undefined') return `${currency} ${value}`
    return new Intl.NumberFormat(this.locale, { style: 'currency', currency }).format(value)
  }

  /**
   * Pluralize based on count
   */
  static plural(
    key: TranslationKey,
    count: number,
    params?: Record<string, string | number>
  ): string {
    const pluralKey = count === 1 ? `${key}.one` : `${key}.other`
    return this.t(pluralKey, { ...params, count })
  }
}

/**
 * Clipboard utilities for copy/paste operations
 */

export class ClipboardUtils {
  /**
   * Copy text to clipboard
   */
  static async copyText(text: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return this.fallbackCopyText(text)
    }

    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return this.fallbackCopyText(text)
    }
  }

  /**
   * Fallback copy method using temporary textarea
   */
  private static fallbackCopyText(text: string): boolean {
    if (typeof document === 'undefined') {return false}

    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    let success = false
    try {
      success = document.execCommand('copy')
    } catch {
      success = false
    }

    document.body.removeChild(textarea)
    return success
  }

  /**
   * Read text from clipboard
   */
  static async readText(): Promise<string | null> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return null
    }

    try {
      return await navigator.clipboard.readText()
    } catch {
      return null
    }
  }

  /**
   * Check if clipboard API is available
   */
  static isAvailable(): boolean {
    return typeof navigator !== 'undefined' && 'clipboard' in navigator
  }
}

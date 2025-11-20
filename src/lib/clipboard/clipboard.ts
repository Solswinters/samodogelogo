/**
 * Clipboard utilities for copy/paste operations
 */

export class Clipboard {
  /**
   * Copy text to clipboard
   */
  static async copyText(text: string): Promise<boolean> {
    if (typeof navigator === 'undefined') return false

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }

      // Fallback for older browsers
      return this.fallbackCopyText(text)
    } catch (error) {
      console.error('Failed to copy text:', error)
      return false
    }
  }

  /**
   * Fallback copy method for older browsers
   */
  private static fallbackCopyText(text: string): boolean {
    if (typeof document === 'undefined') return false

    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      return successful
    } catch (error) {
      document.body.removeChild(textArea)
      return false
    }
  }

  /**
   * Read text from clipboard
   */
  static async readText(): Promise<string | null> {
    if (typeof navigator === 'undefined') return null

    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText()
      }
      return null
    } catch (error) {
      console.error('Failed to read clipboard:', error)
      return null
    }
  }

  /**
   * Check if clipboard API is supported
   */
  static isSupported(): boolean {
    return (
      typeof navigator !== 'undefined' && !!navigator.clipboard && !!navigator.clipboard.writeText
    )
  }

  /**
   * Copy JSON data to clipboard
   */
  static async copyJSON(data: unknown, pretty = false): Promise<boolean> {
    const text = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
    return this.copyText(text)
  }

  /**
   * Copy HTML to clipboard
   */
  static async copyHTML(html: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false

    try {
      const blob = new Blob([html], { type: 'text/html' })
      const clipboardItem = new ClipboardItem({ 'text/html': blob })
      await navigator.clipboard.write([clipboardItem])
      return true
    } catch (error) {
      console.error('Failed to copy HTML:', error)
      return false
    }
  }

  /**
   * Copy image to clipboard
   */
  static async copyImage(blob: Blob): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false

    try {
      const clipboardItem = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([clipboardItem])
      return true
    } catch (error) {
      console.error('Failed to copy image:', error)
      return false
    }
  }
}

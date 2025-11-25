import { useState } from 'react'

/**
 * useCopyToClipboard utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useCopyToClipboard.
 */
export function useCopyToClipboard(): [string | null, (text: string) => Promise<void>] {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = async (text: string): Promise<void> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
    }
  }

  return [copiedText, copy]
}

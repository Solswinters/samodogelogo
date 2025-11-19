/**
 * Root error boundary
 */

'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">Something went wrong!</h2>
        <p className="mb-6 text-gray-400">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-purple-500 px-6 py-3 text-white transition-colors hover:bg-purple-600"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

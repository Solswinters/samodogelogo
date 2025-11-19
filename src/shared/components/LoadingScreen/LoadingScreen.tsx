/**
 * Full-screen loading component
 */

'use client'

export interface LoadingScreenProps {
  message?: string
  progress?: number
}

export function LoadingScreen({ message = 'Loading...', progress }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-purple-500" />
        <div className="text-xl font-semibold text-white">{message}</div>
        {typeof progress === 'number' && (
          <div className="mt-4">
            <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-400">{Math.round(progress)}%</div>
          </div>
        )}
      </div>
    </div>
  )
}

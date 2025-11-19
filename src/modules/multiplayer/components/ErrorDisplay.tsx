/**
 * Multiplayer error display component
 */

'use client'

import { Alert } from '@/shared/components/Alert'
import { Button } from '@/shared/components/Button'
import { getErrorMessage } from '../errors'

interface ErrorDisplayProps {
  error: unknown
  onRetry?: () => void
  onDismiss?: () => void
}

export function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
  const message = getErrorMessage(error)

  return (
    <Alert variant="error">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-white">Connection Error</h4>
          <p className="mt-1 text-sm text-gray-300">{message}</p>
        </div>
        <div className="flex gap-2">
          {onDismiss && (
            <Button onClick={onDismiss} variant="default" size="sm">
              Dismiss
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry} variant="primary" size="sm">
              Retry
            </Button>
          )}
        </div>
      </div>
    </Alert>
  )
}

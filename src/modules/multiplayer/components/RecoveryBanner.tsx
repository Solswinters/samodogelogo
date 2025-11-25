/**
 * Connection recovery banner
 */

'use client'

import { useConnectionRecovery } from '../hooks/useConnectionRecovery'
import { Alert } from '@/shared/components/Alert'
import { Button } from '@/shared/components/Button'
import { Progress } from '@/shared/components/Progress'

/**
 * RecoveryBanner utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of RecoveryBanner.
 */
export function RecoveryBanner() {
  const { isRecovering, canRecover, attemptCount, forceReconnect } = useConnectionRecovery()

  if (!isRecovering) return null

  if (!canRecover) {
    return (
      <Alert variant="error">
        <div className="text-center">
          <h4 className="font-semibold text-white">Connection Lost</h4>
          <p className="mt-1 text-sm text-gray-300">
            Unable to reconnect. Please refresh the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            className="mt-3"
            size="sm"
          >
            Refresh Page
          </Button>
        </div>
      </Alert>
    )
  }

  return (
    <Alert variant="warning">
      <div className="text-center">
        <h4 className="font-semibold text-white">Reconnecting...</h4>
        <p className="mt-1 text-sm text-gray-300">Attempt {attemptCount} of 5</p>
        <div className="mt-3">
          <Progress value={(attemptCount / 5) * 100} />
        </div>
        <Button onClick={forceReconnect} variant="default" className="mt-3" size="sm">
          Try Now
        </Button>
      </div>
    </Alert>
  )
}

/**
 * Invite notification component
 */

'use client'

import { Alert } from '@/shared/components/Alert'
import { Button } from '@/shared/components/Button'
import type { Invite } from '../types'

interface InviteNotificationProps {
  invite: Invite
  onAccept: () => void
  onDecline: () => void
}

export function InviteNotification({ invite, onAccept, onDecline }: InviteNotificationProps) {
  const timeRemaining = Math.max(0, Math.ceil((invite.expiresAt - Date.now()) / 1000))

  return (
    <Alert variant="info" className="flex items-center justify-between">
      <div className="flex-1">
        <p className="font-medium text-white">{invite.from.username} invited you to join</p>
        <p className="text-sm text-gray-400">{invite.roomName}</p>
        <p className="mt-1 text-xs text-gray-500">Expires in {timeRemaining}s</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onDecline} variant="default" size="sm">
          Decline
        </Button>
        <Button onClick={onAccept} variant="primary" size="sm">
          Accept
        </Button>
      </div>
    </Alert>
  )
}

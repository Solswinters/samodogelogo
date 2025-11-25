/**
 * Hook for invite management
 */

import { useState, useCallback, useEffect } from 'react'
import { InviteService } from '../services/InviteService'
import { useWebSocket } from './useWebSocket'
import type { Invite, PlayerInfo } from '../types'

// Singleton service
const inviteService = new InviteService()

/**
 * useInvite utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useInvite.
 */
export function useInvite(playerId: string) {
  const { send, on } = useWebSocket()
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([])

  // Listen for invite updates
  useEffect(() => {
    const unsubscribeInvite = on('invite_received', (event) => {
      const invite = event.data as Invite
      setPendingInvites((prev) => [...prev, invite])
    })

    const unsubscribeRemove = on('invite_cancelled', (event) => {
      const { inviteId } = event.data as { inviteId: string }
      setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId))
    })

    return () => {
      unsubscribeInvite()
      unsubscribeRemove()
    }
  }, [on])

  // Clear expired invites periodically
  useEffect(() => {
    const interval = setInterval(() => {
      inviteService.clearExpired()
      setPendingInvites(inviteService.getPendingInvites(playerId))
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [playerId])

  const sendInvite = useCallback(
    (from: PlayerInfo, roomId: string, roomName: string, toPlayerId: string) => {
      const invite = inviteService.createInvite(from, roomId, roomName)
      send('send_invite', { invite, toPlayerId })
      return invite
    },
    [send]
  )

  const acceptInvite = useCallback(
    (inviteId: string) => {
      const roomId = inviteService.acceptInvite(inviteId)
      if (roomId) {
        send('accept_invite', { inviteId })
        setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId))
      }
      return roomId
    },
    [send]
  )

  const declineInvite = useCallback(
    (inviteId: string) => {
      inviteService.declineInvite(inviteId)
      send('decline_invite', { inviteId })
      setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId))
    },
    [send]
  )

  return {
    pendingInvites,
    sendInvite,
    acceptInvite,
    declineInvite,
  }
}

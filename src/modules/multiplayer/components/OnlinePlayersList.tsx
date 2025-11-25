/**
 * Online players list component
 */

'use client'

import { usePresence } from '../hooks/usePresence'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import type { PresenceStatus } from '../services/PresenceService'

interface OnlinePlayersListProps {
  playerId: string
  username: string
}

/**
 * OnlinePlayersList utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of OnlinePlayersList.
 */
export function OnlinePlayersList({ playerId, username }: OnlinePlayersListProps) {
  const { onlinePlayers, onlineCount } = usePresence(playerId, username)

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">Online Players</h3>
        <Badge variant="success">{onlineCount}</Badge>
      </div>

      <div className="space-y-2">
        {onlinePlayers.map((player) => (
          <div
            key={player.playerId}
            className="flex items-center justify-between rounded-lg bg-gray-700/50 p-2"
          >
            <div className="flex items-center gap-2">
              <StatusIndicator status={player.status} />
              <span className="text-sm text-white">{player.username}</span>
            </div>
            {player.isPlaying && (
              <Badge variant="primary" className="text-xs">
                Playing
              </Badge>
            )}
          </div>
        ))}

        {onlinePlayers.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">No players online</p>
        )}
      </div>
    </Card>
  )
}

function StatusIndicator({ status }: { status: PresenceStatus }) {
  const colors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-500',
  }

  return <div className={`h-2 w-2 rounded-full ${colors[status]}`} />
}

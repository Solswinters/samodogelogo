/**
 * Spectator list component
 */

'use client'

import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import type { SpectatorInfo } from '../types'

interface SpectatorListProps {
  spectators: SpectatorInfo[]
}

/**
 * SpectatorList utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SpectatorList.
 */
export function SpectatorList({ spectators }: SpectatorListProps) {
  if (spectators.length === 0) {
    return null
  }

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Spectators</h3>
        <Badge variant="default">{spectators.length}</Badge>
      </div>

      <div className="space-y-2">
        {spectators.map(spectator => (
          <div key={spectator.playerId} className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-2 w-2 rounded-full bg-gray-500" />
            <span>{spectator.username}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

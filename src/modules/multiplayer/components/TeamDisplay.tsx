/**
 * Team display component
 */

'use client'

import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import type { TeamInfo } from '../types'

interface TeamDisplayProps {
  team: TeamInfo
  isMyTeam?: boolean
}

export function TeamDisplay({ team, isMyTeam = false }: TeamDisplayProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: team.color }} />
          <h3 className="font-semibold text-white">{team.name}</h3>
          {isMyTeam && (
            <Badge variant="primary" className="text-xs">
              Your Team
            </Badge>
          )}
        </div>
        <Badge variant="default">Score: {team.score}</Badge>
      </div>

      <div className="space-y-2">
        {team.players.map(player => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-lg bg-gray-700/50 p-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              <div>
                <p className="text-sm font-medium text-white">{player.username}</p>
                <p className="text-xs text-gray-400">Level {player.level}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{player.skillRating} SR</span>
          </div>
        ))}

        {team.players.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">No players</p>
        )}
      </div>
    </Card>
  )
}

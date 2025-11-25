/**
 * Leaderboard entry component
 */

'use client'

import { Badge } from '@/shared/components/Badge'

export interface LeaderboardPlayer {
  rank: number
  address: string
  username?: string
  score: number
  level: number
  timestamp: Date
}

export interface LeaderboardEntryProps {
  player: LeaderboardPlayer
  isCurrentUser?: boolean
}

/**
 * LeaderboardEntry utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LeaderboardEntry.
 */
export function LeaderboardEntry({ player, isCurrentUser = false }: LeaderboardEntryProps) {
  const getRankBadge = () => {
    if (player.rank === 1) return '🥇'
    if (player.rank === 2) return '🥈'
    if (player.rank === 3) return '🥉'
    return player.rank
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-lg p-4 transition-colors ${
        isCurrentUser ? 'bg-purple-500/20 ring-2 ring-purple-500' : 'bg-gray-800 hover:bg-gray-750'
      }`}
    >
      <div className="w-12 text-center text-2xl font-bold">{getRankBadge()}</div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">
            {player.username || formatAddress(player.address)}
          </span>
          {isCurrentUser && <Badge variant="success">You</Badge>}
        </div>
        <div className="text-sm text-gray-400">
          Level {player.level} • {player.timestamp.toLocaleDateString()}
        </div>
      </div>

      <div className="text-right">
        <div className="font-mono text-xl font-bold text-purple-400">
          {player.score.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">points</div>
      </div>
    </div>
  )
}

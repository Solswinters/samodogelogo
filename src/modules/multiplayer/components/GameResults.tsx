/**
 * Game results component
 */

'use client'

import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'

interface GameResultsProps {
  players: Array<{
    id: string
    name: string
    score: number
    rank: number
  }>
  currentPlayerId: string
  duration: number
  onPlayAgain: () => void
  onLeave: () => void
}

/**
 * GameResults utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GameResults.
 */
export function GameResults({
  players,
  currentPlayerId,
  duration,
  onPlayAgain,
  onLeave,
}: GameResultsProps) {
  const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank)
  const currentPlayer = players.find((p) => p.id === currentPlayerId)
  const isWinner = currentPlayer?.rank === 1

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">
            {isWinner ? '🎉 Victory!' : 'Game Over'}
          </h2>
          <p className="text-gray-400">
            Duration: {Math.floor(duration / 60000)}:
            {String(Math.floor((duration % 60000) / 1000)).padStart(2, '0')}
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">Final Rankings</h3>
        <div className="space-y-2">
          {sortedPlayers.map((player) => (
            <div
              key={player.id}
              className={`flex items-center justify-between rounded-lg p-3 ${
                player.id === currentPlayerId
                  ? 'bg-purple-500/20 ring-1 ring-purple-500'
                  : 'bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getRankMedal(player.rank)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{player.name}</span>
                    {player.id === currentPlayerId && <Badge variant="outline">You</Badge>}
                  </div>
                  <span className="text-sm text-gray-400">Score: {player.score.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button onClick={onPlayAgain} variant="default" className="flex-1">
          Play Again
        </Button>
        <Button onClick={onLeave} variant="outline" className="flex-1">
          Leave Room
        </Button>
      </div>
    </div>
  )
}

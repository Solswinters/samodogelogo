/**
 * Waiting room component
 */

'use client'

import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { PlayerCard } from './PlayerCard'

interface WaitingRoomProps {
  room: {
    name: string
    currentPlayers: number
    maxPlayers: number
  }
  players: Array<{
    id: string
    name: string
    score: number
    isReady: boolean
    isHost?: boolean
  }>
  currentPlayerId: string
  isHost: boolean
  onToggleReady: () => void
  onStartGame: () => void
  onLeave: () => void
}

/**
 * WaitingRoom utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of WaitingRoom.
 */
export function WaitingRoom({
  room,
  players,
  currentPlayerId,
  isHost,
  onToggleReady,
  onStartGame,
  onLeave,
}: WaitingRoomProps) {
  const currentPlayer = players.find((p) => p.id === currentPlayerId)
  const allReady = players.every((p) => p.isReady || p.isHost)
  const enoughPlayers = players.length >= 2

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-bold text-white">{room.name}</h2>
        <p className="text-sm text-gray-400">
          {room.currentPlayers}/{room.maxPlayers} players
        </p>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Players</h3>
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      <Card>
        <div className="flex gap-2">
          {!isHost && (
            <Button
              onClick={onToggleReady}
              variant={currentPlayer?.isReady ? 'outline' : 'default'}
              className="flex-1"
            >
              {currentPlayer?.isReady ? 'Not Ready' : 'Ready'}
            </Button>
          )}
          {isHost && (
            <Button
              onClick={onStartGame}
              disabled={!allReady || !enoughPlayers}
              variant="default"
              className="flex-1"
            >
              {!enoughPlayers
                ? 'Need More Players'
                : !allReady
                  ? 'Waiting for Players...'
                  : 'Start Game'}
            </Button>
          )}
          <Button onClick={onLeave} variant="outline">
            Leave
          </Button>
        </div>
      </Card>
    </div>
  )
}

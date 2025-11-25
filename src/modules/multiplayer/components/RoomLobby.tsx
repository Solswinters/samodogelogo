/**
 * Room lobby component
 */

'use client'

import { useRoom } from '../hooks/useRoom'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import { Switch } from '@/shared/components/Switch'

interface RoomLobbyProps {
  playerId: string
  onLeave: () => void
  onStart: () => void
}

/**
 * RoomLobby utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of RoomLobby.
 */
export function RoomLobby({ playerId, onLeave, onStart }: RoomLobbyProps) {
  const { currentRoom, setReady, startGame } = useRoom()

  if (!currentRoom) {
    return null
  }

  const isHost = currentRoom.hostId === playerId
  const currentPlayer = currentRoom.players.find((p) => p.id === playerId)
  const allPlayersReady = currentRoom.players.every((p) => p.isReady || p.isHost)
  const canStart = isHost && currentRoom.players.length >= 2 && allPlayersReady

  const handleReadyToggle = (isReady: boolean) => {
    setReady(playerId, isReady)
  }

  const handleStart = () => {
    startGame(currentRoom.id, playerId)
    onStart()
  }

  return (
    <div className="space-y-4">
      {/* Room Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{currentRoom.name}</h2>
            <p className="mt-1 text-sm text-gray-400">
              Room Code: {currentRoom.id.slice(-6).toUpperCase()}
            </p>
          </div>
          <Badge variant="primary" className="text-lg">
            {currentRoom.gameMode}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Difficulty:</span>
            <span className="ml-2 capitalize text-white">{currentRoom.settings.difficulty}</span>
          </div>
          {currentRoom.settings.timeLimit && (
            <div>
              <span className="text-gray-400">Time Limit:</span>
              <span className="ml-2 text-white">{currentRoom.settings.timeLimit}s</span>
            </div>
          )}
          {currentRoom.settings.scoreLimit && (
            <div>
              <span className="text-gray-400">Score Limit:</span>
              <span className="ml-2 text-white">{currentRoom.settings.scoreLimit}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Players */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Players ({currentRoom.players.length}/{currentRoom.maxPlayers})
        </h3>
        <div className="space-y-3">
          {currentRoom.players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-lg bg-gray-700/50 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{player.username}</span>
                    {player.isHost && (
                      <Badge variant="warning" className="text-xs">
                        Host
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {player.isReady ? (
                <Badge variant="success">Ready</Badge>
              ) : player.isHost ? (
                <Badge variant="default">Host</Badge>
              ) : (
                <Badge variant="default">Waiting</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onLeave} variant="default">
              Leave Room
            </Button>
            {!isHost && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Ready</span>
                <Switch
                  checked={currentPlayer?.isReady ?? false}
                  onCheckedChange={handleReadyToggle}
                />
              </div>
            )}
          </div>
          {isHost && (
            <Button onClick={handleStart} disabled={!canStart} variant="primary">
              Start Game
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

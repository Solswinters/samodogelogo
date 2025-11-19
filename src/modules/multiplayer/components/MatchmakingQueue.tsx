/**
 * Matchmaking queue component
 */

'use client'

import { useMatchmaking } from '../hooks/useMatchmaking'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Progress } from '@/shared/components/Progress'
import { Badge } from '@/shared/components/Badge'

interface MatchmakingQueueProps {
  playerId: string
  username: string
  skillRating: number
  region: string
  preferredMode: string
  onMatchFound?: () => void
}

export function MatchmakingQueue({
  playerId,
  username,
  skillRating,
  region,
  preferredMode,
  onMatchFound,
}: MatchmakingQueueProps) {
  const { isInQueue, queuePosition, estimatedWait, matchFound, joinQueue, leaveQueue } =
    useMatchmaking(playerId, username, skillRating)

  // Handle match found
  if (matchFound) {
    onMatchFound?.()
    return (
      <Card className="p-8 text-center">
        <div className="mb-4 text-4xl">🎮</div>
        <h3 className="mb-2 text-xl font-bold text-white">Match Found!</h3>
        <p className="text-gray-400">Connecting to game...</p>
      </Card>
    )
  }

  if (!isInQueue) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Quick Match</h3>
        <div className="mb-4 space-y-2 text-sm text-gray-400">
          <p>• Mode: {preferredMode}</p>
          <p>• Region: {region}</p>
          <p>• Skill Rating: {skillRating}</p>
        </div>
        <Button
          onClick={() => joinQueue(region, preferredMode)}
          variant="primary"
          className="w-full"
        >
          Start Matchmaking
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="mb-4 text-4xl">🔍</div>
        <h3 className="mb-2 text-xl font-bold text-white">Finding Match...</h3>

        <div className="mb-4 space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-400">Queue Position</span>
              <Badge variant="primary">#{queuePosition}</Badge>
            </div>
            <Progress value={(1 / Math.max(queuePosition, 1)) * 100} />
          </div>

          {estimatedWait > 0 && (
            <p className="text-sm text-gray-400">Estimated wait: {estimatedWait}s</p>
          )}
        </div>

        <Button onClick={leaveQueue} variant="default" className="w-full">
          Cancel
        </Button>
      </div>
    </Card>
  )
}

/**
 * Ready check component
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Progress } from '@/shared/components/Progress'

interface ReadyCheckProps {
  players: Array<{
    id: string
    name: string
    isReady: boolean
  }>
  duration?: number
  onAccept: () => void
  onDecline: () => void
}

/**
 * ReadyCheck utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ReadyCheck.
 */
export function ReadyCheck({ players, duration = 30000, onAccept, onDecline }: ReadyCheckProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 100))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      onDecline()
    }
  }, [timeLeft, onDecline])

  const progress = (timeLeft / duration) * 100
  const readyCount = players.filter(p => p.isReady).length

  return (
    <Card className="border-2 border-purple-500">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="mb-2 text-xl font-bold text-white">Ready Check!</h3>
          <p className="text-gray-400">
            {readyCount}/{players.length} players ready
          </p>
        </div>

        <Progress value={progress} />

        <div className="space-y-1">
          {players.map(player => (
            <div key={player.id} className="flex items-center justify-between text-sm">
              <span className="text-white">{player.name}</span>
              <span className={player.isReady ? 'text-green-500' : 'text-gray-400'}>
                {player.isReady ? '✓ Ready' : 'Waiting...'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={onAccept} variant="default" className="flex-1">
            Accept
          </Button>
          <Button onClick={onDecline} variant="outline" className="flex-1">
            Decline
          </Button>
        </div>
      </div>
    </Card>
  )
}

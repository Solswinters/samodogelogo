/**
 * Replay list component
 */

'use client'

import { useEffect, useState } from 'react'
import { useReplay } from '../hooks/useReplay'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { formatDuration } from '../utils'
import type { ReplayData } from '../types'

interface ReplayListProps {
  onReplaySelect?: (replay: ReplayData) => void
}

/**
 * ReplayList utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ReplayList.
 */
export function ReplayList({ onReplaySelect }: ReplayListProps) {
  const { getAllReplays, loadReplay, deleteReplay } = useReplay()
  const [replays, setReplays] = useState<ReplayData[]>([])

  useEffect(() => {
    setReplays(getAllReplays())
  }, [getAllReplays])

  const handleWatch = (replay: ReplayData) => {
    loadReplay(replay.sessionId)
    onReplaySelect?.(replay)
  }

  const handleDelete = (sessionId: string) => {
    deleteReplay(sessionId)
    setReplays(getAllReplays())
  }

  if (replays.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400">No replays available</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {replays.map((replay) => (
        <Card key={replay.sessionId} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-white">{replay.metadata.mode}</h3>
              <p className="mt-1 text-sm text-gray-400">
                Duration: {formatDuration(Math.floor(replay.duration / 1000))}
              </p>
              <p className="text-xs text-gray-500">
                {replay.metadata.players.map((p) => p.username).join(', ')}
              </p>
              {replay.metadata.winner && (
                <p className="mt-1 text-xs text-green-400">Winner: {replay.metadata.winner}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleWatch(replay)} variant="primary" size="sm">
                Watch
              </Button>
              <Button onClick={() => handleDelete(replay.sessionId)} variant="default" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

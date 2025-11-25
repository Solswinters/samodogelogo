/**
 * Player stats display component
 */

'use client'

import { useEffect } from 'react'
import { useStats } from '../hooks/useStats'
import { Card } from '@/shared/components/Card'
import { Stat } from '@/shared/components/Stat'
import { Progress } from '@/shared/components/Progress'
import { formatDuration } from '../utils'

interface StatsDisplayProps {
  playerId: string
}

/**
 * StatsDisplay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of StatsDisplay.
 */
export function StatsDisplay({ playerId }: StatsDisplayProps) {
  const { stats, fetchStats } = useStats(playerId)

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (!stats) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-400">Loading stats...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Your Statistics</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Games Played" value={stats.gamesPlayed.toString()} />
        <Stat label="Wins" value={stats.wins.toString()} variant="success" />
        <Stat label="Losses" value={stats.losses.toString()} variant="error" />
        <Stat label="Draws" value={stats.draws.toString()} />
        <Stat label="Average Score" value={Math.round(stats.averageScore).toString()} />
        <Stat label="Play Time" value={formatDuration(Math.floor(stats.totalPlayTime / 1000))} />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-400">Win Rate</span>
          <span className="font-semibold text-white">{stats.winRate.toFixed(1)}%</span>
        </div>
        <Progress value={stats.winRate} />
      </div>
    </Card>
  )
}

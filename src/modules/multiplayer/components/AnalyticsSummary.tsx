/**
 * Analytics summary component
 */

'use client'

import { Card } from '@/shared/components/Card'
import { Stat } from '@/shared/components/Stat'
import { useAnalytics } from '../hooks/useAnalytics'

/**
 * AnalyticsSummary utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of AnalyticsSummary.
 */
export function AnalyticsSummary() {
  const { getPlayerStats, getSessionStats } = useAnalytics()

  const playerStats = getPlayerStats()
  const sessionStats = getSessionStats()

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="mb-4 text-lg font-semibold">Player Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Total Games" value={playerStats.totalGames.toString()} />
          <Stat label="Win Rate" value={`${playerStats.winRate}%`} />
          <Stat label="Avg Score" value={playerStats.averageScore.toFixed(0)} />
          <Stat label="Total Time" value={`${Math.floor(playerStats.totalPlayTime / 60)}m`} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Session Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Games" value={sessionStats.gamesPlayed.toString()} />
          <Stat label="Wins" value={sessionStats.wins.toString()} />
          <Stat label="Best Score" value={sessionStats.bestScore.toFixed(0)} />
          <Stat label="Duration" value={`${Math.floor(sessionStats.duration / 60)}m`} />
        </div>
      </Card>
    </div>
  )
}

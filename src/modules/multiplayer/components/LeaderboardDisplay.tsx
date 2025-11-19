/**
 * Leaderboard display component
 */

'use client'

import { useEffect } from 'react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { Card } from '@/shared/components/Card'
import { Tabs } from '@/shared/components/Tabs'
import { Badge } from '@/shared/components/Badge'
import { Skeleton } from '@/shared/components/Skeleton'

export function LeaderboardDisplay() {
  const daily = useLeaderboard('daily')
  const weekly = useLeaderboard('weekly')
  const allTime = useLeaderboard('allTime')

  useEffect(() => {
    void daily.fetchLeaderboard()
    void weekly.fetchLeaderboard()
    void allTime.fetchLeaderboard()
  }, [daily, weekly, allTime])

  const tabs = [
    {
      id: 'daily',
      label: 'Daily',
      content: <LeaderboardTable entries={daily.topPlayers} isLoading={daily.isLoading} />,
    },
    {
      id: 'weekly',
      label: 'Weekly',
      content: <LeaderboardTable entries={weekly.topPlayers} isLoading={weekly.isLoading} />,
    },
    {
      id: 'allTime',
      label: 'All Time',
      content: <LeaderboardTable entries={allTime.topPlayers} isLoading={allTime.isLoading} />,
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Leaderboard</h2>
      <Tabs tabs={tabs} defaultTab="allTime" />
    </Card>
  )
}

function LeaderboardTable({
  entries,
  isLoading,
}: {
  entries: Array<{ rank: number; username: string; score: number; winRate: number }>
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return <p className="py-8 text-center text-gray-400">No entries yet</p>
  }

  return (
    <div className="space-y-2">
      {entries.map(entry => (
        <div
          key={entry.rank}
          className="flex items-center justify-between rounded-lg bg-gray-700/50 p-3"
        >
          <div className="flex items-center gap-3">
            <RankBadge rank={entry.rank} />
            <span className="font-medium text-white">{entry.username}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Score: {entry.score}</span>
            <Badge variant="success">{entry.winRate.toFixed(1)}% WR</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const colors = {
    1: 'bg-yellow-500',
    2: 'bg-gray-400',
    3: 'bg-orange-600',
  }

  const color = colors[rank as keyof typeof colors] ?? 'bg-gray-600'

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full ${color} font-bold text-white`}
    >
      {rank}
    </div>
  )
}

/**
 * Leaderboard view component
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/Button'
import { Tabs } from '@/shared/components/Tabs'
import { LeaderboardEntry, LeaderboardPlayer } from './LeaderboardEntry'

export interface LeaderboardViewProps {
  players: LeaderboardPlayer[]
  currentUserAddress?: string
  onClose: () => void
}

export function LeaderboardView({ players, currentUserAddress, onClose }: LeaderboardViewProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'allTime'>('allTime')

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'allTime', label: 'All Time' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-gray-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="border-b border-gray-700 px-6 py-4">
          <Tabs
            tabs={tabs}
            activeTab={timeframe}
            onChange={id => setTimeframe(id as 'daily' | 'weekly' | 'allTime')}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {players.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No scores yet. Be the first to play!
              </div>
            ) : (
              players.map(player => (
                <LeaderboardEntry
                  key={player.address}
                  player={player}
                  isCurrentUser={player.address === currentUserAddress}
                />
              ))
            )}
          </div>
        </div>

        <div className="border-t border-gray-700 p-6">
          <Button onClick={onClose} variant="default" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

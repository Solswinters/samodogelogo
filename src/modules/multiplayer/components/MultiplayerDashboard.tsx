/**
 * Main multiplayer dashboard component
 */

'use client'

import { useState } from 'react'
import { ConnectionIndicator } from './ConnectionIndicator'
import { OnlinePlayersList } from './OnlinePlayersList'
import { RoomList } from './RoomList'
import { CreateRoomModal } from './CreateRoomModal'
import { Button } from '@/shared/components/Button'
import { Tabs } from '@/shared/components/Tabs'
import { LeaderboardDisplay } from './LeaderboardDisplay'
import { StatsDisplay } from './StatsDisplay'
import { RecoveryBanner } from './RecoveryBanner'

interface MultiplayerDashboardProps {
  playerId: string
  username: string
}

export function MultiplayerDashboard({ playerId, username }: MultiplayerDashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const tabs = [
    {
      id: 'play',
      label: 'Play',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              Create Room
            </Button>
          </div>
          <RoomList onJoinRoom={() => {}} />
        </div>
      ),
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      content: <LeaderboardDisplay />,
    },
    {
      id: 'stats',
      label: 'Statistics',
      content: <StatsDisplay playerId={playerId} />,
    },
  ]

  return (
    <div className="space-y-4">
      <RecoveryBanner />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Multiplayer</h1>
        <ConnectionIndicator />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Tabs tabs={tabs} defaultTab="play" />
        </div>
        <div>
          <OnlinePlayersList playerId={playerId} username={username} />
        </div>
      </div>

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        playerId={playerId}
        username={username}
      />
    </div>
  )
}

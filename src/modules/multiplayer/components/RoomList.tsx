/**
 * Room list component
 */

'use client'

import { useEffect } from 'react'
import { useRoom } from '../hooks/useRoom'
import { Card } from '@/shared/components/Card'
import { Button } from '@/shared/components/Button'
import { Badge } from '@/shared/components/Badge'
import type { Room } from '../services/RoomService'

interface RoomListProps {
  onJoinRoom: (roomId: string) => void
}

/**
 * RoomList utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of RoomList.
 */
export function RoomList({ onJoinRoom }: RoomListProps) {
  const { availableRooms, refreshRoomList } = useRoom()

  useEffect(() => {
    refreshRoomList()
    // Refresh every 5 seconds
    const interval = setInterval(refreshRoomList, 5000)
    return () => clearInterval(interval)
  }, [refreshRoomList])

  if (availableRooms.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-400">No rooms available</p>
        <p className="mt-2 text-sm text-gray-500">Create a room to get started!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {availableRooms.map((room) => (
        <RoomCard key={room.id} room={room} onJoin={() => onJoinRoom(room.id)} />
      ))}
    </div>
  )
}

interface RoomCardProps {
  room: Room
  onJoin: () => void
}

function RoomCard({ room, onJoin }: RoomCardProps) {
  const isFull = room.players.length >= room.maxPlayers
  const hostPlayer = room.players.find((p) => p.isHost)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{room.name}</h3>
            {room.isPrivate && (
              <Badge variant="warning" className="text-xs">
                Private
              </Badge>
            )}
            <Badge variant="default" className="text-xs">
              {room.gameMode}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-400">Host: {hostPlayer?.username ?? 'Unknown'}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>
              Players: {room.players.length}/{room.maxPlayers}
            </span>
            <span>•</span>
            <span className="capitalize">{room.settings.difficulty}</span>
          </div>
        </div>

        <Button onClick={onJoin} disabled={isFull} variant={isFull ? 'default' : 'primary'}>
          {isFull ? 'Full' : 'Join'}
        </Button>
      </div>
    </Card>
  )
}

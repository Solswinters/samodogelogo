/**
 * Room settings component
 */

'use client'

import { useState } from 'react'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import { Switch } from '@/shared/components/Switch'
import { Card } from '@/shared/components/Card'

interface RoomSettingsProps {
  initialSettings?: {
    name: string
    maxPlayers: number
    isPrivate: boolean
    password?: string
  }
  onSave: (settings: {
    name: string
    maxPlayers: number
    isPrivate: boolean
    password?: string
  }) => void
  onCancel: () => void
}

/**
 * RoomSettings utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of RoomSettings.
 */
export function RoomSettings({ initialSettings, onSave, onCancel }: RoomSettingsProps) {
  const [name, setName] = useState(initialSettings?.name || '')
  const [maxPlayers, setMaxPlayers] = useState(initialSettings?.maxPlayers || 4)
  const [isPrivate, setIsPrivate] = useState(initialSettings?.isPrivate || false)
  const [password, setPassword] = useState(initialSettings?.password || '')

  const handleSave = () => {
    onSave({
      name,
      maxPlayers,
      isPrivate,
      password: isPrivate && password ? password : undefined,
    })
  }

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Room Name</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter room name"
            maxLength={50}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Max Players</label>
          <Input
            type="number"
            value={maxPlayers}
            onChange={e => setMaxPlayers(parseInt(e.target.value))}
            min={2}
            max={10}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Private Room</label>
          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
        </div>

        {isPrivate && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              maxLength={50}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} variant="default" className="flex-1">
            Save
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}

/**
 * Create room modal component
 */

'use client'

import { useState } from 'react'
import { Modal } from '@/shared/components/Modal'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import { Switch } from '@/shared/components/Switch'
import { Dropdown } from '@/shared/components/Dropdown'
import { useRoom } from '../hooks/useRoom'
import type { CreateRoomOptions } from '../services/RoomService'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
  playerId: string
  username: string
}

/**
 * CreateRoomModal utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CreateRoomModal.
 */
export function CreateRoomModal({ isOpen, onClose, playerId, username }: CreateRoomModalProps) {
  const { createRoom, isLoading } = useRoom()
  const [roomName, setRoomName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState('4')
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [gameMode, setGameMode] = useState('classic')
  const [difficulty, setDifficulty] = useState('normal')

  const handleCreate = async () => {
    if (!roomName.trim()) return

    const options: CreateRoomOptions = {
      name: roomName,
      maxPlayers: parseInt(maxPlayers),
      isPrivate,
      password: isPrivate ? password : undefined,
      gameMode,
      settings: {
        difficulty,
        allowSpectators: true,
      },
    }

    const room = await createRoom(playerId, username, options)
    if (room) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Room">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-gray-400">Room Name</label>
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">Game Mode</label>
          <Dropdown
            options={[
              { label: 'Classic', value: 'classic' },
              { label: 'Time Attack', value: 'time_attack' },
              { label: 'Survival', value: 'survival' },
            ]}
            value={gameMode}
            onChange={setGameMode}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">Difficulty</label>
          <Dropdown
            options={[
              { label: 'Easy', value: 'easy' },
              { label: 'Normal', value: 'normal' },
              { label: 'Hard', value: 'hard' },
            ]}
            value={difficulty}
            onChange={setDifficulty}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">Max Players</label>
          <Dropdown
            options={[
              { label: '2 Players', value: '2' },
              { label: '4 Players', value: '4' },
              { label: '8 Players', value: '8' },
            ]}
            value={maxPlayers}
            onChange={setMaxPlayers}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">Private Room</label>
          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
        </div>

        {isPrivate && (
          <div>
            <label className="mb-2 block text-sm text-gray-400">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={onClose} variant="default" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="primary"
            className="flex-1"
            disabled={isLoading || !roomName.trim()}
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

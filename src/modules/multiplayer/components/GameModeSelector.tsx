/**
 * Game mode selector component
 */

'use client'

import { useState } from 'react'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'

const GAME_MODES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Standard jump game rules',
    players: '1-4',
  },
  {
    id: 'race',
    name: 'Race',
    description: 'Compete for the fastest time',
    players: '2-4',
  },
  {
    id: 'survival',
    name: 'Survival',
    description: 'Last player standing wins',
    players: '2-10',
  },
  {
    id: 'coop',
    name: 'Co-op',
    description: 'Work together to reach high scores',
    players: '2-4',
  },
]

interface GameModeSelectorProps {
  selectedMode?: string
  onSelect: (modeId: string) => void
}

/**
 * GameModeSelector utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GameModeSelector.
 */
export function GameModeSelector({ selectedMode, onSelect }: GameModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {GAME_MODES.map((mode) => (
        <Card
          key={mode.id}
          className={`cursor-pointer transition-all ${
            selectedMode === mode.id
              ? 'ring-2 ring-purple-500'
              : hoveredMode === mode.id
                ? 'ring-1 ring-gray-600'
                : ''
          }`}
          onClick={() => onSelect(mode.id)}
          onMouseEnter={() => setHoveredMode(mode.id)}
          onMouseLeave={() => setHoveredMode(null)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">{mode.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{mode.description}</p>
            </div>
            <Badge variant="outline">{mode.players}</Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}

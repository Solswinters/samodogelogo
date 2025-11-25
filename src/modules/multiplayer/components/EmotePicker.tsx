/**
 * Emote picker component
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/Button'
import { useEmote } from '../hooks/useEmote'

const EMOTES = [
  { type: 'happy', emoji: '😊' },
  { type: 'fire', emoji: '🔥' },
  { type: 'thumbs_up', emoji: '👍' },
  { type: 'cry', emoji: '😢' },
  { type: 'heart', emoji: '❤️' },
  { type: 'laugh', emoji: '😂' },
  { type: 'cool', emoji: '😎' },
  { type: 'thinking', emoji: '🤔' },
]

interface EmotePickerProps {
  playerId: string
  username: string
}

/**
 * EmotePicker utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of EmotePicker.
 */
export function EmotePicker({ playerId, username }: EmotePickerProps) {
  const { sendEmote } = useEmote()
  const [isOpen, setIsOpen] = useState(false)

  const handleEmoteClick = (type: string, emoji: string) => {
    sendEmote(playerId, username, type, emoji)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} variant="default" size="sm">
        😊
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 rounded-lg bg-gray-800 p-2 shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {EMOTES.map(emote => (
              <button
                key={emote.type}
                onClick={() => handleEmoteClick(emote.type, emote.emoji)}
                className="rounded p-2 text-2xl hover:bg-gray-700"
              >
                {emote.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

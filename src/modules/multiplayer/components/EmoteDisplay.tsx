/**
 * Emote display component
 */

'use client'

import { useEmote } from '../hooks/useEmote'

/**
 * EmoteDisplay utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of EmoteDisplay.
 */
export function EmoteDisplay() {
  const { recentEmotes } = useEmote()

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 space-y-2">
      {recentEmotes.map(emote => (
        <div
          key={emote.id}
          className="animate-fade-in-up rounded-lg bg-gray-800/90 px-4 py-2 backdrop-blur"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emote.emoji}</span>
            <span className="text-sm text-white">{emote.username}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

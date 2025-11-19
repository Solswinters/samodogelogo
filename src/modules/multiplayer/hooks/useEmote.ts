/**
 * Hook for emotes
 */

import { useState, useEffect, useCallback } from 'react'
import { EmoteService, type Emote } from '../services/EmoteService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const emoteService = new EmoteService()

export function useEmote() {
  const { send, on } = useWebSocket()
  const [recentEmotes, setRecentEmotes] = useState<Emote[]>([])

  useEffect(() => {
    const unsubscribe = on('emote', event => {
      const emote = event.data as Emote
      setRecentEmotes(prev => [...prev.slice(-9), emote])
    })

    return unsubscribe
  }, [on])

  const sendEmote = useCallback(
    (playerId: string, username: string, type: string, emoji: string) => {
      const emote = emoteService.sendEmote(playerId, username, type, emoji)
      send('send_emote', emote)
    },
    [send]
  )

  return {
    recentEmotes,
    sendEmote,
  }
}

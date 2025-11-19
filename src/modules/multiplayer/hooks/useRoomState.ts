/**
 * Room state hook
 */

'use client'

import { useState, useEffect } from 'react'
import { RoomState } from '../state/RoomState'

const roomState = new RoomState()

export function useRoomState() {
  const [snapshot, setSnapshot] = useState(roomState.getSnapshot())

  useEffect(() => {
    const update = () => setSnapshot(roomState.getSnapshot())
    const unsubscribe = roomState.subscribe(update)
    return unsubscribe
  }, [])

  return {
    room: snapshot.room,
    players: snapshot.players,
    playerCount: snapshot.playerCount,
    isInRoom: roomState.isInRoom(),
  }
}

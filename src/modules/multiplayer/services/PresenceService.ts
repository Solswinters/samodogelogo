/**
 * Player presence service
 */

export interface PlayerPresence {
  playerId: string
  username: string
  status: PresenceStatus
  lastSeen: number
  currentRoom?: string
  isPlaying: boolean
}

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline'

export class PresenceService {
  private presences = new Map<string, PlayerPresence>()
  private heartbeatInterval = 30000 // 30 seconds
  private offlineThreshold = 60000 // 1 minute

  /**
   * Set player online
   */
  setOnline(playerId: string, username: string): void {
    this.presences.set(playerId, {
      playerId,
      username,
      status: 'online',
      lastSeen: Date.now(),
      isPlaying: false,
    })
  }

  /**
   * Set player offline
   */
  setOffline(playerId: string): void {
    const presence = this.presences.get(playerId)
    if (presence) {
      presence.status = 'offline'
      presence.lastSeen = Date.now()
    }
  }

  /**
   * Update player status
   */
  updateStatus(playerId: string, status: PresenceStatus): void {
    const presence = this.presences.get(playerId)
    if (presence) {
      presence.status = status
      presence.lastSeen = Date.now()
    }
  }

  /**
   * Update player heartbeat
   */
  heartbeat(playerId: string): void {
    const presence = this.presences.get(playerId)
    if (presence) {
      presence.lastSeen = Date.now()
      if (presence.status === 'offline') {
        presence.status = 'online'
      }
    }
  }

  /**
   * Set player in room
   */
  setInRoom(playerId: string, roomId: string): void {
    const presence = this.presences.get(playerId)
    if (presence) {
      presence.currentRoom = roomId
      presence.isPlaying = true
    }
  }

  /**
   * Remove player from room
   */
  removeFromRoom(playerId: string): void {
    const presence = this.presences.get(playerId)
    if (presence) {
      presence.currentRoom = undefined
      presence.isPlaying = false
    }
  }

  /**
   * Get player presence
   */
  getPresence(playerId: string): PlayerPresence | undefined {
    return this.presences.get(playerId)
  }

  /**
   * Get all online players
   */
  getOnlinePlayers(): PlayerPresence[] {
    return Array.from(this.presences.values()).filter(p => p.status !== 'offline')
  }

  /**
   * Get players in room
   */
  getPlayersInRoom(roomId: string): PlayerPresence[] {
    return Array.from(this.presences.values()).filter(p => p.currentRoom === roomId)
  }

  /**
   * Check for stale presences
   */
  checkStalePresences(): string[] {
    const now = Date.now()
    const stalePlayerIds: string[] = []

    this.presences.forEach((presence, playerId) => {
      if (presence.status !== 'offline' && now - presence.lastSeen > this.offlineThreshold) {
        presence.status = 'offline'
        stalePlayerIds.push(playerId)
      }
    })

    return stalePlayerIds
  }

  /**
   * Remove player
   */
  removePlayer(playerId: string): void {
    this.presences.delete(playerId)
  }

  /**
   * Get online count
   */
  getOnlineCount(): number {
    return this.getOnlinePlayers().length
  }
}

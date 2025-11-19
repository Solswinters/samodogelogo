/**
 * Game replay service
 */

import type { ReplayData, GameStateSnapshot, GameEvent, PlayerInfo } from '../types'

export class ReplayService {
  private replays = new Map<string, ReplayData>()
  private maxReplays = 50

  /**
   * Start recording replay
   */
  startRecording(sessionId: string, mode: string, players: PlayerInfo[]): void {
    const replay: ReplayData = {
      sessionId,
      duration: 0,
      snapshots: [],
      events: [],
      metadata: {
        mode,
        players,
      },
    }

    this.replays.set(sessionId, replay)
  }

  /**
   * Add snapshot to replay
   */
  addSnapshot(sessionId: string, snapshot: GameStateSnapshot): void {
    const replay = this.replays.get(sessionId)
    if (replay) {
      replay.snapshots.push(snapshot)
    }
  }

  /**
   * Add event to replay
   */
  addEvent(sessionId: string, event: GameEvent): void {
    const replay = this.replays.get(sessionId)
    if (replay) {
      replay.events.push(event)
    }
  }

  /**
   * Stop recording replay
   */
  stopRecording(sessionId: string, winner?: string): void {
    const replay = this.replays.get(sessionId)
    if (replay && replay.snapshots.length > 0) {
      const firstSnapshot = replay.snapshots[0]
      const lastSnapshot = replay.snapshots[replay.snapshots.length - 1]
      replay.duration = lastSnapshot.timestamp - firstSnapshot.timestamp
      replay.metadata.winner = winner

      // Keep only last N replays
      if (this.replays.size > this.maxReplays) {
        const oldestKey = Array.from(this.replays.keys())[0]
        this.replays.delete(oldestKey)
      }
    }
  }

  /**
   * Get replay
   */
  getReplay(sessionId: string): ReplayData | undefined {
    return this.replays.get(sessionId)
  }

  /**
   * Get all replays
   */
  getAllReplays(): ReplayData[] {
    return Array.from(this.replays.values()).sort((a, b) => {
      const aTime = a.snapshots[0]?.timestamp ?? 0
      const bTime = b.snapshots[0]?.timestamp ?? 0
      return bTime - aTime
    })
  }

  /**
   * Delete replay
   */
  deleteReplay(sessionId: string): void {
    this.replays.delete(sessionId)
  }

  /**
   * Get replay at time
   */
  getSnapshotAtTime(sessionId: string, time: number): GameStateSnapshot | null {
    const replay = this.replays.get(sessionId)
    if (!replay || replay.snapshots.length === 0) return null

    // Find closest snapshot
    let closestSnapshot = replay.snapshots[0]
    let closestDiff = Math.abs(closestSnapshot.timestamp - time)

    for (const snapshot of replay.snapshots) {
      const diff = Math.abs(snapshot.timestamp - time)
      if (diff < closestDiff) {
        closestSnapshot = snapshot
        closestDiff = diff
      }
    }

    return closestSnapshot
  }
}

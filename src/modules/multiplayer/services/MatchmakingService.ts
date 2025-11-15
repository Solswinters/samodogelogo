/**
 * Room matchmaking system
 */

import { IService } from "@/common/interfaces";
import { Room } from "./RoomService";

export interface MatchmakingCriteria {
  skillLevel?: number;
  region?: string;
  maxPlayers?: number;
  gameMode?: string;
}

export class MatchmakingService implements IService {
  public readonly serviceName = "MatchmakingService";
  private queue: Map<string, { playerId: string; criteria: MatchmakingCriteria; joinedAt: number }> =
    new Map();

  /**
   * Add player to matchmaking queue
   */
  joinQueue(playerId: string, criteria: MatchmakingCriteria = {}): void {
    this.queue.set(playerId, {
      playerId,
      criteria,
      joinedAt: Date.now(),
    });
  }

  /**
   * Remove player from queue
   */
  leaveQueue(playerId: string): void {
    this.queue.delete(playerId);
  }

  /**
   * Find match for player
   */
  findMatch(rooms: Room[], playerId: string): Room | null {
    const player = this.queue.get(playerId);
    if (!player) return null;

    // Find suitable room
    const suitableRoom = rooms.find((room) => {
      if (room.status !== "waiting") return false;
      if (room.players.length >= room.maxPlayers) return false;

      // Check criteria matching
      if (player.criteria.maxPlayers && room.maxPlayers !== player.criteria.maxPlayers) {
        return false;
      }

      return true;
    });

    return suitableRoom ?? null;
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.size;
  }

  /**
   * Get average wait time
   */
  getAverageWaitTime(): number {
    if (this.queue.size === 0) return 0;

    const now = Date.now();
    let totalWaitTime = 0;

    this.queue.forEach((player) => {
      totalWaitTime += now - player.joinedAt;
    });

    return totalWaitTime / this.queue.size;
  }

  destroy(): void {
    this.queue.clear();
  }
}


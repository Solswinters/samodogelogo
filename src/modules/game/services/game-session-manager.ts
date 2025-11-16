/**
 * Game session management service
 */

import { v4 as uuidv4 } from 'uuid'
import type { GameSession, PlayerScore } from '@/types/game'
import { logger } from '@/utils/logger'

class GameSessionManager {
  private activeSessions: Map<string, GameSession> = new Map()
  private playerSessions: Map<string, string> = new Map() // playerId -> sessionId

  createSession(hostId: string, playerIds: string[], difficulty: number = 1): GameSession {
    const sessionId = uuidv4()
    const newSession: GameSession = {
      id: sessionId,
      players: playerIds,
      hostId,
      startTime: Date.now(),
      endTime: null,
      scores: [],
      status: 'waiting',
      difficulty,
    }

    this.activeSessions.set(sessionId, newSession)
    playerIds.forEach(playerId => {
      this.playerSessions.set(playerId, sessionId)
    })

    logger.info(`Game session created: ${sessionId} with host: ${hostId}`)
    return newSession
  }

  getSession(sessionId: string): GameSession | undefined {
    return this.activeSessions.get(sessionId)
  }

  getPlayerSession(playerId: string): GameSession | undefined {
    const sessionId = this.playerSessions.get(playerId)
    if (!sessionId) {return undefined}
    return this.activeSessions.get(sessionId)
  }

  startSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId)
    if (session?.status !== 'waiting') {
      logger.warn(`Cannot start session ${sessionId}. Status: ${session?.status}`)
      return false
    }

    session.status = 'playing'
    session.startTime = Date.now()
    logger.info(`Game session started: ${sessionId}`)
    return true
  }

  pauseSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId)
    if (session?.status !== 'playing') {
      logger.warn(`Cannot pause session ${sessionId}. Status: ${session?.status}`)
      return false
    }

    session.status = 'paused'
    logger.info(`Game session paused: ${sessionId}`)
    return true
  }

  resumeSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId)
    if (session?.status !== 'paused') {
      logger.warn(`Cannot resume session ${sessionId}. Status: ${session?.status}`)
      return false
    }

    session.status = 'playing'
    logger.info(`Game session resumed: ${sessionId}`)
    return true
  }

  endSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      logger.warn(`Cannot end non-existent session ${sessionId}`)
      return false
    }

    session.status = 'ended'
    session.endTime = Date.now()

    // Remove player mappings
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    session.players.forEach(playerId => {
      this.playerSessions.delete(playerId)
    })

    logger.info(`Game session ended: ${sessionId}`)
    return true
  }

  submitScore(sessionId: string, playerId: string, score: number): boolean {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      logger.warn(`Cannot submit score to non-existent session ${sessionId}`)
      return false
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (!session.players.includes(playerId)) {
      logger.warn(`Player ${playerId} is not part of session ${sessionId}`)
      return false
    }

    const scoreEntry: PlayerScore = {
      playerId,
      score,
      timestamp: Date.now(),
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    session.scores.push(scoreEntry)
    logger.info(`Score submitted for player ${playerId} in session ${sessionId}: ${score}`)
    return true
  }

  getSessionScores(sessionId: string): PlayerScore[] {
    const session = this.activeSessions.get(sessionId)
    if (!session) {return []}

    // Sort scores descending
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return [...session.scores].sort((a, b) => b.score - a.score)
  }

  getPlayerScore(sessionId: string, playerId: string): PlayerScore | undefined {
    const session = this.activeSessions.get(sessionId)
    if (!session) {return undefined}

    // Get the highest score for this player in this session
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const playerScores = session.scores.filter(s => s.playerId === playerId)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (playerScores.length === 0) {return undefined}

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return playerScores.reduce((prev, current) => (prev.score > current.score ? prev : current))
  }

  getWinner(sessionId: string): PlayerScore | undefined {
    const scores = this.getSessionScores(sessionId)
    return scores[0]
  }

  cleanupSession(sessionId: string): void {
    const session = this.activeSessions.get(sessionId)
    if (session) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      session.players.forEach(playerId => {
        this.playerSessions.delete(playerId)
      })
    }
    this.activeSessions.delete(sessionId)
    logger.info(`Game session cleaned up: ${sessionId}`)
  }

  cleanupOldSessions(maxAge: number = 3600000): number {
    const now = Date.now()
    let cleaned = 0

    const sessions = Array.from(this.activeSessions.entries())
    for (const [sessionId, session] of sessions) {
      if (session.endTime && now - session.endTime > maxAge) {
        this.cleanupSession(sessionId)
        cleaned++
      }
    }

    logger.info(`Cleaned up ${cleaned} old sessions`)
    return cleaned
  }

  getAllActiveSessions(): GameSession[] {
    return Array.from(this.activeSessions.values()).filter(s => s.status !== 'ended')
  }

  getSessionCount(): number {
    return this.activeSessions.size
  }
}

export const gameSessionManager = new GameSessionManager()

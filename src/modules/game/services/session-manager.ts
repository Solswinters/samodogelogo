/**
 * Game session management service
 */

import type { GameSession } from '@/types/game'

class SessionManager {
  private sessions: Map<string, GameSession> = new Map()
  private currentSessionId: string | null = null

  createSession(mode: 'single' | 'multi'): GameSession {
    const session: GameSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mode,
      startTime: Date.now(),
      score: 0,
      duration: 0,
      obstaclesCleared: 0,
    }

    this.sessions.set(session.id, session)
    this.currentSessionId = session.id
    return session
  }

  getCurrentSession(): GameSession | null {
    return this.currentSessionId ? (this.sessions.get(this.currentSessionId) ?? null) : null
  }

  updateSession(updates: Partial<Omit<GameSession, 'id' | 'mode' | 'startTime'>>): void {
    if (!this.currentSessionId) {
      return
    }

    const session = this.sessions.get(this.currentSessionId)
    if (session) {
      Object.assign(session, updates)
      this.sessions.set(this.currentSessionId, session)
    }
  }

  endSession(): GameSession | null {
    if (!this.currentSessionId) {
      return null
    }

    const session = this.sessions.get(this.currentSessionId)
    if (session && !session.endTime) {
      session.endTime = Date.now()
      session.duration = session.endTime - session.startTime
      this.sessions.set(this.currentSessionId, session)
    }

    this.currentSessionId = null
    return session ?? null
  }

  getSession(id: string): GameSession | null {
    return this.sessions.get(id) ?? null
  }

  getAllSessions(): GameSession[] {
    return Array.from(this.sessions.values())
  }

  getRecentSessions(count: number = 10): GameSession[] {
    return this.getAllSessions()
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, count)
  }

  clearSessions(): void {
    this.sessions.clear()
    this.currentSessionId = null
  }

  getSessionStats(): {
    totalSessions: number
    averageScore: number
    averageDuration: number
    bestScore: number
  } {
    const sessions = this.getAllSessions()

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        averageDuration: 0,
        bestScore: 0,
      }
    }

    const totalScore = sessions.reduce((sum, s) => sum + s.score, 0)
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
    const bestScore = Math.max(...sessions.map((s) => s.score))

    return {
      totalSessions: sessions.length,
      averageScore: totalScore / sessions.length,
      averageDuration: totalDuration / sessions.length,
      bestScore,
    }
  }
}

/**
 * sessionManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sessionManager.
 */
export const sessionManager = new SessionManager()

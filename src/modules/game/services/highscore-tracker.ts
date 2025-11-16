/**
 * High score tracking service
 */

import { storage, STORAGE_KEYS } from '@/utils/storage'

export interface HighScore {
  score: number
  date: number
  mode: 'single' | 'multi'
}

class HighScoreTracker {
  private readonly MAX_SCORES = 10

  getHighScores(mode?: 'single' | 'multi'): HighScore[] {
    const scores = storage.get<HighScore[]>(STORAGE_KEYS.HIGH_SCORES, [])

    if (mode) {
      return scores.filter(s => s.mode === mode)
    }

    return scores
  }

  addScore(score: number, mode: 'single' | 'multi'): boolean {
    const scores = this.getHighScores()
    const modeScores = scores.filter(s => s.mode === mode)

    // Check if this is a new high score
    const isHighScore =
      modeScores.length < this.MAX_SCORES || score > Math.min(...modeScores.map(s => s.score))

    if (!isHighScore) {
      return false
    }

    // Add new score
    const newScore: HighScore = {
      score,
      date: Date.now(),
      mode,
    }

    scores.push(newScore)

    // Sort by score descending
    const sorted = scores.sort((a, b) => b.score - a.score)

    // Keep only top scores per mode
    const singleScores = sorted.filter(s => s.mode === 'single').slice(0, this.MAX_SCORES)
    const multiScores = sorted.filter(s => s.mode === 'multi').slice(0, this.MAX_SCORES)

    const finalScores = [...singleScores, ...multiScores]
    storage.set(STORAGE_KEYS.HIGH_SCORES, finalScores)

    return true
  }

  getHighestScore(mode?: 'single' | 'multi'): number {
    const scores = this.getHighScores(mode)

    if (scores.length === 0) {
      return 0
    }

    return Math.max(...scores.map(s => s.score))
  }

  getRank(score: number, mode: 'single' | 'multi'): number {
    const scores = this.getHighScores(mode)
    const sortedScores = scores.map(s => s.score).sort((a, b) => b - a)

    const rank = sortedScores.findIndex(s => score >= s)

    if (rank === -1) {
      return sortedScores.length + 1
    }

    return rank + 1
  }

  isNewRecord(score: number, mode: 'single' | 'multi'): boolean {
    return score > this.getHighestScore(mode)
  }

  clearScores(mode?: 'single' | 'multi'): void {
    if (mode) {
      const scores = this.getHighScores()
      const filtered = scores.filter(s => s.mode !== mode)
      storage.set(STORAGE_KEYS.HIGH_SCORES, filtered)
    } else {
      storage.remove(STORAGE_KEYS.HIGH_SCORES)
    }
  }

  exportScores(): string {
    const scores = this.getHighScores()
    return JSON.stringify(scores, null, 2)
  }

  importScores(data: string): boolean {
    try {
      const scores = JSON.parse(data) as HighScore[]

      // Validate data
      if (!Array.isArray(scores)) {
        return false
      }

      for (const score of scores) {
        if (typeof score.score !== 'number' || typeof score.date !== 'number') {
          return false
        }
      }

      storage.set(STORAGE_KEYS.HIGH_SCORES, scores)
      return true
    } catch {
      return false
    }
  }
}

export const highScoreTracker = new HighScoreTracker()

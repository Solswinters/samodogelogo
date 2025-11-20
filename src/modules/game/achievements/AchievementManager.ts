/**
 * Achievement tracking and unlocking with persistence and statistics
 */

import type { Achievement, AchievementTrigger } from './types'

export interface AchievementStats {
  totalAchievements: number
  unlockedCount: number
  percentComplete: number
  recentUnlocks: Achievement[]
  categoryCounts: Record<string, { total: number; unlocked: number }>
}

export class AchievementManager {
  private achievements: Map<string, Achievement> = new Map()
  private callbacks: Set<(achievement: Achievement) => void> = new Set()
  private storageKey = 'game-achievements'
  private isInitialized = false

  initialize(): void {
    if (this.isInitialized) {
      return
    }

    this.loadFromStorage()

    const defaultAchievements: Achievement[] = [
      {
        id: 'first-jump',
        name: 'First Jump',
        description: 'Jump for the first time',
        icon: '🦘',
        unlocked: false,
        progress: 0,
        target: 1,
        category: 'special',
      },
      {
        id: 'score-100',
        name: 'Century',
        description: 'Score 100 points',
        icon: '💯',
        unlocked: false,
        progress: 0,
        target: 100,
        category: 'score',
      },
      {
        id: 'score-500',
        name: 'High Flyer',
        description: 'Score 500 points',
        icon: '🚀',
        unlocked: false,
        progress: 0,
        target: 500,
        category: 'score',
      },
      {
        id: 'combo-10',
        name: 'Combo Master',
        description: 'Reach a 10x combo',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        target: 10,
        category: 'combo',
      },
      {
        id: 'survive-60',
        name: 'Survivor',
        description: 'Survive for 60 seconds',
        icon: '⏱️',
        unlocked: false,
        progress: 0,
        target: 60,
        category: 'time',
      },
    ]

    defaultAchievements.forEach((achievement) => {
      // Only add if not already loaded from storage
      if (!this.achievements.has(achievement.id)) {
        this.achievements.set(achievement.id, achievement)
      }
    })

    this.isInitialized = true
    this.saveToStorage()
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      return
    }

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const data = JSON.parse(stored) as Achievement[]
        data.forEach((achievement) => {
          this.achievements.set(achievement.id, achievement)
        })
      }
    } catch (error) {
      console.warn('Failed to load achievements from storage:', error)
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') {
      return
    }

    try {
      const data = Array.from(this.achievements.values())
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save achievements to storage:', error)
    }
  }

  trigger(trigger: AchievementTrigger): void {
    for (const achievement of this.achievements.values()) {
      if (achievement.unlocked) {
        continue
      }

      let shouldUpdate = false

      switch (trigger.type) {
        case 'score':
          if (achievement.category === 'score') {
            achievement.progress = trigger.value
            shouldUpdate = true
          }
          break
        case 'combo':
          if (achievement.category === 'combo') {
            achievement.progress = Math.max(achievement.progress, trigger.value)
            shouldUpdate = true
          }
          break
        case 'time':
          if (achievement.category === 'time') {
            achievement.progress = trigger.value
            shouldUpdate = true
          }
          break
        case 'obstacles':
          if (achievement.category === 'obstacles') {
            achievement.progress += trigger.value
            shouldUpdate = true
          }
          break
        case 'special':
          if (achievement.id === trigger.id) {
            achievement.progress += 1
            shouldUpdate = true
          }
          break
      }

      if (shouldUpdate) {
        this.saveToStorage()

        if (achievement.progress >= achievement.target) {
          this.unlock(achievement.id)
        }
      }
    }
  }

  unlock(achievementId: string): boolean {
    const achievement = this.achievements.get(achievementId)

    if (!achievement || achievement.unlocked) {
      return false
    }

    achievement.unlocked = true
    achievement.unlockedAt = Date.now()

    this.saveToStorage()
    this.callbacks.forEach((cb) => cb(achievement))

    return true
  }

  getAll(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  getUnlocked(): Achievement[] {
    return this.getAll().filter((a) => a.unlocked)
  }

  getProgress(achievementId: string): number {
    const achievement = this.achievements.get(achievementId)
    if (!achievement) {
      return 0
    }
    return achievement.progress / achievement.target
  }

  onUnlock(callback: (achievement: Achievement) => void): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  getStats(): AchievementStats {
    const all = this.getAll()
    const unlocked = this.getUnlocked()

    const categoryCounts: Record<string, { total: number; unlocked: number }> = {}

    all.forEach((achievement) => {
      const category = achievement.category
      if (!categoryCounts[category]) {
        categoryCounts[category] = { total: 0, unlocked: 0 }
      }
      categoryCounts[category].total++
      if (achievement.unlocked) {
        categoryCounts[category].unlocked++
      }
    })

    const recentUnlocks = unlocked
      .filter((a) => a.unlockedAt)
      .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
      .slice(0, 5)

    return {
      totalAchievements: all.length,
      unlockedCount: unlocked.length,
      percentComplete: all.length > 0 ? (unlocked.length / all.length) * 100 : 0,
      recentUnlocks,
      categoryCounts,
    }
  }

  getByCategory(category: string): Achievement[] {
    return this.getAll().filter((a) => a.category === category)
  }

  getById(id: string): Achievement | undefined {
    return this.achievements.get(id)
  }

  isUnlocked(id: string): boolean {
    const achievement = this.achievements.get(id)
    return achievement?.unlocked ?? false
  }

  resetProgress(id?: string): void {
    if (id) {
      const achievement = this.achievements.get(id)
      if (achievement) {
        achievement.progress = 0
        achievement.unlocked = false
        achievement.unlockedAt = undefined
      }
    } else {
      // Reset all
      this.achievements.forEach((achievement) => {
        achievement.progress = 0
        achievement.unlocked = false
        achievement.unlockedAt = undefined
      })
    }

    this.saveToStorage()
  }

  export(): string {
    return JSON.stringify(Array.from(this.achievements.values()))
  }

  import(data: string): boolean {
    try {
      const achievements = JSON.parse(data) as Achievement[]
      achievements.forEach((achievement) => {
        this.achievements.set(achievement.id, achievement)
      })
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Failed to import achievements:', error)
      return false
    }
  }

  cleanup(): void {
    this.callbacks.clear()
    this.isInitialized = false
  }
}

export const achievementManager = new AchievementManager()

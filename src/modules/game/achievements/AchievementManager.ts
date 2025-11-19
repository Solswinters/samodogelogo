/**
 * Achievement tracking and unlocking
 */

import type { Achievement, AchievementTrigger } from './types'

export class AchievementManager {
  private achievements: Map<string, Achievement> = new Map()
  private callbacks: Set<(achievement: Achievement) => void> = new Set()

  initialize(): void {
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

    defaultAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement)
    })
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

      if (shouldUpdate && achievement.progress >= achievement.target) {
        this.unlock(achievement.id)
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

    this.callbacks.forEach(cb => cb(achievement))
    return true
  }

  getAll(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  getUnlocked(): Achievement[] {
    return this.getAll().filter(a => a.unlocked)
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
}

export const achievementManager = new AchievementManager()

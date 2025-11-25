/**
 * Achievement tracking system
 */

import type { Achievement } from '@/types/game'
import { ACHIEVEMENT_IDS, ACHIEVEMENT_NAMES } from '@/constants/game'
import { storage } from '@/utils/storage'
import { logger } from '@/utils/logger'

const STORAGE_KEY = 'achievements'

class AchievementTracker {
  private achievements: Map<string, Achievement> = new Map()

  constructor() {
    this.loadAchievements()
    this.initializeAchievements()
  }

  private initializeAchievements(): void {
    Object.values(ACHIEVEMENT_IDS).forEach((id) => {
      if (!this.achievements.has(id)) {
        this.achievements.set(id, {
          id,
          name: ACHIEVEMENT_NAMES[id] || id,
          description: this.getAchievementDescription(id),
          icon: '🏆',
          progress: 0,
          maxProgress: this.getAchievementMaxProgress(id),
        })
      }
    })
  }

  private getAchievementDescription(id: string): string {
    const descriptions: Record<string, string> = {
      [ACHIEVEMENT_IDS.FIRST_GAME]: 'Complete your first game',
      [ACHIEVEMENT_IDS.SCORE_1000]: 'Reach a score of 1,000',
      [ACHIEVEMENT_IDS.SCORE_5000]: 'Reach a score of 5,000',
      [ACHIEVEMENT_IDS.SCORE_10000]: 'Reach a score of 10,000',
      [ACHIEVEMENT_IDS.WIN_10_GAMES]: 'Win 10 games',
      [ACHIEVEMENT_IDS.WIN_50_GAMES]: 'Win 50 games',
      [ACHIEVEMENT_IDS.PLAY_100_GAMES]: 'Play 100 games',
      [ACHIEVEMENT_IDS.PERFECT_RUN]: 'Complete a game without taking damage',
      [ACHIEVEMENT_IDS.SPEEDRUNNER]: 'Complete a game in under 2 minutes',
      [ACHIEVEMENT_IDS.COLLECTOR]: 'Collect 1,000 tokens',
    }
    return descriptions[id] || 'Unknown achievement'
  }

  private getAchievementMaxProgress(id: string): number {
    const maxProgress: Record<string, number> = {
      [ACHIEVEMENT_IDS.FIRST_GAME]: 1,
      [ACHIEVEMENT_IDS.SCORE_1000]: 1000,
      [ACHIEVEMENT_IDS.SCORE_5000]: 5000,
      [ACHIEVEMENT_IDS.SCORE_10000]: 10000,
      [ACHIEVEMENT_IDS.WIN_10_GAMES]: 10,
      [ACHIEVEMENT_IDS.WIN_50_GAMES]: 50,
      [ACHIEVEMENT_IDS.PLAY_100_GAMES]: 100,
      [ACHIEVEMENT_IDS.PERFECT_RUN]: 1,
      [ACHIEVEMENT_IDS.SPEEDRUNNER]: 1,
      [ACHIEVEMENT_IDS.COLLECTOR]: 1000,
    }
    return maxProgress[id] || 1
  }

  private loadAchievements(): void {
    try {
      const saved = storage.get<Achievement[]>(STORAGE_KEY, [])
      if (saved) {
        saved.forEach((achievement) => {
          this.achievements.set(achievement.id, achievement)
        })
        logger.info(`Loaded ${saved.length} achievements from storage`)
      }
    } catch (error) {
      logger.error('Failed to load achievements', error)
    }
  }

  private saveAchievements(): void {
    try {
      const achievements = Array.from(this.achievements.values())
      storage.set(STORAGE_KEY, achievements)
      logger.debug('Achievements saved')
    } catch (error) {
      logger.error('Failed to save achievements', error)
    }
  }

  updateProgress(id: string, progress: number): boolean {
    const achievement = this.achievements.get(id)
    if (!achievement) {
      logger.warn(`Achievement not found: ${id}`)
      return false
    }

    if (achievement.unlockedAt) {
      return false // Already unlocked
    }

    achievement.progress = Math.min(progress, achievement.maxProgress)

    if (achievement.progress >= achievement.maxProgress) {
      this.unlockAchievement(id)
      return true
    }

    this.saveAchievements()
    return false
  }

  incrementProgress(id: string, amount: number = 1): boolean {
    const achievement = this.achievements.get(id)
    if (!achievement || achievement.unlockedAt) {
      return false
    }

    return this.updateProgress(id, achievement.progress + amount)
  }

  unlockAchievement(id: string): void {
    const achievement = this.achievements.get(id)
    if (!achievement || achievement.unlockedAt) {
      return
    }

    achievement.unlockedAt = Date.now()
    achievement.progress = achievement.maxProgress
    this.saveAchievements()

    logger.info(`Achievement unlocked: ${achievement.name}`)

    // You could emit an event here for UI notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('achievement-unlocked', {
          detail: { achievement },
        })
      )
    }
  }

  isUnlocked(id: string): boolean {
    const achievement = this.achievements.get(id)
    return achievement?.unlockedAt !== undefined
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id)
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter((a) => a.unlockedAt)
  }

  getLockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter((a) => !a.unlockedAt)
  }

  getUnlockedCount(): number {
    return this.getUnlockedAchievements().length
  }

  getTotalCount(): number {
    return this.achievements.size
  }

  getCompletionPercentage(): number {
    if (this.achievements.size === 0) {
      return 0
    }
    return (this.getUnlockedCount() / this.getTotalCount()) * 100
  }

  reset(): void {
    this.achievements.clear()
    this.initializeAchievements()
    this.saveAchievements()
    logger.info('Achievements reset')
  }

  // Game event handlers
  onGameComplete(score: number, timeTaken: number, damageTaken: number): void {
    this.incrementProgress(ACHIEVEMENT_IDS.FIRST_GAME)
    this.incrementProgress(ACHIEVEMENT_IDS.PLAY_100_GAMES)

    // Score achievements
    if (score >= 1000) {
      this.unlockAchievement(ACHIEVEMENT_IDS.SCORE_1000)
    }
    if (score >= 5000) {
      this.unlockAchievement(ACHIEVEMENT_IDS.SCORE_5000)
    }
    if (score >= 10000) {
      this.unlockAchievement(ACHIEVEMENT_IDS.SCORE_10000)
    }

    // Perfect run
    if (damageTaken === 0) {
      this.unlockAchievement(ACHIEVEMENT_IDS.PERFECT_RUN)
    }

    // Speedrunner
    if (timeTaken < 120000) {
      this.unlockAchievement(ACHIEVEMENT_IDS.SPEEDRUNNER)
    }
  }

  onGameWin(): void {
    this.incrementProgress(ACHIEVEMENT_IDS.WIN_10_GAMES)
    this.incrementProgress(ACHIEVEMENT_IDS.WIN_50_GAMES)
  }

  onTokensCollected(total: number): void {
    this.updateProgress(ACHIEVEMENT_IDS.COLLECTOR, total)
  }
}

/**
 * achievementTracker utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of achievementTracker.
 */
export const achievementTracker = new AchievementTracker()

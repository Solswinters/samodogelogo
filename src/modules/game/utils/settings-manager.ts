/**
 * Game settings management
 */

import type { GameSettings } from '@/types/game'
import { storage } from '@/utils/storage'
import { logger } from '@/utils/logger'
import { soundManager } from './sound-manager'

const STORAGE_KEY = 'game-settings'

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicVolume: 0.5,
  sfxVolume: 0.7,
  showFPS: false,
  difficulty: 'normal',
}

class SettingsManager {
  private settings: GameSettings

  constructor() {
    this.settings = this.loadSettings()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.applySettings()
  }

  private loadSettings(): GameSettings {
    try {
      const saved = storage.get<GameSettings>(STORAGE_KEY)
      if (saved) {
        logger.info('Loaded settings from storage')
        return { ...DEFAULT_SETTINGS, ...saved }
      }
    } catch (error) {
      logger.error('Failed to load settings', error)
    }
    return { ...DEFAULT_SETTINGS }
  }

  private saveSettings(): void {
    try {
      storage.set(STORAGE_KEY, this.settings)
      logger.debug('Settings saved')
    } catch (error) {
      logger.error('Failed to save settings', error)
    }
  }

  private applySettings(): void {
    // Apply sound settings
    if (!this.settings.soundEnabled) {
      soundManager.mute()
    } else {
      soundManager.unmute()
      soundManager.setMasterVolume(this.settings.musicVolume)
    }
  }

  getSettings(): GameSettings {
    return { ...this.settings }
  }

  updateSettings(newSettings: Partial<GameSettings>): void {
    this.settings = {
      ...this.settings,
      ...newSettings,
    }
    this.saveSettings()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.applySettings()
    logger.info('Settings updated', newSettings)
  }

  toggleSound(): void {
    this.updateSettings({ soundEnabled: !this.settings.soundEnabled })
  }

  setMusicVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    this.updateSettings({ musicVolume: clampedVolume })
  }

  setSFXVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    this.updateSettings({ sfxVolume: clampedVolume })
  }

  toggleFPS(): void {
    this.updateSettings({ showFPS: !this.settings.showFPS })
  }

  setDifficulty(difficulty: 'easy' | 'normal' | 'hard'): void {
    this.updateSettings({ difficulty })
  }

  isSoundEnabled(): boolean {
    return this.settings.soundEnabled
  }

  getMusicVolume(): number {
    return this.settings.musicVolume
  }

  getSFXVolume(): number {
    return this.settings.sfxVolume
  }

  shouldShowFPS(): boolean {
    return this.settings.showFPS
  }

  getDifficulty(): 'easy' | 'normal' | 'hard' {
    return this.settings.difficulty
  }

  getDifficultyMultiplier(): number {
    const multipliers = {
      easy: 0.7,
      normal: 1.0,
      hard: 1.5,
    }
    return multipliers[this.settings.difficulty]
  }

  reset(): void {
    this.settings = { ...DEFAULT_SETTINGS }
    this.saveSettings()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.applySettings()
    logger.info('Settings reset to defaults')
  }
}

export const settingsManager = new SettingsManager()

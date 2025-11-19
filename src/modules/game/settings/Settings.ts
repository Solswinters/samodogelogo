/**
 * Game settings management
 */

export interface GameSettings {
  sound: {
    enabled: boolean
    volume: number
  }
  music: {
    enabled: boolean
    volume: number
  }
  graphics: {
    quality: 'low' | 'medium' | 'high'
    particles: boolean
    shadows: boolean
    effects: boolean
  }
  gameplay: {
    difficulty: 'easy' | 'normal' | 'hard' | 'expert'
    showFPS: boolean
    showHitboxes: boolean
  }
  controls: {
    jumpKey: string
    pauseKey: string
    touchEnabled: boolean
  }
}

export class SettingsManager {
  private settings: GameSettings

  constructor() {
    this.settings = this.getDefaultSettings()
  }

  private getDefaultSettings(): GameSettings {
    return {
      sound: {
        enabled: true,
        volume: 0.7,
      },
      music: {
        enabled: true,
        volume: 0.5,
      },
      graphics: {
        quality: 'high',
        particles: true,
        shadows: true,
        effects: true,
      },
      gameplay: {
        difficulty: 'normal',
        showFPS: false,
        showHitboxes: false,
      },
      controls: {
        jumpKey: 'Space',
        pauseKey: 'Escape',
        touchEnabled: true,
      },
    }
  }

  getSettings(): GameSettings {
    return { ...this.settings }
  }

  updateSettings(updates: Partial<GameSettings>): void {
    this.settings = {
      ...this.settings,
      ...updates,
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.settings.sound.enabled = enabled
  }

  setSoundVolume(volume: number): void {
    this.settings.sound.volume = Math.max(0, Math.min(1, volume))
  }

  setMusicEnabled(enabled: boolean): void {
    this.settings.music.enabled = enabled
  }

  setMusicVolume(volume: number): void {
    this.settings.music.volume = Math.max(0, Math.min(1, volume))
  }

  setGraphicsQuality(quality: 'low' | 'medium' | 'high'): void {
    this.settings.graphics.quality = quality

    // Auto-adjust settings based on quality
    switch (quality) {
      case 'low':
        this.settings.graphics.particles = false
        this.settings.graphics.shadows = false
        this.settings.graphics.effects = false
        break
      case 'medium':
        this.settings.graphics.particles = true
        this.settings.graphics.shadows = false
        this.settings.graphics.effects = true
        break
      case 'high':
        this.settings.graphics.particles = true
        this.settings.graphics.shadows = true
        this.settings.graphics.effects = true
        break
    }
  }

  setDifficulty(difficulty: 'easy' | 'normal' | 'hard' | 'expert'): void {
    this.settings.gameplay.difficulty = difficulty
  }

  reset(): void {
    this.settings = this.getDefaultSettings()
  }
}

export const settingsManager = new SettingsManager()

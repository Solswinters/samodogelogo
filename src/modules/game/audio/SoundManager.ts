/**
 * Audio management system
 */

export type SoundEffect = 'jump' | 'land' | 'collision' | 'powerup' | 'score' | 'game-over'
export type Music = 'menu' | 'gameplay' | 'victory'

export class SoundManager {
  private sounds: Map<SoundEffect, HTMLAudioElement> = new Map()
  private music: Map<Music, HTMLAudioElement> = new Map()
  private currentMusic: HTMLAudioElement | null = null
  private soundEnabled: boolean = true
  private musicEnabled: boolean = true
  private soundVolume: number = 0.7
  private musicVolume: number = 0.5

  initialize(): void {
    // Sound effects would be loaded here
    // For now, using Web Audio API placeholders
  }

  playSound(effect: SoundEffect): void {
    if (!this.soundEnabled) {
      return
    }

    const sound = this.sounds.get(effect)
    if (sound) {
      sound.currentTime = 0
      sound.volume = this.soundVolume
      sound.play().catch(() => {
        // Ignore autoplay errors
      })
    }
  }

  playMusic(track: Music, loop: boolean = true): void {
    if (!this.musicEnabled) {
      return
    }

    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
    }

    const music = this.music.get(track)
    if (music) {
      music.loop = loop
      music.volume = this.musicVolume
      music.play().catch(() => {
        // Ignore autoplay errors
      })
      this.currentMusic = music
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
      this.currentMusic = null
    }
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled
    if (!enabled && this.currentMusic) {
      this.currentMusic.pause()
    } else if (enabled && this.currentMusic) {
      this.currentMusic.play().catch(() => {})
    }
  }

  setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume))
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume
    }
  }

  cleanup(): void {
    this.stopMusic()
    this.sounds.clear()
    this.music.clear()
  }
}

export const soundManager = new SoundManager()

/**
 * Sound Manager for audio playback
 */

export interface SoundConfig {
  volume: number
  loop: boolean
  rate: number
}

export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private masterVolume = 1
  private muted = false

  preload(id: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.src = src
      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(id, audio)
        resolve()
      })
      audio.addEventListener('error', reject)
      audio.load()
    })
  }

  play(id: string, options: Partial<SoundConfig> = {}): HTMLAudioElement | undefined {
    const sound = this.sounds.get(id)
    if (!sound || this.muted) return

    const clone = sound.cloneNode() as HTMLAudioElement
    clone.volume = (options.volume ?? 1) * this.masterVolume
    clone.loop = options.loop ?? false
    clone.playbackRate = options.rate ?? 1

    void clone.play()
    return clone
  }

  stop(id: string): void {
    const sound = this.sounds.get(id)
    if (!sound) return

    sound.pause()
    sound.currentTime = 0
  }

  setVolume(id: string, volume: number): void {
    const sound = this.sounds.get(id)
    if (!sound) return

    sound.volume = volume * this.masterVolume
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  mute(): void {
    this.muted = true
  }

  unmute(): void {
    this.muted = false
  }

  isMuted(): boolean {
    return this.muted
  }

  clear(): void {
    this.sounds.forEach((sound) => {
      sound.pause()
      sound.src = ''
    })
    this.sounds.clear()
  }
}

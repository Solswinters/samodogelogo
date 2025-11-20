/**
 * Sound Manager for audio playback with pooling and advanced features
 */

export interface SoundConfig {
  volume: number
  loop: boolean
  rate: number
  fadeIn?: number
  fadeOut?: number
}

export interface SoundInstance {
  audio: HTMLAudioElement
  id: string
  playing: boolean
  fadeInterval?: NodeJS.Timeout
}

export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private activeSounds: Map<string, Set<SoundInstance>> = new Map()
  private masterVolume = 1
  private muted = false
  private maxInstances = 5
  private initialized = false

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
    // Stop all active sounds
    this.activeSounds.forEach((instances) => {
      instances.forEach((instance) => {
        if (instance.fadeInterval) {
          clearInterval(instance.fadeInterval)
        }
        instance.audio.pause()
      })
    })
    this.activeSounds.clear()

    // Clear preloaded sounds
    this.sounds.forEach((sound) => {
      sound.pause()
      sound.src = ''
    })
    this.sounds.clear()
  }

  initialize(): void {
    if (this.initialized) {
      return
    }

    // Resume AudioContext on user interaction
    if (typeof window !== 'undefined') {
      const resume = () => {
        this.initialized = true
        document.removeEventListener('click', resume)
        document.removeEventListener('touchstart', resume)
      }

      document.addEventListener('click', resume, { once: true })
      document.addEventListener('touchstart', resume, { once: true })
    }
  }

  playSound(id: string, config?: Partial<SoundConfig>): HTMLAudioElement | undefined {
    const sound = this.sounds.get(id)
    if (!sound || this.muted) {
      return undefined
    }

    // Limit concurrent instances
    const instances = this.activeSounds.get(id) || new Set()
    if (instances.size >= this.maxInstances) {
      // Remove oldest instance
      const oldest = Array.from(instances)[0]
      this.stopInstance(oldest)
    }

    const clone = sound.cloneNode() as HTMLAudioElement
    clone.volume = (config?.volume ?? 1) * this.masterVolume
    clone.loop = config?.loop ?? false
    clone.playbackRate = config?.rate ?? 1

    const instance: SoundInstance = {
      audio: clone,
      id,
      playing: true,
    }

    // Handle fade in
    if (config?.fadeIn) {
      this.fadeIn(instance, config.fadeIn)
    }

    // Handle fade out
    if (config?.fadeOut && !config?.loop) {
      clone.addEventListener('timeupdate', () => {
        if (clone.duration - clone.currentTime <= config.fadeOut!) {
          this.fadeOut(instance, config.fadeOut!)
        }
      })
    }

    // Cleanup on end
    clone.addEventListener('ended', () => {
      this.stopInstance(instance)
    })

    instances.add(instance)
    this.activeSounds.set(id, instances)

    void clone.play().catch((error) => {
      console.warn(`Failed to play sound ${id}:`, error)
      this.stopInstance(instance)
    })

    return clone
  }

  pauseAll(): void {
    this.activeSounds.forEach((instances) => {
      instances.forEach((instance) => {
        instance.audio.pause()
        instance.playing = false
      })
    })
  }

  resumeAll(): void {
    this.activeSounds.forEach((instances) => {
      instances.forEach((instance) => {
        if (!instance.playing) {
          void instance.audio.play()
          instance.playing = true
        }
      })
    })
  }

  stopAll(): void {
    this.activeSounds.forEach((instances) => {
      instances.forEach((instance) => {
        this.stopInstance(instance)
      })
    })
    this.activeSounds.clear()
  }

  getActiveCount(id: string): number {
    return this.activeSounds.get(id)?.size ?? 0
  }

  getTotalActiveCount(): number {
    let count = 0
    this.activeSounds.forEach((instances) => {
      count += instances.size
    })
    return count
  }

  setMaxInstances(max: number): void {
    this.maxInstances = Math.max(1, max)
  }

  private stopInstance(instance: SoundInstance): void {
    if (instance.fadeInterval) {
      clearInterval(instance.fadeInterval)
    }

    instance.audio.pause()
    instance.audio.currentTime = 0
    instance.playing = false

    const instances = this.activeSounds.get(instance.id)
    if (instances) {
      instances.delete(instance)
      if (instances.size === 0) {
        this.activeSounds.delete(instance.id)
      }
    }
  }

  private fadeIn(instance: SoundInstance, duration: number): void {
    const startVolume = 0
    const targetVolume = instance.audio.volume
    const steps = 20
    const stepDuration = duration / steps
    const volumeStep = targetVolume / steps

    instance.audio.volume = startVolume
    let currentStep = 0

    instance.fadeInterval = setInterval(() => {
      currentStep++
      instance.audio.volume = Math.min(startVolume + volumeStep * currentStep, targetVolume)

      if (currentStep >= steps && instance.fadeInterval) {
        clearInterval(instance.fadeInterval)
        instance.fadeInterval = undefined
      }
    }, stepDuration)
  }

  private fadeOut(instance: SoundInstance, duration: number): void {
    const startVolume = instance.audio.volume
    const steps = 20
    const stepDuration = duration / steps
    const volumeStep = startVolume / steps

    let currentStep = 0

    instance.fadeInterval = setInterval(() => {
      currentStep++
      instance.audio.volume = Math.max(startVolume - volumeStep * currentStep, 0)

      if (currentStep >= steps) {
        this.stopInstance(instance)
      }
    }, stepDuration)
  }

  cleanup(): void {
    this.stopAll()
    this.clear()
  }
}

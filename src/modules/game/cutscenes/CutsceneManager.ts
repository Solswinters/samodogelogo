/**
 * Manager for cutscene playback
 */

import { Cutscene, CutsceneConfig } from './Cutscene'

export class CutsceneManager {
  private cutscenes: Map<string, Cutscene>
  private activeCutscene: Cutscene | null
  private queue: string[]

  constructor() {
    this.cutscenes = new Map()
    this.activeCutscene = null
    this.queue = []
  }

  addCutscene(config: CutsceneConfig): void {
    const cutscene = new Cutscene(config)
    this.cutscenes.set(config.id, cutscene)
  }

  play(cutsceneId: string, queueIfBusy = false): boolean {
    const cutscene = this.cutscenes.get(cutsceneId)
    if (!cutscene) {
      return false
    }

    if (this.activeCutscene) {
      if (queueIfBusy) {
        this.queue.push(cutsceneId)
        return true
      }
      return false
    }

    this.activeCutscene = cutscene
    cutscene.start()
    return true
  }

  update(deltaTime: number): void {
    if (!this.activeCutscene) {
      this.processQueue()
      return
    }

    this.activeCutscene.update(deltaTime)

    if (!this.activeCutscene.isActive()) {
      this.activeCutscene = null
      this.processQueue()
    }
  }

  skip(): void {
    if (this.activeCutscene) {
      this.activeCutscene.skip()
    }
  }

  pause(): void {
    if (this.activeCutscene) {
      this.activeCutscene.pause()
    }
  }

  resume(): void {
    if (this.activeCutscene) {
      this.activeCutscene.resume()
    }
  }

  isPlaying(): boolean {
    return this.activeCutscene !== null && this.activeCutscene.isActive()
  }

  getActiveCutscene(): Cutscene | null {
    return this.activeCutscene
  }

  clearQueue(): void {
    this.queue = []
  }

  private processQueue(): void {
    if (this.queue.length > 0 && !this.activeCutscene) {
      const nextId = this.queue.shift()
      if (nextId) {
        this.play(nextId)
      }
    }
  }
}

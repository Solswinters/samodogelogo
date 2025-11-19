/**
 * Cutscene system for cinematic sequences
 */

export interface CutsceneFrame {
  id: string
  duration: number
  text?: string
  image?: string
  animation?: string
  onEnter?: () => void
  onExit?: () => void
}

export interface CutsceneConfig {
  id: string
  frames: CutsceneFrame[]
  skippable?: boolean
  onComplete?: () => void
}

export class Cutscene {
  id: string
  frames: CutsceneFrame[]
  skippable: boolean
  onComplete?: () => void

  private currentFrameIndex: number
  private currentFrame: CutsceneFrame | null
  private frameElapsed: number
  private isPlaying: boolean
  private isPaused: boolean

  constructor(config: CutsceneConfig) {
    this.id = config.id
    this.frames = config.frames
    this.skippable = config.skippable ?? true
    this.onComplete = config.onComplete

    this.currentFrameIndex = 0
    this.currentFrame = null
    this.frameElapsed = 0
    this.isPlaying = false
    this.isPaused = false
  }

  start(): void {
    if (this.frames.length === 0) {
      return
    }

    this.isPlaying = true
    this.currentFrameIndex = 0
    this.loadFrame(0)
  }

  update(deltaTime: number): void {
    if (!this.isPlaying || this.isPaused || !this.currentFrame) {
      return
    }

    this.frameElapsed += deltaTime

    if (this.frameElapsed >= this.currentFrame.duration) {
      this.nextFrame()
    }
  }

  nextFrame(): void {
    if (!this.currentFrame) {
      return
    }

    // Call onExit callback
    if (this.currentFrame.onExit) {
      this.currentFrame.onExit()
    }

    this.currentFrameIndex++

    if (this.currentFrameIndex >= this.frames.length) {
      this.complete()
      return
    }

    this.loadFrame(this.currentFrameIndex)
  }

  previousFrame(): void {
    if (this.currentFrameIndex <= 0) {
      return
    }

    if (this.currentFrame?.onExit) {
      this.currentFrame.onExit()
    }

    this.currentFrameIndex--
    this.loadFrame(this.currentFrameIndex)
  }

  skip(): void {
    if (!this.skippable || !this.isPlaying) {
      return
    }

    this.complete()
  }

  pause(): void {
    this.isPaused = true
  }

  resume(): void {
    this.isPaused = false
  }

  private loadFrame(index: number): void {
    this.currentFrame = this.frames[index] ?? null
    this.frameElapsed = 0

    if (this.currentFrame?.onEnter) {
      this.currentFrame.onEnter()
    }
  }

  private complete(): void {
    this.isPlaying = false
    this.isPaused = false
    this.currentFrame = null

    if (this.onComplete) {
      this.onComplete()
    }
  }

  getCurrentFrame(): CutsceneFrame | null {
    return this.currentFrame
  }

  getProgress(): number {
    if (!this.currentFrame || this.frames.length === 0) {
      return 0
    }

    const frameProgress = this.frameElapsed / this.currentFrame.duration
    const totalProgress = (this.currentFrameIndex + frameProgress) / this.frames.length

    return Math.min(totalProgress, 1)
  }

  isActive(): boolean {
    return this.isPlaying
  }

  reset(): void {
    this.currentFrameIndex = 0
    this.currentFrame = null
    this.frameElapsed = 0
    this.isPlaying = false
    this.isPaused = false
  }
}

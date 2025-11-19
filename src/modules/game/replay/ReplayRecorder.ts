/**
 * Replay recording and playback system
 */

export interface ReplayFrame {
  timestamp: number
  playerPosition: { x: number; y: number }
  playerVelocity: { x: number; y: number }
  obstacles: Array<{ x: number; y: number; type: string }>
  score: number
  inputs: string[]
}

export interface ReplayData {
  id: string
  startTime: number
  endTime: number
  frames: ReplayFrame[]
  finalScore: number
  duration: number
}

export class ReplayRecorder {
  private isRecording: boolean = false
  private frames: ReplayFrame[] = []
  private startTime: number = 0
  private replayId: string = ''

  startRecording(): void {
    this.isRecording = true
    this.frames = []
    this.startTime = Date.now()
    this.replayId = `replay-${this.startTime}`
  }

  recordFrame(frame: Omit<ReplayFrame, 'timestamp'>): void {
    if (!this.isRecording) return

    this.frames.push({
      ...frame,
      timestamp: Date.now() - this.startTime,
    })
  }

  stopRecording(finalScore: number): ReplayData {
    this.isRecording = false
    const endTime = Date.now()

    return {
      id: this.replayId,
      startTime: this.startTime,
      endTime,
      frames: this.frames,
      finalScore,
      duration: endTime - this.startTime,
    }
  }

  isActiveRecording(): boolean {
    return this.isRecording
  }

  getFrameCount(): number {
    return this.frames.length
  }

  clear(): void {
    this.frames = []
    this.isRecording = false
  }
}

export class ReplayPlayer {
  private replay: ReplayData | null = null
  private currentFrameIndex: number = 0
  private isPlaying: boolean = false
  private playbackSpeed: number = 1

  loadReplay(replay: ReplayData): void {
    this.replay = replay
    this.currentFrameIndex = 0
  }

  play(): void {
    if (!this.replay) return
    this.isPlaying = true
  }

  pause(): void {
    this.isPlaying = false
  }

  stop(): void {
    this.isPlaying = false
    this.currentFrameIndex = 0
  }

  getFrame(elapsedTime: number): ReplayFrame | null {
    if (!this.replay) return null

    const targetTime = elapsedTime * this.playbackSpeed

    // Find closest frame
    for (let i = this.currentFrameIndex; i < this.replay.frames.length; i++) {
      const frame = this.replay.frames[i]
      if (frame && frame.timestamp >= targetTime) {
        this.currentFrameIndex = i
        return frame
      }
    }

    return null
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(speed, 3))
  }

  isActivelyPlaying(): boolean {
    return this.isPlaying
  }
}

export const replayRecorder = new ReplayRecorder()

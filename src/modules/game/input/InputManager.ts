/**
 * Input handling system for keyboard and touch
 */

export type InputAction = 'jump' | 'pause' | 'restart' | 'menu'

export interface InputState {
  jump: boolean
  pause: boolean
  restart: boolean
  menu: boolean
}

export class InputManager {
  private state: InputState = {
    jump: false,
    pause: false,
    restart: false,
    menu: false,
  }

  private keyMap: Record<string, InputAction> = {
    Space: 'jump',
    ArrowUp: 'jump',
    KeyW: 'jump',
    Escape: 'pause',
    KeyP: 'pause',
    KeyR: 'restart',
    KeyM: 'menu',
  }

  private callbacks: Map<InputAction, Set<() => void>> = new Map()
  private isInitialized = false

  initialize(): void {
    if (this.isInitialized) {
      return
    }

    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('touchstart', this.handleTouchStart)
    window.addEventListener('touchend', this.handleTouchEnd)
    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)

    this.isInitialized = true
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    const action = this.keyMap[e.code]
    if (action) {
      e.preventDefault()
      if (!this.state[action]) {
        this.state[action] = true
        this.triggerCallbacks(action)
      }
    }
  }

  private handleKeyUp = (e: KeyboardEvent): void => {
    const action = this.keyMap[e.code]
    if (action) {
      e.preventDefault()
      this.state[action] = false
    }
  }

  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault()
    if (!this.state.jump) {
      this.state.jump = true
      this.triggerCallbacks('jump')
    }
  }

  private handleTouchEnd = (): void => {
    this.state.jump = false
  }

  private handleMouseDown = (e: MouseEvent): void => {
    if (e.button === 0 && !this.state.jump) {
      this.state.jump = true
      this.triggerCallbacks('jump')
    }
  }

  private handleMouseUp = (): void => {
    this.state.jump = false
  }

  private triggerCallbacks(action: InputAction): void {
    const callbacks = this.callbacks.get(action)
    if (callbacks) {
      callbacks.forEach(cb => cb())
    }
  }

  on(action: InputAction, callback: () => void): () => void {
    if (!this.callbacks.has(action)) {
      this.callbacks.set(action, new Set())
    }
    this.callbacks.get(action)?.add(callback)

    // Return unsubscribe function
    return () => {
      this.callbacks.get(action)?.delete(callback)
    }
  }

  getState(): InputState {
    return { ...this.state }
  }

  isPressed(action: InputAction): boolean {
    return this.state[action]
  }

  cleanup(): void {
    if (!this.isInitialized) {
      return
    }

    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchend', this.handleTouchEnd)
    window.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mouseup', this.handleMouseUp)

    this.callbacks.clear()
    this.isInitialized = false
  }
}

export const inputManager = new InputManager()

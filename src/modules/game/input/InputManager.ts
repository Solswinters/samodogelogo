/**
 * Input Manager for keyboard, mouse, touch, and gamepad input
 */

export type InputKey = string

export interface TouchInfo {
  id: number
  x: number
  y: number
  startX: number
  startY: number
  deltaX: number
  deltaY: number
}

export interface GamepadState {
  connected: boolean
  buttons: boolean[]
  axes: number[]
}

export interface InputState {
  keys: Map<InputKey, boolean>
  mousePosition: { x: number; y: number }
  mouseButtons: Map<number, boolean>
  touches: Map<number, TouchInfo>
  gamepads: GamepadState[]
}

export class InputManager {
  private keys: Map<InputKey, boolean> = new Map()
  private previousKeys: Map<InputKey, boolean> = new Map()
  private mousePosition = { x: 0, y: 0 }
  private previousMousePosition = { x: 0, y: 0 }
  private mouseButtons: Map<number, boolean> = new Map()
  private previousMouseButtons: Map<number, boolean> = new Map()
  private touches: Map<number, TouchInfo> = new Map()
  private previousTouches: Map<number, TouchInfo> = new Map()
  private gamepads: GamepadState[] = []
  private isEnabled = true
  private canvas: HTMLCanvasElement | null = null

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || null
    this.init()
  }

  private init(): void {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)

    // Mouse events
    const target = this.canvas || window
    target.addEventListener('mousemove', this.handleMouseMove as any)
    target.addEventListener('mousedown', this.handleMouseDown as any)
    target.addEventListener('mouseup', this.handleMouseUp as any)

    // Touch events
    target.addEventListener('touchstart', this.handleTouchStart as any, { passive: false })
    target.addEventListener('touchmove', this.handleTouchMove as any, { passive: false })
    target.addEventListener('touchend', this.handleTouchEnd as any, { passive: false })
    target.addEventListener('touchcancel', this.handleTouchCancel as any, { passive: false })

    // Gamepad events
    window.addEventListener('gamepadconnected', this.handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected)
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.isEnabled) return
    this.keys.set(e.code, true)

    // Prevent default for game controls
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault()
    }
  }

  private handleKeyUp = (e: KeyboardEvent): void => {
    if (!this.isEnabled) return
    this.keys.set(e.code, false)
  }

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isEnabled) return

    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect()
      this.mousePosition.x = e.clientX - rect.left
      this.mousePosition.y = e.clientY - rect.top
    } else {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY
    }
  }

  private handleMouseDown = (e: MouseEvent): void => {
    if (!this.isEnabled) return
    this.mouseButtons.set(e.button, true)
    e.preventDefault()
  }

  private handleMouseUp = (e: MouseEvent): void => {
    if (!this.isEnabled) return
    this.mouseButtons.set(e.button, false)
  }

  private handleTouchStart = (e: TouchEvent): void => {
    if (!this.isEnabled) return
    e.preventDefault()

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (!touch) continue

      const x = this.getTouchX(touch)
      const y = this.getTouchY(touch)

      this.touches.set(touch.identifier, {
        id: touch.identifier,
        x,
        y,
        startX: x,
        startY: y,
        deltaX: 0,
        deltaY: 0,
      })
    }
  }

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.isEnabled) return
    e.preventDefault()

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (!touch) continue

      const existing = this.touches.get(touch.identifier)
      if (!existing) continue

      const x = this.getTouchX(touch)
      const y = this.getTouchY(touch)

      existing.deltaX = x - existing.x
      existing.deltaY = y - existing.y
      existing.x = x
      existing.y = y
    }
  }

  private handleTouchEnd = (e: TouchEvent): void => {
    if (!this.isEnabled) return
    e.preventDefault()

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      if (!touch) continue
      this.touches.delete(touch.identifier)
    }
  }

  private handleTouchCancel = (e: TouchEvent): void => {
    this.handleTouchEnd(e)
  }

  private getTouchX(touch: Touch): number {
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect()
      return touch.clientX - rect.left
    }
    return touch.clientX
  }

  private getTouchY(touch: Touch): number {
    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect()
      return touch.clientY - rect.top
    }
    return touch.clientY
  }

  private handleGamepadConnected = (e: GamepadEvent): void => {
    console.log(`Gamepad connected: ${e.gamepad.id}`)
  }

  private handleGamepadDisconnected = (e: GamepadEvent): void => {
    console.log(`Gamepad disconnected: ${e.gamepad.id}`)
  }

  // Keyboard methods
  isKeyDown(key: InputKey): boolean {
    return this.keys.get(key) ?? false
  }

  isKeyPressed(key: InputKey): boolean {
    return (this.keys.get(key) ?? false) && !(this.previousKeys.get(key) ?? false)
  }

  isKeyReleased(key: InputKey): boolean {
    return !(this.keys.get(key) ?? false) && (this.previousKeys.get(key) ?? false)
  }

  // Mouse methods
  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.get(button) ?? false
  }

  isMouseButtonPressed(button: number): boolean {
    return (
      (this.mouseButtons.get(button) ?? false) && !(this.previousMouseButtons.get(button) ?? false)
    )
  }

  isMouseButtonReleased(button: number): boolean {
    return (
      !(this.mouseButtons.get(button) ?? false) && (this.previousMouseButtons.get(button) ?? false)
    )
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition }
  }

  getMouseDelta(): { x: number; y: number } {
    return {
      x: this.mousePosition.x - this.previousMousePosition.x,
      y: this.mousePosition.y - this.previousMousePosition.y,
    }
  }

  // Touch methods
  getTouches(): TouchInfo[] {
    return Array.from(this.touches.values())
  }

  getTouch(id: number): TouchInfo | undefined {
    return this.touches.get(id)
  }

  getTouchCount(): number {
    return this.touches.size
  }

  hasTouches(): boolean {
    return this.touches.size > 0
  }

  getFirstTouch(): TouchInfo | undefined {
    const touches = this.getTouches()
    return touches[0]
  }

  isTouchActive(id: number): boolean {
    return this.touches.has(id)
  }

  wasTouchActive(id: number): boolean {
    return this.previousTouches.has(id)
  }

  isTouchStarted(id: number): boolean {
    return this.touches.has(id) && !this.previousTouches.has(id)
  }

  isTouchEnded(id: number): boolean {
    return !this.touches.has(id) && this.previousTouches.has(id)
  }

  // Gamepad methods
  updateGamepads(): void {
    const gamepads = navigator.getGamepads()
    this.gamepads = []

    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i]
      if (gamepad) {
        this.gamepads[i] = {
          connected: gamepad.connected,
          buttons: gamepad.buttons.map((button) => button.pressed),
          axes: Array.from(gamepad.axes),
        }
      }
    }
  }

  getGamepad(index: number = 0): GamepadState | undefined {
    return this.gamepads[index]
  }

  isGamepadButtonDown(gamepadIndex: number = 0, buttonIndex: number): boolean {
    const gamepad = this.gamepads[gamepadIndex]
    return gamepad?.buttons[buttonIndex] ?? false
  }

  getGamepadAxis(gamepadIndex: number = 0, axisIndex: number): number {
    const gamepad = this.gamepads[gamepadIndex]
    return gamepad?.axes[axisIndex] ?? 0
  }

  hasGamepad(): boolean {
    return this.gamepads.some((gp) => gp.connected)
  }

  // Utility methods
  isAnyKeyDown(): boolean {
    return Array.from(this.keys.values()).some((pressed) => pressed)
  }

  isAnyMouseButtonDown(): boolean {
    return Array.from(this.mouseButtons.values()).some((pressed) => pressed)
  }

  getInputState(): InputState {
    return {
      keys: new Map(this.keys),
      mousePosition: { ...this.mousePosition },
      mouseButtons: new Map(this.mouseButtons),
      touches: new Map(this.touches),
      gamepads: [...this.gamepads],
    }
  }

  enable(): void {
    this.isEnabled = true
  }

  disable(): void {
    this.isEnabled = false
  }

  reset(): void {
    this.keys.clear()
    this.previousKeys.clear()
    this.mouseButtons.clear()
    this.previousMouseButtons.clear()
    this.touches.clear()
    this.previousTouches.clear()
  }

  update(): void {
    // Copy current state to previous
    this.previousKeys = new Map(this.keys)
    this.previousMouseButtons = new Map(this.mouseButtons)
    this.previousMousePosition = { ...this.mousePosition }
    this.previousTouches = new Map(this.touches)

    // Update gamepad state
    this.updateGamepads()
  }

  destroy(): void {
    const target = this.canvas || window

    // Remove keyboard listeners
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)

    // Remove mouse listeners
    target.removeEventListener('mousemove', this.handleMouseMove as any)
    target.removeEventListener('mousedown', this.handleMouseDown as any)
    target.removeEventListener('mouseup', this.handleMouseUp as any)

    // Remove touch listeners
    target.removeEventListener('touchstart', this.handleTouchStart as any)
    target.removeEventListener('touchmove', this.handleTouchMove as any)
    target.removeEventListener('touchend', this.handleTouchEnd as any)
    target.removeEventListener('touchcancel', this.handleTouchCancel as any)

    // Remove gamepad listeners
    window.removeEventListener('gamepadconnected', this.handleGamepadConnected)
    window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected)

    this.reset()
  }
}

/**
 * Input handling utilities for game controls
 * Provides keyboard, mouse, and touch input management
 */

export interface InputState {
  keys: Set<string>
  mouse: {
    x: number
    y: number
    buttons: Set<number>
  }
  touches: Map<number, { x: number; y: number }>
  gamepad: GamepadState | null
}

export interface GamepadState {
  index: number
  buttons: boolean[]
  axes: number[]
}

export type InputCallback = (event: KeyboardEvent | MouseEvent | TouchEvent) => void

export class GameInputUtils {
  private static inputState: InputState = {
    keys: new Set(),
    mouse: { x: 0, y: 0, buttons: new Set() },
    touches: new Map(),
    gamepad: null,
  }

  private static keyDownListeners: Map<string, Set<InputCallback>> = new Map()
  private static keyUpListeners: Map<string, Set<InputCallback>> = new Map()
  private static mouseListeners: Set<InputCallback> = new Set()
  private static touchListeners: Set<InputCallback> = new Set()
  private static initialized = false

  /**
   * Initialize input system
   */
  static initialize(canvas?: HTMLElement): void {
    if (this.initialized) return

    const target = canvas || window

    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))

    // Mouse events
    target.addEventListener('mousedown', this.handleMouseDown.bind(this) as EventListener)
    target.addEventListener('mouseup', this.handleMouseUp.bind(this) as EventListener)
    target.addEventListener('mousemove', this.handleMouseMove.bind(this) as EventListener)
    target.addEventListener('contextmenu', (e) => e.preventDefault())

    // Touch events
    target.addEventListener('touchstart', this.handleTouchStart.bind(this) as EventListener)
    target.addEventListener('touchend', this.handleTouchEnd.bind(this) as EventListener)
    target.addEventListener('touchmove', this.handleTouchMove.bind(this) as EventListener)

    this.initialized = true
  }

  /**
   * Clean up input system
   */
  static cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this))
    window.removeEventListener('keyup', this.handleKeyUp.bind(this))

    this.keyDownListeners.clear()
    this.keyUpListeners.clear()
    this.mouseListeners.clear()
    this.touchListeners.clear()

    this.initialized = false
  }

  /**
   * Check if key is pressed
   */
  static isKeyPressed(key: string): boolean {
    return this.inputState.keys.has(key.toLowerCase())
  }

  /**
   * Check if any of the keys are pressed
   */
  static isAnyKeyPressed(keys: string[]): boolean {
    return keys.some((key) => this.isKeyPressed(key))
  }

  /**
   * Check if all keys are pressed
   */
  static areAllKeysPressed(keys: string[]): boolean {
    return keys.every((key) => this.isKeyPressed(key))
  }

  /**
   * Check if mouse button is pressed
   */
  static isMouseButtonPressed(button: number): boolean {
    return this.inputState.mouse.buttons.has(button)
  }

  /**
   * Get mouse position
   */
  static getMousePosition(): { x: number; y: number } {
    return { ...this.inputState.mouse }
  }

  /**
   * Get touch positions
   */
  static getTouchPositions(): Array<{ x: number; y: number }> {
    return Array.from(this.inputState.touches.values())
  }

  /**
   * Check if touching
   */
  static isTouching(): boolean {
    return this.inputState.touches.size > 0
  }

  /**
   * Add key down listener
   */
  static onKeyDown(key: string, callback: InputCallback): () => void {
    const normalizedKey = key.toLowerCase()

    if (!this.keyDownListeners.has(normalizedKey)) {
      this.keyDownListeners.set(normalizedKey, new Set())
    }

    this.keyDownListeners.get(normalizedKey)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.keyDownListeners.get(normalizedKey)?.delete(callback)
    }
  }

  /**
   * Add key up listener
   */
  static onKeyUp(key: string, callback: InputCallback): () => void {
    const normalizedKey = key.toLowerCase()

    if (!this.keyUpListeners.has(normalizedKey)) {
      this.keyUpListeners.set(normalizedKey, new Set())
    }

    this.keyUpListeners.get(normalizedKey)!.add(callback)

    return () => {
      this.keyUpListeners.get(normalizedKey)?.delete(callback)
    }
  }

  /**
   * Add mouse listener
   */
  static onMouse(callback: InputCallback): () => void {
    this.mouseListeners.add(callback)

    return () => {
      this.mouseListeners.delete(callback)
    }
  }

  /**
   * Add touch listener
   */
  static onTouch(callback: InputCallback): () => void {
    this.touchListeners.add(callback)

    return () => {
      this.touchListeners.delete(callback)
    }
  }

  /**
   * Handle keyboard down
   */
  private static handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase()

    // Prevent default for game keys
    if (this.isGameKey(key)) {
      event.preventDefault()
    }

    if (!this.inputState.keys.has(key)) {
      this.inputState.keys.add(key)

      // Trigger listeners
      this.keyDownListeners.get(key)?.forEach((callback) => callback(event))
    }
  }

  /**
   * Handle keyboard up
   */
  private static handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase()

    this.inputState.keys.delete(key)

    // Trigger listeners
    this.keyUpListeners.get(key)?.forEach((callback) => callback(event))
  }

  /**
   * Handle mouse down
   */
  private static handleMouseDown(event: MouseEvent): void {
    this.inputState.mouse.buttons.add(event.button)
    this.updateMousePosition(event)

    this.mouseListeners.forEach((callback) => callback(event))
  }

  /**
   * Handle mouse up
   */
  private static handleMouseUp(event: MouseEvent): void {
    this.inputState.mouse.buttons.delete(event.button)
    this.updateMousePosition(event)

    this.mouseListeners.forEach((callback) => callback(event))
  }

  /**
   * Handle mouse move
   */
  private static handleMouseMove(event: MouseEvent): void {
    this.updateMousePosition(event)

    this.mouseListeners.forEach((callback) => callback(event))
  }

  /**
   * Handle touch start
   */
  private static handleTouchStart(event: TouchEvent): void {
    event.preventDefault()

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      this.inputState.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
      })
    }

    this.touchListeners.forEach((callback) => callback(event))
  }

  /**
   * Handle touch end
   */
  private static handleTouchEnd(event: TouchEvent): void {
    event.preventDefault()

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      this.inputState.touches.delete(touch.identifier)
    }

    this.touchListeners.forEach((callback) => callback(event))
  }

  /**
   * Handle touch move
   */
  private static handleTouchMove(event: TouchEvent): void {
    event.preventDefault()

    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      this.inputState.touches.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
      })
    }

    this.touchListeners.forEach((callback) => callback(event))
  }

  /**
   * Update mouse position
   */
  private static updateMousePosition(event: MouseEvent): void {
    this.inputState.mouse.x = event.clientX
    this.inputState.mouse.y = event.clientY
  }

  /**
   * Check if key is a game key (should prevent default)
   */
  private static isGameKey(key: string): boolean {
    const gameKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd']
    return gameKeys.includes(key)
  }

  /**
   * Get gamepad state
   */
  static updateGamepad(): void {
    const gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
      if (gamepad) {
        this.inputState.gamepad = {
          index: gamepad.index,
          buttons: gamepad.buttons.map((b) => b.pressed),
          axes: Array.from(gamepad.axes),
        }
        break
      }
    }
  }

  /**
   * Check if gamepad button is pressed
   */
  static isGamepadButtonPressed(buttonIndex: number): boolean {
    return this.inputState.gamepad?.buttons[buttonIndex] || false
  }

  /**
   * Get gamepad axis value
   */
  static getGamepadAxis(axisIndex: number): number {
    return this.inputState.gamepad?.axes[axisIndex] || 0
  }

  /**
   * Check if gamepad is connected
   */
  static isGamepadConnected(): boolean {
    return this.inputState.gamepad !== null
  }

  /**
   * Get input state
   */
  static getInputState(): InputState {
    return { ...this.inputState }
  }

  /**
   * Reset input state
   */
  static reset(): void {
    this.inputState.keys.clear()
    this.inputState.mouse.buttons.clear()
    this.inputState.touches.clear()
    this.inputState.gamepad = null
  }

  /**
   * Check for input combo
   */
  static checkCombo(keys: string[], within: number = 1000): boolean {
    // This would require tracking key press timing
    // Simplified version - check if all keys are currently pressed
    return this.areAllKeysPressed(keys)
  }

  /**
   * Virtual joystick helper
   */
  static getVirtualJoystick(): { x: number; y: number } {
    let x = 0
    let y = 0

    // Keyboard
    if (this.isKeyPressed('arrowleft') || this.isKeyPressed('a')) x -= 1
    if (this.isKeyPressed('arrowright') || this.isKeyPressed('d')) x += 1
    if (this.isKeyPressed('arrowup') || this.isKeyPressed('w')) y -= 1
    if (this.isKeyPressed('arrowdown') || this.isKeyPressed('s')) y += 1

    // Gamepad
    if (this.inputState.gamepad) {
      x += this.getGamepadAxis(0)
      y += this.getGamepadAxis(1)
    }

    // Normalize
    const length = Math.sqrt(x * x + y * y)
    if (length > 1) {
      x /= length
      y /= length
    }

    return { x, y }
  }
}

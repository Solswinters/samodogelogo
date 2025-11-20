/**
 * Input Manager for keyboard and mouse input
 */

export type InputKey = string

export class InputManager {
  private keys: Map<InputKey, boolean> = new Map()
  private previousKeys: Map<InputKey, boolean> = new Map()
  private mousePosition = { x: 0, y: 0 }
  private mouseButtons: Map<number, boolean> = new Map()
  private previousMouseButtons: Map<number, boolean> = new Map()

  constructor() {
    this.init()
  }

  private init(): void {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    this.keys.set(e.code, true)
  }

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keys.set(e.code, false)
  }

  private handleMouseMove = (e: MouseEvent): void => {
    this.mousePosition.x = e.clientX
    this.mousePosition.y = e.clientY
  }

  private handleMouseDown = (e: MouseEvent): void => {
    this.mouseButtons.set(e.button, true)
  }

  private handleMouseUp = (e: MouseEvent): void => {
    this.mouseButtons.set(e.button, false)
  }

  isKeyDown(key: InputKey): boolean {
    return this.keys.get(key) ?? false
  }

  isKeyPressed(key: InputKey): boolean {
    return (this.keys.get(key) ?? false) && !(this.previousKeys.get(key) ?? false)
  }

  isKeyReleased(key: InputKey): boolean {
    return !(this.keys.get(key) ?? false) && (this.previousKeys.get(key) ?? false)
  }

  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.get(button) ?? false
  }

  isMouseButtonPressed(button: number): boolean {
    return (
      (this.mouseButtons.get(button) ?? false) && !(this.previousMouseButtons.get(button) ?? false)
    )
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition }
  }

  update(): void {
    // Copy current state to previous
    this.previousKeys = new Map(this.keys)
    this.previousMouseButtons = new Map(this.mouseButtons)
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
}

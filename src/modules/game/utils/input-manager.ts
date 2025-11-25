/**
 * Input management for game controls
 */

import { logger } from '@/utils/logger'

type InputCallback = () => void

interface InputBinding {
  keys: string[]
  callback: InputCallback
  enabled: boolean
}

class InputManager {
  private pressedKeys: Set<string> = new Set()
  private bindings: Map<string, InputBinding> = new Map()
  private enabled: boolean = true

  initialize(): void {
    if (typeof window === 'undefined') {
      logger.warn('Cannot initialize input manager: Window is undefined')
      return
    }

    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
    window.addEventListener('blur', this.handleBlur.bind(this))

    logger.info('Input manager initialized')
  }

  destroy(): void {
    if (typeof window === 'undefined') {return}

    window.removeEventListener('keydown', this.handleKeyDown.bind(this))
    window.removeEventListener('keyup', this.handleKeyUp.bind(this))
    window.removeEventListener('blur', this.handleBlur.bind(this))

    this.clearAll()
    logger.info('Input manager destroyed')
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) {return}

    const key = event.key
    if (!this.pressedKeys.has(key)) {
      this.pressedKeys.add(key)
      this.checkBindings()
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key
    this.pressedKeys.delete(key)
  }

  private handleBlur(): void {
    // Clear all pressed keys when window loses focus
    this.pressedKeys.clear()
  }

  private checkBindings(): void {
    this.bindings.forEach(binding => {
      if (binding.enabled && this.areKeysPressed(binding.keys)) {
        binding.callback()
      }
    })
  }

  bind(id: string, keys: string[], callback: InputCallback): void {
    this.bindings.set(id, {
      keys,
      callback,
      enabled: true,
    })
    logger.debug(`Input binding created: ${id} for keys: ${keys.join(', ')}`)
  }

  unbind(id: string): void {
    this.bindings.delete(id)
    logger.debug(`Input binding removed: ${id}`)
  }

  enableBinding(id: string): void {
    const binding = this.bindings.get(id)
    if (binding) {
      binding.enabled = true
    }
  }

  disableBinding(id: string): void {
    const binding = this.bindings.get(id)
    if (binding) {
      binding.enabled = false
    }
  }

  isKeyPressed(key: string): boolean {
    return this.pressedKeys.has(key)
  }

  areKeysPressed(keys: string[]): boolean {
    return keys.every(key => this.pressedKeys.has(key))
  }

  isAnyKeyPressed(keys: string[]): boolean {
    return keys.some(key => this.pressedKeys.has(key))
  }

  getPressedKeys(): string[] {
    return Array.from(this.pressedKeys)
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
    this.pressedKeys.clear()
  }

  isEnabled(): boolean {
    return this.enabled
  }

  clearPressedKeys(): void {
    this.pressedKeys.clear()
  }

  clearBindings(): void {
    this.bindings.clear()
  }

  clearAll(): void {
    this.clearPressedKeys()
    this.clearBindings()
  }
}

/**
 * inputManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of inputManager.
 */
export const inputManager = new InputManager()

// Common key constants
/**
 * KEY utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of KEY.
 */
export const KEY = {
  SPACE: ' ',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  W: 'w',
  A: 'a',
  S: 's',
  D: 'd',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SHIFT: 'Shift',
  CONTROL: 'Control',
  ALT: 'Alt',
} as const

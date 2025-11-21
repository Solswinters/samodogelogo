/**
 * Gesture Handler - Touch gesture recognition for mobile
 */

export type GestureType =
  | 'tap'
  | 'double-tap'
  | 'long-press'
  | 'swipe-up'
  | 'swipe-down'
  | 'swipe-left'
  | 'swipe-right'
  | 'pinch'
  | 'rotate'

export interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

export interface GestureEvent {
  type: GestureType
  startX: number
  startY: number
  endX: number
  endY: number
  deltaX: number
  deltaY: number
  distance: number
  velocity: number
  scale?: number
  rotation?: number
  duration: number
}

export class GestureHandler {
  private touchStart: TouchPoint | null = null
  private touchEnd: TouchPoint | null = null
  private lastTap: number = 0
  private longPressTimer: NodeJS.Timeout | null = null
  private initialTouches: Touch[] = []
  private onGesture?: (event: GestureEvent) => void

  // Configuration
  private readonly tapThreshold = 10 // pixels
  private readonly swipeThreshold = 50 // pixels
  private readonly doubleTapDelay = 300 // ms
  private readonly longPressDelay = 500 // ms
  private readonly velocityThreshold = 0.5 // pixels per ms

  constructor(element: HTMLElement) {
    this.attachListeners(element)
  }

  /**
   * Attach event listeners
   */
  private attachListeners(element: HTMLElement): void {
    element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
    element.addEventListener('touchcancel', this.handleTouchCancel.bind(this))
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault()

    const touch = event.touches[0]

    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    }

    this.initialTouches = Array.from(event.touches)

    // Start long press timer
    this.longPressTimer = setTimeout(() => {
      if (this.touchStart) {
        this.emitGesture({
          type: 'long-press',
          startX: this.touchStart.x,
          startY: this.touchStart.y,
          endX: this.touchStart.x,
          endY: this.touchStart.y,
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          velocity: 0,
          duration: Date.now() - this.touchStart.timestamp,
        })
      }
    }, this.longPressDelay)
  }

  /**
   * Handle touch move
   */
  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault()

    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }

    // Handle pinch gesture
    if (event.touches.length === 2 && this.initialTouches.length === 2) {
      this.handlePinch(event)
    }
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault()

    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }

    if (!this.touchStart) return

    const touch = event.changedTouches[0]

    this.touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    }

    this.processGesture()
  }

  /**
   * Handle touch cancel
   */
  private handleTouchCancel(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }

    this.touchStart = null
    this.touchEnd = null
    this.initialTouches = []
  }

  /**
   * Process gesture
   */
  private processGesture(): void {
    if (!this.touchStart || !this.touchEnd) return

    const deltaX = this.touchEnd.x - this.touchStart.x
    const deltaY = this.touchEnd.y - this.touchStart.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const duration = this.touchEnd.timestamp - this.touchStart.timestamp
    const velocity = distance / duration

    const gestureEvent: GestureEvent = {
      type: 'tap',
      startX: this.touchStart.x,
      startY: this.touchStart.y,
      endX: this.touchEnd.x,
      endY: this.touchEnd.y,
      deltaX,
      deltaY,
      distance,
      velocity,
      duration,
    }

    // Determine gesture type
    if (distance < this.tapThreshold) {
      // Check for double tap
      const now = Date.now()
      if (now - this.lastTap < this.doubleTapDelay) {
        gestureEvent.type = 'double-tap'
        this.lastTap = 0
      } else {
        gestureEvent.type = 'tap'
        this.lastTap = now
      }
    } else if (distance > this.swipeThreshold && velocity > this.velocityThreshold) {
      // Determine swipe direction
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

      if (angle >= -45 && angle <= 45) {
        gestureEvent.type = 'swipe-right'
      } else if (angle >= 45 && angle <= 135) {
        gestureEvent.type = 'swipe-down'
      } else if (angle <= -45 && angle >= -135) {
        gestureEvent.type = 'swipe-up'
      } else {
        gestureEvent.type = 'swipe-left'
      }
    }

    this.emitGesture(gestureEvent)

    // Reset
    this.touchStart = null
    this.touchEnd = null
    this.initialTouches = []
  }

  /**
   * Handle pinch gesture
   */
  private handlePinch(event: TouchEvent): void {
    if (!this.touchStart || this.initialTouches.length !== 2) return

    const touch1 = event.touches[0]
    const touch2 = event.touches[1]

    const currentDistance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
    )

    const initialDistance = Math.sqrt(
      Math.pow(this.initialTouches[1].clientX - this.initialTouches[0].clientX, 2) +
        Math.pow(this.initialTouches[1].clientY - this.initialTouches[0].clientY, 2)
    )

    const scale = currentDistance / initialDistance

    this.emitGesture({
      type: 'pinch',
      startX: this.touchStart.x,
      startY: this.touchStart.y,
      endX: touch1.clientX,
      endY: touch1.clientY,
      deltaX: touch1.clientX - this.touchStart.x,
      deltaY: touch1.clientY - this.touchStart.y,
      distance: currentDistance,
      velocity: 0,
      scale,
      duration: Date.now() - this.touchStart.timestamp,
    })
  }

  /**
   * Emit gesture event
   */
  private emitGesture(event: GestureEvent): void {
    if (this.onGesture) {
      this.onGesture(event)
    }
  }

  /**
   * Set gesture callback
   */
  setOnGesture(callback: (event: GestureEvent) => void): void {
    this.onGesture = callback
  }

  /**
   * Remove gesture callback
   */
  removeOnGesture(): void {
    this.onGesture = undefined
  }

  /**
   * Clean up
   */
  destroy(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
    }
    this.onGesture = undefined
  }
}

export default GestureHandler

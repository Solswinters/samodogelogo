/**
 * Screen Manager - Handle game screen/scene transitions and lifecycle
 */

export enum ScreenType {
  SPLASH = 'splash',
  MAIN_MENU = 'main_menu',
  GAMEPLAY = 'gameplay',
  PAUSE = 'pause',
  GAME_OVER = 'game_over',
  LEADERBOARD = 'leaderboard',
  SETTINGS = 'settings',
  SHOP = 'shop',
  ACHIEVEMENTS = 'achievements',
  PROFILE = 'profile',
  MULTIPLAYER_LOBBY = 'multiplayer_lobby',
  MULTIPLAYER_GAME = 'multiplayer_game',
  TUTORIAL = 'tutorial',
  CREDITS = 'credits',
}

export interface Screen {
  type: ScreenType
  enter(data?: any): void
  exit(): void
  update(deltaTime: number): void
  render(ctx: CanvasRenderingContext2D): void
  handleInput?(event: KeyboardEvent | MouseEvent | TouchEvent): void
  pause?(): void
  resume?(): void
}

export interface ScreenTransition {
  type: 'fade' | 'slide' | 'scale' | 'none'
  duration: number
  easing?: (t: number) => number
}

export interface ScreenStackEntry {
  screen: Screen
  data?: any
}

export class ScreenManager {
  private screens: Map<ScreenType, Screen> = new Map()
  private currentScreen: Screen | null = null
  private screenStack: ScreenStackEntry[] = []
  private transition: {
    active: boolean
    progress: number
    duration: number
    fromScreen: Screen | null
    toScreen: Screen
    type: ScreenTransition['type']
    easing: (t: number) => number
  } | null = null

  private defaultTransition: ScreenTransition = {
    type: 'fade',
    duration: 300,
    easing: (t: number) => t,
  }

  /**
   * Register a screen
   */
  register(type: ScreenType, screen: Screen): void {
    this.screens.set(type, screen)
  }

  /**
   * Unregister a screen
   */
  unregister(type: ScreenType): void {
    this.screens.delete(type)
  }

  /**
   * Change to a new screen
   */
  changeScreen(
    type: ScreenType,
    data?: any,
    transition: ScreenTransition = this.defaultTransition
  ): void {
    const newScreen = this.screens.get(type)

    if (!newScreen) {
      console.error(`Screen "${type}" not found`)
      return
    }

    // Exit current screen
    if (this.currentScreen) {
      this.currentScreen.exit()
    }

    // Start transition if specified
    if (transition.type !== 'none' && transition.duration > 0) {
      this.transition = {
        active: true,
        progress: 0,
        duration: transition.duration,
        fromScreen: this.currentScreen,
        toScreen: newScreen,
        type: transition.type,
        easing: transition.easing || this.defaultTransition.easing!,
      }
    } else {
      // No transition, change immediately
      this.currentScreen = newScreen
      this.currentScreen.enter(data)
    }

    // Clear screen stack
    this.screenStack = []
  }

  /**
   * Push a screen onto the stack (for overlays like pause menu)
   */
  pushScreen(type: ScreenType, data?: any): void {
    const newScreen = this.screens.get(type)

    if (!newScreen) {
      console.error(`Screen "${type}" not found`)
      return
    }

    // Pause current screen
    if (this.currentScreen && this.currentScreen.pause) {
      this.currentScreen.pause()
    }

    // Save current state
    if (this.currentScreen) {
      this.screenStack.push({
        screen: this.currentScreen,
        data,
      })
    }

    // Switch to new screen
    this.currentScreen = newScreen
    this.currentScreen.enter(data)
  }

  /**
   * Pop the current screen and return to previous
   */
  popScreen(): boolean {
    if (this.screenStack.length === 0) {
      return false
    }

    // Exit current screen
    if (this.currentScreen) {
      this.currentScreen.exit()
    }

    // Restore previous screen
    const entry = this.screenStack.pop()!
    this.currentScreen = entry.screen

    // Resume previous screen
    if (this.currentScreen.resume) {
      this.currentScreen.resume()
    }

    return true
  }

  /**
   * Update current screen
   */
  update(deltaTime: number): void {
    // Update transition
    if (this.transition && this.transition.active) {
      this.transition.progress += deltaTime

      if (this.transition.progress >= this.transition.duration) {
        // Transition complete
        this.currentScreen = this.transition.toScreen
        this.currentScreen.enter()
        this.transition = null
      }
    }

    // Update current screen
    if (this.currentScreen && !this.transition) {
      this.currentScreen.update(deltaTime)
    }
  }

  /**
   * Render current screen
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (this.transition && this.transition.active) {
      this.renderTransition(ctx)
    } else if (this.currentScreen) {
      this.currentScreen.render(ctx)
    }

    // Render screens in stack (for overlays)
    if (this.screenStack.length > 0) {
      this.screenStack.forEach((entry) => {
        entry.screen.render(ctx)
      })
    }
  }

  /**
   * Render screen transition
   */
  private renderTransition(ctx: CanvasRenderingContext2D): void {
    if (!this.transition) return

    const progress = this.transition.progress / this.transition.duration
    const easedProgress = this.transition.easing(progress)

    ctx.save()

    switch (this.transition.type) {
      case 'fade':
        // Render old screen with decreasing opacity
        if (this.transition.fromScreen) {
          ctx.globalAlpha = 1 - easedProgress
          this.transition.fromScreen.render(ctx)
        }

        // Render new screen with increasing opacity
        ctx.globalAlpha = easedProgress
        this.transition.toScreen.render(ctx)
        break

      case 'slide':
        // Slide old screen out
        if (this.transition.fromScreen) {
          ctx.translate(-ctx.canvas.width * easedProgress, 0)
          this.transition.fromScreen.render(ctx)
          ctx.translate(ctx.canvas.width * easedProgress, 0)
        }

        // Slide new screen in
        ctx.translate(ctx.canvas.width * (1 - easedProgress), 0)
        this.transition.toScreen.render(ctx)
        break

      case 'scale':
        // Scale old screen down
        if (this.transition.fromScreen) {
          const scale = 1 - easedProgress
          ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
          ctx.scale(scale, scale)
          ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
          ctx.globalAlpha = scale
          this.transition.fromScreen.render(ctx)
        }

        // Scale new screen up
        const newScale = easedProgress
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        ctx.scale(newScale, newScale)
        ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
        ctx.globalAlpha = easedProgress
        this.transition.toScreen.render(ctx)
        break
    }

    ctx.restore()
  }

  /**
   * Handle input for current screen
   */
  handleInput(event: KeyboardEvent | MouseEvent | TouchEvent): void {
    if (this.currentScreen && this.currentScreen.handleInput && !this.transition) {
      this.currentScreen.handleInput(event)
    }
  }

  /**
   * Get current screen
   */
  getCurrentScreen(): Screen | null {
    return this.currentScreen
  }

  /**
   * Get current screen type
   */
  getCurrentScreenType(): ScreenType | null {
    if (!this.currentScreen) return null

    for (const [type, screen] of this.screens.entries()) {
      if (screen === this.currentScreen) {
        return type
      }
    }

    return null
  }

  /**
   * Check if screen is active
   */
  isScreenActive(type: ScreenType): boolean {
    const screen = this.screens.get(type)
    return screen === this.currentScreen
  }

  /**
   * Check if transitioning
   */
  isTransitioning(): boolean {
    return this.transition !== null && this.transition.active
  }

  /**
   * Get screen stack size
   */
  getStackSize(): number {
    return this.screenStack.length
  }

  /**
   * Clear screen stack
   */
  clearStack(): void {
    this.screenStack.forEach((entry) => {
      entry.screen.exit()
    })
    this.screenStack = []
  }

  /**
   * Set default transition
   */
  setDefaultTransition(transition: ScreenTransition): void {
    this.defaultTransition = transition
  }

  /**
   * Get default transition
   */
  getDefaultTransition(): ScreenTransition {
    return { ...this.defaultTransition }
  }

  /**
   * Easing functions
   */
  static easings = {
    linear: (t: number): number => t,
    easeIn: (t: number): number => t * t,
    easeOut: (t: number): number => t * (2 - t),
    easeInOut: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t: number): number => t * t * t,
    easeOutCubic: (t: number): number => --t * t * t + 1,
    easeInOutCubic: (t: number): number =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  }

  /**
   * Pause all screens
   */
  pauseAll(): void {
    if (this.currentScreen && this.currentScreen.pause) {
      this.currentScreen.pause()
    }

    this.screenStack.forEach((entry) => {
      if (entry.screen.pause) {
        entry.screen.pause()
      }
    })
  }

  /**
   * Resume all screens
   */
  resumeAll(): void {
    if (this.currentScreen && this.currentScreen.resume) {
      this.currentScreen.resume()
    }

    this.screenStack.forEach((entry) => {
      if (entry.screen.resume) {
        entry.screen.resume()
      }
    })
  }

  /**
   * Get all registered screens
   */
  getAllScreens(): Map<ScreenType, Screen> {
    return new Map(this.screens)
  }

  /**
   * Clear all screens
   */
  clear(): void {
    if (this.currentScreen) {
      this.currentScreen.exit()
    }

    this.clearStack()
    this.screens.clear()
    this.currentScreen = null
    this.transition = null
  }
}

// Singleton instance
let screenManagerInstance: ScreenManager | null = null

export const getScreenManager = (): ScreenManager => {
  if (!screenManagerInstance) {
    screenManagerInstance = new ScreenManager()
  }
  return screenManagerInstance
}

export default ScreenManager

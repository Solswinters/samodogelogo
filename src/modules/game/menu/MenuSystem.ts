/**
 * Game menu navigation system
 */

export type MenuScreen = 'main' | 'play' | 'settings' | 'achievements' | 'leaderboard' | 'tutorial'

export interface MenuItem {
  id: string
  label: string
  action: () => void
  enabled: boolean
}

export class MenuSystem {
  private currentScreen: MenuScreen = 'main'
  private previousScreen: MenuScreen | null = null
  private screenStack: MenuScreen[] = []
  private callbacks: Map<MenuScreen, Set<() => void>> = new Map()

  navigateTo(screen: MenuScreen, pushToStack: boolean = true): void {
    if (pushToStack && this.currentScreen) {
      this.screenStack.push(this.currentScreen)
    }

    this.previousScreen = this.currentScreen
    this.currentScreen = screen

    this.triggerCallbacks(screen)
  }

  goBack(): boolean {
    const previous = this.screenStack.pop()
    if (previous) {
      this.previousScreen = this.currentScreen
      this.currentScreen = previous
      this.triggerCallbacks(this.currentScreen)
      return true
    }
    return false
  }

  getCurrentScreen(): MenuScreen {
    return this.currentScreen
  }

  getPreviousScreen(): MenuScreen | null {
    return this.previousScreen
  }

  onScreenEnter(screen: MenuScreen, callback: () => void): () => void {
    if (!this.callbacks.has(screen)) {
      this.callbacks.set(screen, new Set())
    }
    this.callbacks.get(screen)?.add(callback)

    return () => {
      this.callbacks.get(screen)?.delete(callback)
    }
  }

  private triggerCallbacks(screen: MenuScreen): void {
    const callbacks = this.callbacks.get(screen)
    if (callbacks) {
      callbacks.forEach(cb => cb())
    }
  }

  reset(): void {
    this.currentScreen = 'main'
    this.previousScreen = null
    this.screenStack = []
  }
}

/**
 * menuSystem utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of menuSystem.
 */
export const menuSystem = new MenuSystem()

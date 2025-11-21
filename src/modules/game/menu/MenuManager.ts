/**
 * Menu Manager - Handle game menus and UI navigation
 */

export interface MenuItem {
  id: string
  label: string
  action: () => void
  enabled: boolean
  visible: boolean
  icon?: string
  shortcut?: string
  submenu?: MenuItem[]
}

export interface MenuConfig {
  title: string
  subtitle?: string
  items: MenuItem[]
  background?: string
  theme?: 'light' | 'dark'
}

export class MenuManager {
  private menus: Map<string, MenuConfig> = new Map()
  private currentMenu: string | null = null
  private selectedIndex: number = 0
  private isActive: boolean = false
  private canvasWidth: number
  private canvasHeight: number

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.initializeDefaultMenus()
  }

  /**
   * Initialize default menus
   */
  private initializeDefaultMenus(): void {
    // Main menu
    this.addMenu('main', {
      title: 'SAMODOGELOGO',
      subtitle: 'Jump & Earn',
      items: [
        {
          id: 'play',
          label: 'Play',
          action: () => console.log('Start game'),
          enabled: true,
          visible: true,
        },
        {
          id: 'multiplayer',
          label: 'Multiplayer',
          action: () => this.showMenu('multiplayer'),
          enabled: true,
          visible: true,
        },
        {
          id: 'achievements',
          label: 'Achievements',
          action: () => this.showMenu('achievements'),
          enabled: true,
          visible: true,
        },
        {
          id: 'leaderboard',
          label: 'Leaderboard',
          action: () => this.showMenu('leaderboard'),
          enabled: true,
          visible: true,
        },
        {
          id: 'settings',
          label: 'Settings',
          action: () => this.showMenu('settings'),
          enabled: true,
          visible: true,
        },
        {
          id: 'quit',
          label: 'Quit',
          action: () => console.log('Quit game'),
          enabled: true,
          visible: true,
        },
      ],
      theme: 'dark',
    })

    // Settings menu
    this.addMenu('settings', {
      title: 'Settings',
      items: [
        {
          id: 'audio',
          label: 'Audio',
          action: () => this.showMenu('audio-settings'),
          enabled: true,
          visible: true,
        },
        {
          id: 'graphics',
          label: 'Graphics',
          action: () => this.showMenu('graphics-settings'),
          enabled: true,
          visible: true,
        },
        {
          id: 'controls',
          label: 'Controls',
          action: () => this.showMenu('controls-settings'),
          enabled: true,
          visible: true,
        },
        {
          id: 'back',
          label: 'Back',
          action: () => this.showMenu('main'),
          enabled: true,
          visible: true,
        },
      ],
      theme: 'dark',
    })

    // Pause menu
    this.addMenu('pause', {
      title: 'Paused',
      items: [
        {
          id: 'resume',
          label: 'Resume',
          action: () => console.log('Resume game'),
          enabled: true,
          visible: true,
        },
        {
          id: 'restart',
          label: 'Restart',
          action: () => console.log('Restart game'),
          enabled: true,
          visible: true,
        },
        {
          id: 'settings',
          label: 'Settings',
          action: () => this.showMenu('settings'),
          enabled: true,
          visible: true,
        },
        {
          id: 'quit-to-menu',
          label: 'Main Menu',
          action: () => this.showMenu('main'),
          enabled: true,
          visible: true,
        },
      ],
      theme: 'dark',
    })
  }

  /**
   * Add menu
   */
  addMenu(id: string, config: MenuConfig): void {
    this.menus.set(id, config)
  }

  /**
   * Show menu
   */
  showMenu(menuId: string): void {
    if (!this.menus.has(menuId)) {
      console.error(`Menu ${menuId} not found`)
      return
    }

    this.currentMenu = menuId
    this.selectedIndex = 0
    this.isActive = true
  }

  /**
   * Hide menu
   */
  hideMenu(): void {
    this.isActive = false
    this.currentMenu = null
  }

  /**
   * Navigate up
   */
  navigateUp(): void {
    if (!this.currentMenu) return

    const menu = this.menus.get(this.currentMenu)
    if (!menu) return

    const visibleItems = menu.items.filter((item) => item.visible && item.enabled)

    if (visibleItems.length === 0) return

    this.selectedIndex = (this.selectedIndex - 1 + visibleItems.length) % visibleItems.length
  }

  /**
   * Navigate down
   */
  navigateDown(): void {
    if (!this.currentMenu) return

    const menu = this.menus.get(this.currentMenu)
    if (!menu) return

    const visibleItems = menu.items.filter((item) => item.visible && item.enabled)

    if (visibleItems.length === 0) return

    this.selectedIndex = (this.selectedIndex + 1) % visibleItems.length
  }

  /**
   * Select current item
   */
  select(): void {
    if (!this.currentMenu) return

    const menu = this.menus.get(this.currentMenu)
    if (!menu) return

    const visibleItems = menu.items.filter((item) => item.visible && item.enabled)

    if (this.selectedIndex < visibleItems.length) {
      const item = visibleItems[this.selectedIndex]
      item.action()
    }
  }

  /**
   * Handle input
   */
  handleInput(event: KeyboardEvent): void {
    if (!this.isActive) return

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.navigateUp()
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        this.navigateDown()
        break
      case 'Enter':
      case ' ':
        this.select()
        break
      case 'Escape':
        if (this.currentMenu === 'pause') {
          this.select() // Resume game
        } else if (this.currentMenu !== 'main') {
          this.showMenu('main')
        }
        break
    }
  }

  /**
   * Render menu
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive || !this.currentMenu) return

    const menu = this.menus.get(this.currentMenu)
    if (!menu) return

    ctx.save()

    // Draw background overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

    // Draw title
    ctx.font = 'bold 48px sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.fillText(menu.title, this.canvasWidth / 2, 150)

    // Draw subtitle
    if (menu.subtitle) {
      ctx.font = '24px sans-serif'
      ctx.fillStyle = '#CCCCCC'
      ctx.fillText(menu.subtitle, this.canvasWidth / 2, 190)
    }

    // Draw menu items
    const visibleItems = menu.items.filter((item) => item.visible)
    const startY = 300
    const itemHeight = 60

    visibleItems.forEach((item, index) => {
      const y = startY + index * itemHeight
      const isSelected = index === this.selectedIndex && item.enabled
      const isEnabled = item.enabled

      // Draw selection box
      if (isSelected) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
        ctx.fillRect(this.canvasWidth / 2 - 200, y - 35, 400, 50)
      }

      // Draw item text
      ctx.font = '28px sans-serif'
      ctx.fillStyle = isEnabled ? '#FFFFFF' : '#666666'

      if (isSelected && isEnabled) {
        ctx.fillStyle = '#3B82F6'
      }

      ctx.fillText(item.label, this.canvasWidth / 2, y)

      // Draw icon if present
      if (item.icon) {
        ctx.font = '24px sans-serif'
        ctx.fillText(item.icon, this.canvasWidth / 2 - 220, y)
      }

      // Draw shortcut if present
      if (item.shortcut && isEnabled) {
        ctx.font = '16px sans-serif'
        ctx.fillStyle = '#999999'
        ctx.fillText(item.shortcut, this.canvasWidth / 2 + 220, y)
      }
    })

    // Draw controls hint
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#999999'
    ctx.textAlign = 'center'
    ctx.fillText(
      '↑↓ Navigate | ENTER Select | ESC Back',
      this.canvasWidth / 2,
      this.canvasHeight - 30
    )

    ctx.restore()
  }

  /**
   * Update menu item
   */
  updateMenuItem(menuId: string, itemId: string, updates: Partial<MenuItem>): void {
    const menu = this.menus.get(menuId)

    if (!menu) return

    const item = menu.items.find((i) => i.id === itemId)

    if (item) {
      Object.assign(item, updates)
    }
  }

  /**
   * Enable/disable menu item
   */
  setMenuItemEnabled(menuId: string, itemId: string, enabled: boolean): void {
    this.updateMenuItem(menuId, itemId, { enabled })
  }

  /**
   * Show/hide menu item
   */
  setMenuItemVisible(menuId: string, itemId: string, visible: boolean): void {
    this.updateMenuItem(menuId, itemId, { visible })
  }

  /**
   * Get current menu
   */
  getCurrentMenu(): string | null {
    return this.currentMenu
  }

  /**
   * Check if menu is active
   */
  isMenuActive(): boolean {
    return this.isActive
  }

  /**
   * Get selected item
   */
  getSelectedItem(): MenuItem | null {
    if (!this.currentMenu) return null

    const menu = this.menus.get(this.currentMenu)
    if (!menu) return null

    const visibleItems = menu.items.filter((item) => item.visible && item.enabled)

    if (this.selectedIndex < visibleItems.length) {
      return visibleItems[this.selectedIndex]
    }

    return null
  }

  /**
   * Set canvas size
   */
  setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width
    this.canvasHeight = height
  }

  /**
   * Clear all menus
   */
  clear(): void {
    this.menus.clear()
  }

  /**
   * Reset to default menus
   */
  reset(): void {
    this.clear()
    this.initializeDefaultMenus()
    this.currentMenu = null
    this.selectedIndex = 0
    this.isActive = false
  }
}

export default MenuManager

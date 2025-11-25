/**
 * Save Manager - Handle game save, load, and cloud sync
 */

export interface SaveData {
  version: string
  timestamp: number
  player: {
    id: string
    name: string
    level: number
    experience: number
    coins: number
    tokens: number
  }
  progress: {
    highScore: number
    totalGamesPlayed: number
    totalDistance: number
    totalCoinsCollected: number
    totalPowerUpsCollected: number
  }
  achievements: Array<{
    id: string
    unlockedAt: number
  }>
  settings: {
    soundVolume: number
    musicVolume: number
    difficulty: string
    language: string
    theme: string
  }
  statistics: {
    averageScore: number
    longestRun: number
    favoriteCharacter?: string
    playTime: number
  }
  inventory: Array<{
    itemId: string
    quantity: number
    equippedAt?: number
  }>
  unlocks: string[]
}

export interface SaveSlot {
  id: number
  name: string
  data: SaveData | null
  lastModified: number
  isCloud: boolean
}

export class SaveManager {
  private currentSave: SaveData | null = null
  private saveSlots: SaveSlot[] = []
  private maxSlots: number = 3
  private storageKey: string = 'game-save'
  private version: string = '1.0.0'
  private autoSaveInterval: number = 30000 // 30 seconds
  private autoSaveTimer?: NodeJS.Timeout

  constructor() {
    this.initializeSlots()
  }

  /**
   * Initialize save slots
   */
  private initializeSlots(): void {
    for (let i = 0; i < this.maxSlots; i++) {
      this.saveSlots.push({
        id: i,
        name: `Save ${i + 1}`,
        data: null,
        lastModified: 0,
        isCloud: false,
      })
    }

    this.loadSlots()
  }

  /**
   * Create new save data
   */
  createNewSave(playerId: string, playerName: string): SaveData {
    return {
      version: this.version,
      timestamp: Date.now(),
      player: {
        id: playerId,
        name: playerName,
        level: 1,
        experience: 0,
        coins: 0,
        tokens: 0,
      },
      progress: {
        highScore: 0,
        totalGamesPlayed: 0,
        totalDistance: 0,
        totalCoinsCollected: 0,
        totalPowerUpsCollected: 0,
      },
      achievements: [],
      settings: {
        soundVolume: 1.0,
        musicVolume: 0.7,
        difficulty: 'normal',
        language: 'en',
        theme: 'default',
      },
      statistics: {
        averageScore: 0,
        longestRun: 0,
        playTime: 0,
      },
      inventory: [],
      unlocks: [],
    }
  }

  /**
   * Save to slot
   */
  save(slotId: number, data?: SaveData): boolean {
    const slot = this.saveSlots[slotId]

    if (!slot) {
      console.error(`Save slot ${slotId} not found`)
      return false
    }

    const saveData = data || this.currentSave

    if (!saveData) {
      console.error('No save data to save')
      return false
    }

    saveData.timestamp = Date.now()
    saveData.version = this.version

    slot.data = saveData
    slot.lastModified = Date.now()

    this.currentSave = saveData
    this.persistSlots()

    console.log(`Game saved to slot ${slotId}`)
    return true
  }

  /**
   * Load from slot
   */
  load(slotId: number): SaveData | null {
    const slot = this.saveSlots[slotId]

    if (!slot || !slot.data) {
      console.error(`Save slot ${slotId} is empty`)
      return null
    }

    // Validate version
    if (slot.data.version !== this.version) {
      console.warn(`Save data version mismatch. Attempting migration...`)
      slot.data = this.migrateSaveData(slot.data)
    }

    this.currentSave = slot.data
    console.log(`Game loaded from slot ${slotId}`)

    return slot.data
  }

  /**
   * Delete save slot
   */
  deleteSave(slotId: number): boolean {
    const slot = this.saveSlots[slotId]

    if (!slot) {
      return false
    }

    slot.data = null
    slot.lastModified = 0

    this.persistSlots()

    console.log(`Save slot ${slotId} deleted`)
    return true
  }

  /**
   * Auto-save functionality
   */
  enableAutoSave(): void {
    if (this.autoSaveTimer) {
      return
    }

    this.autoSaveTimer = setInterval(() => {
      if (this.currentSave) {
        this.autoSave()
      }
    }, this.autoSaveInterval)

    console.log('Auto-save enabled')
  }

  /**
   * Disable auto-save
   */
  disableAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = undefined
      console.log('Auto-save disabled')
    }
  }

  /**
   * Perform auto-save
   */
  private autoSave(): void {
    // Find the most recent save slot
    let mostRecentSlot = 0
    let mostRecentTime = 0

    this.saveSlots.forEach((slot, index) => {
      if (slot.data && slot.lastModified > mostRecentTime) {
        mostRecentSlot = index
        mostRecentTime = slot.lastModified
      }
    })

    this.save(mostRecentSlot)
    console.log('Auto-saved')
  }

  /**
   * Persist slots to storage
   */
  private persistSlots(): void {
    if (typeof localStorage === 'undefined') {
      return
    }

    try {
      const data = JSON.stringify(this.saveSlots)
      localStorage.setItem(this.storageKey, data)
    } catch (error) {
      console.error('Failed to persist save data:', error)
    }
  }

  /**
   * Load slots from storage
   */
  private loadSlots(): void {
    if (typeof localStorage === 'undefined') {
      return
    }

    try {
      const data = localStorage.getItem(this.storageKey)

      if (data) {
        const slots = JSON.parse(data) as SaveSlot[]
        this.saveSlots = slots
      }
    } catch (error) {
      console.error('Failed to load save data:', error)
    }
  }

  /**
   * Migrate old save data to new version
   */
  private migrateSaveData(oldData: SaveData): SaveData {
    // Create new save with defaults
    const newData = this.createNewSave(
      oldData.player?.id || 'unknown',
      oldData.player?.name || 'Player'
    )

    // Copy over compatible data
    return {
      ...newData,
      ...oldData,
      version: this.version,
    }
  }

  /**
   * Export save data as JSON
   */
  exportSave(slotId: number): string | null {
    const slot = this.saveSlots[slotId]

    if (!slot || !slot.data) {
      return null
    }

    return JSON.stringify(slot.data, null, 2)
  }

  /**
   * Import save data from JSON
   */
  importSave(slotId: number, jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as SaveData

      // Validate data structure
      if (!this.validateSaveData(data)) {
        console.error('Invalid save data')
        return false
      }

      return this.save(slotId, data)
    } catch (error) {
      console.error('Failed to import save data:', error)
      return false
    }
  }

  /**
   * Validate save data structure
   */
  private validateSaveData(data: any): boolean {
    return !!(
      data &&
      data.player &&
      data.progress &&
      data.settings &&
      typeof data.player.id === 'string' &&
      typeof data.player.name === 'string'
    )
  }

  /**
   * Get all save slots
   */
  getSlots(): SaveSlot[] {
    return [...this.saveSlots]
  }

  /**
   * Get current save
   */
  getCurrentSave(): SaveData | null {
    return this.currentSave
  }

  /**
   * Update current save
   */
  updateCurrentSave(updates: Partial<SaveData>): void {
    if (!this.currentSave) {
      return
    }

    this.currentSave = {
      ...this.currentSave,
      ...updates,
      timestamp: Date.now(),
    }
  }

  /**
   * Update player data
   */
  updatePlayer(updates: Partial<SaveData['player']>): void {
    if (!this.currentSave) {
      return
    }

    this.currentSave.player = {
      ...this.currentSave.player,
      ...updates,
    }
  }

  /**
   * Update progress
   */
  updateProgress(updates: Partial<SaveData['progress']>): void {
    if (!this.currentSave) {
      return
    }

    this.currentSave.progress = {
      ...this.currentSave.progress,
      ...updates,
    }
  }

  /**
   * Update settings
   */
  updateSettings(updates: Partial<SaveData['settings']>): void {
    if (!this.currentSave) {
      return
    }

    this.currentSave.settings = {
      ...this.currentSave.settings,
      ...updates,
    }
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievementId: string): void {
    if (!this.currentSave) {
      return
    }

    // Check if already unlocked
    if (this.currentSave.achievements.some((a) => a.id === achievementId)) {
      return
    }

    this.currentSave.achievements.push({
      id: achievementId,
      unlockedAt: Date.now(),
    })
  }

  /**
   * Add item to inventory
   */
  addItemToInventory(itemId: string, quantity: number = 1): void {
    if (!this.currentSave) {
      return
    }

    const existingItem = this.currentSave.inventory.find((i) => i.itemId === itemId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.currentSave.inventory.push({
        itemId,
        quantity,
      })
    }
  }

  /**
   * Remove item from inventory
   */
  removeItemFromInventory(itemId: string, quantity: number = 1): boolean {
    if (!this.currentSave) {
      return false
    }

    const existingItem = this.currentSave.inventory.find((i) => i.itemId === itemId)

    if (!existingItem || existingItem.quantity < quantity) {
      return false
    }

    existingItem.quantity -= quantity

    if (existingItem.quantity <= 0) {
      this.currentSave.inventory = this.currentSave.inventory.filter((i) => i.itemId !== itemId)
    }

    return true
  }

  /**
   * Add unlock
   */
  addUnlock(unlockId: string): void {
    if (!this.currentSave) {
      return
    }

    if (!this.currentSave.unlocks.includes(unlockId)) {
      this.currentSave.unlocks.push(unlockId)
    }
  }

  /**
   * Check if unlocked
   */
  isUnlocked(unlockId: string): boolean {
    if (!this.currentSave) {
      return false
    }

    return this.currentSave.unlocks.includes(unlockId)
  }

  /**
   * Clear all save data
   */
  clearAll(): void {
    this.saveSlots.forEach((slot) => {
      slot.data = null
      slot.lastModified = 0
    })

    this.currentSave = null
    this.persistSlots()

    console.log('All save data cleared')
  }

  /**
   * Get save summary
   */
  getSaveSummary(slotId: number): {
    exists: boolean
    playerName?: string
    level?: number
    highScore?: number
    lastModified?: number
  } | null {
    const slot = this.saveSlots[slotId]

    if (!slot) {
      return null
    }

    if (!slot.data) {
      return { exists: false }
    }

    return {
      exists: true,
      playerName: slot.data.player.name,
      level: slot.data.player.level,
      highScore: slot.data.progress.highScore,
      lastModified: slot.lastModified,
    }
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    this.disableAutoSave()
  }
}

// Singleton instance
let saveManagerInstance: SaveManager | null = null

/**
 * getSaveManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getSaveManager.
 */
export const getSaveManager = (): SaveManager => {
  if (!saveManagerInstance) {
    saveManagerInstance = new SaveManager()
  }
  return saveManagerInstance
}

export default SaveManager

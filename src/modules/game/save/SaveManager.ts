/**
 * Game save/load system
 */

import { storage } from '@/shared/storage'

export interface SaveData {
  version: string
  player: {
    highScore: number
    totalGames: number
    totalScore: number
    totalTime: number
  }
  settings: {
    soundEnabled: boolean
    musicEnabled: boolean
    soundVolume: number
    musicVolume: number
    difficulty: string
  }
  achievements: Array<{
    id: string
    unlocked: boolean
    unlockedAt?: number
  }>
  stats: {
    longestRun: number
    maxCombo: number
    totalJumps: number
    totalObstaclesPassed: number
  }
  lastPlayed: number
}

export class SaveManager {
  private static readonly SAVE_KEY = 'jump-game-save'
  private static readonly VERSION = '1.0.0'

  save(data: Partial<SaveData>): boolean {
    const current = this.load()

    const saveData: SaveData = {
      version: SaveManager.VERSION,
      player: { ...current.player, ...data.player },
      settings: { ...current.settings, ...data.settings },
      achievements: data.achievements || current.achievements,
      stats: { ...current.stats, ...data.stats },
      lastPlayed: Date.now(),
    }

    return storage.set(SaveManager.SAVE_KEY, saveData)
  }

  load(): SaveData {
    const defaultData: SaveData = {
      version: SaveManager.VERSION,
      player: {
        highScore: 0,
        totalGames: 0,
        totalScore: 0,
        totalTime: 0,
      },
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        soundVolume: 0.7,
        musicVolume: 0.5,
        difficulty: 'normal',
      },
      achievements: [],
      stats: {
        longestRun: 0,
        maxCombo: 0,
        totalJumps: 0,
        totalObstaclesPassed: 0,
      },
      lastPlayed: 0,
    }

    const saved = storage.get<SaveData>(SaveManager.SAVE_KEY, defaultData)

    // Migrate old versions if needed
    if (saved.version !== SaveManager.VERSION) {
      return this.migrate(saved)
    }

    return saved
  }

  private migrate(oldData: SaveData): SaveData {
    // Handle version migrations here
    return {
      ...oldData,
      version: SaveManager.VERSION,
    }
  }

  clear(): boolean {
    return storage.remove(SaveManager.SAVE_KEY)
  }

  exists(): boolean {
    return storage.has(SaveManager.SAVE_KEY)
  }

  export(): string {
    const data = this.load()
    return JSON.stringify(data, null, 2)
  }

  import(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as SaveData
      return this.save(data)
    } catch {
      return false
    }
  }
}

export const saveManager = new SaveManager()

/**
 * Upgrade system for player progression
 */

export type UpgradeCategory = 'speed' | 'jump' | 'health' | 'damage' | 'special'

export interface UpgradeConfig {
  id: string
  name: string
  description: string
  category: UpgradeCategory
  maxLevel: number
  baseCost: number
  costMultiplier: number
  baseEffect: number
  effectMultiplier: number
}

export class Upgrade {
  id: string
  name: string
  description: string
  category: UpgradeCategory
  maxLevel: number
  currentLevel: number
  baseCost: number
  costMultiplier: number
  baseEffect: number
  effectMultiplier: number

  constructor(config: UpgradeConfig) {
    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.category = config.category
    this.maxLevel = config.maxLevel
    this.currentLevel = 0
    this.baseCost = config.baseCost
    this.costMultiplier = config.costMultiplier
    this.baseEffect = config.baseEffect
    this.effectMultiplier = config.effectMultiplier
  }

  getCostForLevel(level: number): number {
    if (level === 0) return this.baseCost
    return Math.floor(this.baseCost * Math.pow(this.costMultiplier, level - 1))
  }

  getNextCost(): number {
    return this.getCostForLevel(this.currentLevel + 1)
  }

  getEffectForLevel(level: number): number {
    if (level === 0) return 0
    return this.baseEffect + this.effectMultiplier * (level - 1)
  }

  getCurrentEffect(): number {
    return this.getEffectForLevel(this.currentLevel)
  }

  canUpgrade(): boolean {
    return this.currentLevel < this.maxLevel
  }

  upgrade(): boolean {
    if (!this.canUpgrade()) {
      return false
    }

    this.currentLevel++
    return true
  }

  getProgress(): number {
    return (this.currentLevel / this.maxLevel) * 100
  }

  isMaxLevel(): boolean {
    return this.currentLevel >= this.maxLevel
  }

  reset(): void {
    this.currentLevel = 0
  }
}

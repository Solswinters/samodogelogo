/**
 * Manager for player upgrades
 */

import { Upgrade, UpgradeCategory, UpgradeConfig } from './Upgrade'

export class UpgradeManager {
  private upgrades: Map<string, Upgrade>
  private currency: number

  constructor() {
    this.upgrades = new Map()
    this.currency = 0
  }

  addUpgrade(config: UpgradeConfig): Upgrade {
    const upgrade = new Upgrade(config)
    this.upgrades.set(config.id, upgrade)
    return upgrade
  }

  getUpgrade(id: string): Upgrade | undefined {
    return this.upgrades.get(id)
  }

  getAllUpgrades(): Upgrade[] {
    return Array.from(this.upgrades.values())
  }

  getUpgradesByCategory(category: UpgradeCategory): Upgrade[] {
    return this.getAllUpgrades().filter(upgrade => upgrade.category === category)
  }

  purchaseUpgrade(id: string): boolean {
    const upgrade = this.upgrades.get(id)
    if (!upgrade || !upgrade.canUpgrade()) {
      return false
    }

    const cost = upgrade.getNextCost()
    if (this.currency < cost) {
      return false
    }

    this.currency -= cost
    return upgrade.upgrade()
  }

  addCurrency(amount: number): void {
    this.currency += amount
  }

  getCurrency(): number {
    return this.currency
  }

  canAfford(id: string): boolean {
    const upgrade = this.upgrades.get(id)
    if (!upgrade || !upgrade.canUpgrade()) {
      return false
    }

    return this.currency >= upgrade.getNextCost()
  }

  getTotalEffectByCategory(category: UpgradeCategory): number {
    return this.getUpgradesByCategory(category).reduce(
      (total, upgrade) => total + upgrade.getCurrentEffect(),
      0
    )
  }

  resetAll(): void {
    for (const upgrade of this.upgrades.values()) {
      upgrade.reset()
    }
  }

  getStats() {
    return {
      currency: this.currency,
      totalUpgrades: this.upgrades.size,
      maxedUpgrades: this.getAllUpgrades().filter(u => u.isMaxLevel()).length,
      totalInvested: this.getAllUpgrades().reduce((sum, u) => {
        let total = 0
        for (let i = 1; i <= u.currentLevel; i++) {
          total += u.getCostForLevel(i)
        }
        return sum + total
      }, 0),
    }
  }
}

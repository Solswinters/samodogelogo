/**
 * Manager for active buffs and debuffs
 */

import { Buff, BuffConfig, BuffType } from './Buff'

export class BuffManager {
  private buffs: Map<string, Buff>

  constructor() {
    this.buffs = new Map()
  }

  addBuff(config: BuffConfig): Buff {
    const existingBuff = this.buffs.get(config.id)

    // If buff exists and can stack, add stack
    if (existingBuff && existingBuff.stacks) {
      if (existingBuff.addStack()) {
        return existingBuff
      }
    }

    // Otherwise refresh or create new buff
    if (existingBuff) {
      existingBuff.refresh()
      return existingBuff
    }

    const newBuff = new Buff(config)
    this.buffs.set(config.id, newBuff)
    return newBuff
  }

  removeBuff(buffId: string): void {
    this.buffs.delete(buffId)
  }

  hasBuff(buffId: string): boolean {
    return this.buffs.has(buffId)
  }

  getBuff(buffId: string): Buff | undefined {
    return this.buffs.get(buffId)
  }

  getBuffsByType(type: BuffType): Buff[] {
    return Array.from(this.buffs.values()).filter(buff => buff.type === type)
  }

  getAllBuffs(): Buff[] {
    return Array.from(this.buffs.values())
  }

  update(deltaTime: number): void {
    const expiredBuffs: string[] = []

    for (const [id, buff] of this.buffs.entries()) {
      const stillActive = buff.update(deltaTime)

      if (!stillActive) {
        expiredBuffs.push(id)
      }
    }

    // Remove expired buffs
    expiredBuffs.forEach(id => this.buffs.delete(id))
  }

  getTotalModifier(type: BuffType): number {
    const buffs = this.getBuffsByType(type)
    return buffs.reduce((total, buff) => total + buff.getTotalValue(), 0)
  }

  clear(): void {
    this.buffs.clear()
  }

  getActiveCount(): number {
    return this.buffs.size
  }
}

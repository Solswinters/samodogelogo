/**
 * Damage calculation system for game mechanics
 */

export interface DamageModifiers {
  critical?: boolean
  multiplier?: number
  damageType?: 'normal' | 'fire' | 'ice' | 'lightning'
  resistance?: number
}

export interface DamageResult {
  baseDamage: number
  finalDamage: number
  critical: boolean
  blocked: boolean
  modifiers: string[]
}

export class DamageCalculator {
  private criticalChance: number
  private criticalMultiplier: number

  constructor(criticalChance = 0.1, criticalMultiplier = 2) {
    this.criticalChance = criticalChance
    this.criticalMultiplier = criticalMultiplier
  }

  calculate(baseDamage: number, modifiers: DamageModifiers = {}): DamageResult {
    let finalDamage = baseDamage
    const appliedModifiers: string[] = []

    // Apply multiplier
    if (modifiers.multiplier) {
      finalDamage *= modifiers.multiplier
      appliedModifiers.push(`${modifiers.multiplier}x multiplier`)
    }

    // Check for critical hit
    const isCritical = modifiers.critical ?? Math.random() < this.criticalChance
    if (isCritical) {
      finalDamage *= this.criticalMultiplier
      appliedModifiers.push('Critical hit')
    }

    // Apply resistance
    if (modifiers.resistance) {
      const reduction = Math.min(modifiers.resistance, 0.9) // Max 90% reduction
      finalDamage *= 1 - reduction
      appliedModifiers.push(`${(reduction * 100).toFixed(0)}% resistance`)
    }

    return {
      baseDamage,
      finalDamage: Math.round(finalDamage),
      critical: isCritical,
      blocked: false,
      modifiers: appliedModifiers,
    }
  }

  setCriticalChance(chance: number): void {
    this.criticalChance = Math.max(0, Math.min(1, chance))
  }

  setCriticalMultiplier(multiplier: number): void {
    this.criticalMultiplier = Math.max(1, multiplier)
  }
}

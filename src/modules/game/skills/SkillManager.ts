/**
 * Manager for player skills
 */

import { Skill, SkillConfig } from './Skill'

export class SkillManager {
  private skills: Map<string, Skill>
  private equippedSkills: Set<string>
  private maxEquipped: number
  private mana: number
  private maxMana: number
  private manaRegen: number

  constructor(maxEquipped = 4, maxMana = 100, manaRegen = 10) {
    this.skills = new Map()
    this.equippedSkills = new Set()
    this.maxEquipped = maxEquipped
    this.mana = maxMana
    this.maxMana = maxMana
    this.manaRegen = manaRegen
  }

  addSkill(config: SkillConfig): Skill {
    const skill = new Skill(config)
    this.skills.set(config.id, skill)
    return skill
  }

  equipSkill(skillId: string): boolean {
    if (!this.skills.has(skillId)) {
      return false
    }

    if (this.equippedSkills.size >= this.maxEquipped) {
      return false
    }

    this.equippedSkills.add(skillId)
    return true
  }

  unequipSkill(skillId: string): void {
    this.equippedSkills.delete(skillId)
  }

  useSkill(skillId: string): boolean {
    const skill = this.skills.get(skillId)
    if (!skill || !this.equippedSkills.has(skillId)) {
      return false
    }

    const currentTime = Date.now()
    if (!skill.canUse(currentTime, this.mana)) {
      return false
    }

    this.mana -= skill.manaCost
    return skill.use(currentTime)
  }

  update(deltaTime: number): void {
    const currentTime = Date.now()

    // Update all skills
    for (const skill of this.skills.values()) {
      skill.update(currentTime)
    }

    // Regenerate mana
    const manaGain = (this.manaRegen * deltaTime) / 1000
    this.mana = Math.min(this.mana + manaGain, this.maxMana)
  }

  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId)
  }

  getEquippedSkills(): Skill[] {
    return Array.from(this.equippedSkills)
      .map(id => this.skills.get(id))
      .filter((skill): skill is Skill => skill !== undefined)
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values())
  }

  getMana(): number {
    return this.mana
  }

  getManaPercent(): number {
    return (this.mana / this.maxMana) * 100
  }

  restoreMana(amount: number): void {
    this.mana = Math.min(this.mana + amount, this.maxMana)
  }

  reset(): void {
    this.mana = this.maxMana
    for (const skill of this.skills.values()) {
      skill.deactivate()
    }
  }
}

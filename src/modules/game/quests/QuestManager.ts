/**
 * Quest manager for tracking active quests
 */

import { Quest, QuestConfig } from './Quest'

export class QuestManager {
  private quests: Map<string, Quest>
  private completedQuests: Set<string>

  constructor() {
    this.quests = new Map()
    this.completedQuests = new Set()
  }

  addQuest(config: QuestConfig): Quest {
    const quest = new Quest(config)
    this.quests.set(quest.id, quest)
    return quest
  }

  removeQuest(questId: string): void {
    this.quests.delete(questId)
  }

  getQuest(questId: string): Quest | undefined {
    return this.quests.get(questId)
  }

  getActiveQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(quest => quest.status === 'active')
  }

  getCompletedQuests(): Quest[] {
    return Array.from(this.quests.values()).filter(quest => quest.status === 'completed')
  }

  updateQuestObjective(questId: string, objectiveId: string, progress: number): boolean {
    const quest = this.quests.get(questId)
    if (!quest) {
      return false
    }

    const completed = quest.updateObjective(objectiveId, progress)

    if (quest.isCompleted() && !this.completedQuests.has(questId)) {
      this.completedQuests.add(questId)
      this.onQuestCompleted(quest)
    }

    return completed
  }

  private onQuestCompleted(quest: Quest): void {
    // This can be extended to emit events or trigger rewards
    console.log(`Quest completed: ${quest.title}`)

    if (!quest.repeatable) {
      // Keep completed non-repeatable quests for history
    } else {
      // Optionally auto-restart repeatable quests
    }
  }

  resetQuest(questId: string): boolean {
    const quest = this.quests.get(questId)
    if (!quest || !quest.repeatable) {
      return false
    }

    quest.reset()
    this.completedQuests.delete(questId)
    return true
  }

  clear(): void {
    this.quests.clear()
    this.completedQuests.clear()
  }

  getStats() {
    return {
      total: this.quests.size,
      active: this.getActiveQuests().length,
      completed: this.completedQuests.size,
    }
  }
}

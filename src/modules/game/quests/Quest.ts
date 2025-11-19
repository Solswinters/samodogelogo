/**
 * Quest system for player objectives
 */

export interface QuestObjective {
  id: string
  description: string
  type: 'collect' | 'defeat' | 'reach' | 'survive'
  target: number
  current: number
  completed: boolean
}

export interface QuestReward {
  type: 'score' | 'powerup' | 'achievement'
  amount: number
  itemId?: string
}

export interface QuestConfig {
  id: string
  title: string
  description: string
  objectives: Omit<QuestObjective, 'current' | 'completed'>[]
  rewards: QuestReward[]
  repeatable?: boolean
}

export class Quest {
  id: string
  title: string
  description: string
  objectives: QuestObjective[]
  rewards: QuestReward[]
  repeatable: boolean
  status: 'active' | 'completed' | 'failed'
  startTime: number
  completionTime?: number

  constructor(config: QuestConfig) {
    this.id = config.id
    this.title = config.title
    this.description = config.description
    this.objectives = config.objectives.map(obj => ({
      ...obj,
      current: 0,
      completed: false,
    }))
    this.rewards = config.rewards
    this.repeatable = config.repeatable ?? false
    this.status = 'active'
    this.startTime = Date.now()
  }

  updateObjective(objectiveId: string, progress: number): boolean {
    const objective = this.objectives.find(obj => obj.id === objectiveId)
    if (!objective || objective.completed) {
      return false
    }

    objective.current = Math.min(objective.current + progress, objective.target)
    objective.completed = objective.current >= objective.target

    this.checkCompletion()
    return objective.completed
  }

  private checkCompletion(): void {
    if (this.status === 'completed') {
      return
    }

    const allCompleted = this.objectives.every(obj => obj.completed)
    if (allCompleted) {
      this.status = 'completed'
      this.completionTime = Date.now()
    }
  }

  getProgress(): number {
    const total = this.objectives.reduce((sum, obj) => sum + obj.target, 0)
    const current = this.objectives.reduce((sum, obj) => sum + obj.current, 0)
    return total > 0 ? (current / total) * 100 : 0
  }

  reset(): void {
    if (!this.repeatable) {
      return
    }

    this.objectives.forEach(obj => {
      obj.current = 0
      obj.completed = false
    })
    this.status = 'active'
    this.startTime = Date.now()
    this.completionTime = undefined
  }

  fail(): void {
    this.status = 'failed'
    this.completionTime = Date.now()
  }

  isCompleted(): boolean {
    return this.status === 'completed'
  }

  getDuration(): number {
    const endTime = this.completionTime ?? Date.now()
    return endTime - this.startTime
  }
}

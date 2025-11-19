/**
 * Tutorial system for first-time players
 */

export interface TutorialStep {
  id: string
  title: string
  description: string
  trigger: 'manual' | 'auto' | 'event'
  completed: boolean
  order: number
}

export class TutorialManager {
  private steps: Map<string, TutorialStep> = new Map()
  private currentStep: string | null = null
  private enabled: boolean = true
  private completedSteps: Set<string> = new Set()

  initialize(): void {
    this.addStep({
      id: 'welcome',
      title: 'Welcome!',
      description: 'Press SPACE or click to jump',
      trigger: 'auto',
      completed: false,
      order: 1,
    })

    this.addStep({
      id: 'first-jump',
      title: 'Great!',
      description: 'Keep jumping to avoid obstacles',
      trigger: 'event',
      completed: false,
      order: 2,
    })

    this.addStep({
      id: 'scoring',
      title: 'Score Points',
      description: 'Each obstacle you pass earns points',
      trigger: 'event',
      completed: false,
      order: 3,
    })

    this.addStep({
      id: 'combo',
      title: 'Build Combos',
      description: 'Chain successful jumps for bonus multipliers',
      trigger: 'event',
      completed: false,
      order: 4,
    })
  }

  addStep(step: TutorialStep): void {
    this.steps.set(step.id, step)
  }

  completeStep(stepId: string): boolean {
    const step = this.steps.get(stepId)
    if (!step) return false

    step.completed = true
    this.completedSteps.add(stepId)

    // Auto-advance to next step
    this.advanceToNextStep()
    return true
  }

  private advanceToNextStep(): void {
    const sortedSteps = Array.from(this.steps.values()).sort((a, b) => a.order - b.order)

    for (const step of sortedSteps) {
      if (!step.completed) {
        this.currentStep = step.id
        return
      }
    }

    this.currentStep = null
  }

  getCurrentStep(): TutorialStep | null {
    if (!this.currentStep) return null
    return this.steps.get(this.currentStep) || null
  }

  isComplete(): boolean {
    return Array.from(this.steps.values()).every(step => step.completed)
  }

  reset(): void {
    this.steps.forEach(step => {
      step.completed = false
    })
    this.completedSteps.clear()
    this.currentStep = null
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }
}

export const tutorialManager = new TutorialManager()

/**
 * Tutorial Manager - Interactive tutorial system for new players
 */

export interface TutorialStep {
  id: string
  title: string
  description: string
  action: 'jump' | 'collect' | 'avoid' | 'wait' | 'custom'
  target?: string
  highlight?: {
    x: number
    y: number
    width: number
    height: number
  }
  arrow?: {
    x: number
    y: number
    direction: 'up' | 'down' | 'left' | 'right'
  }
  duration?: number
  skippable?: boolean
  completed: boolean
}

export interface TutorialConfig {
  enabled: boolean
  autoStart: boolean
  showOnFirstPlay: boolean
  steps: Omit<TutorialStep, 'completed'>[]
}

export class TutorialManager {
  private config: TutorialConfig
  private steps: TutorialStep[]
  private currentStepIndex: number = -1
  private isActive: boolean = false
  private isPaused: boolean = false
  private hasSeenTutorial: boolean = false
  private onComplete?: () => void
  private onSkip?: () => void
  private onStepChange?: (step: TutorialStep) => void

  constructor(config: TutorialConfig) {
    this.config = config
    this.steps = config.steps.map((step) => ({
      ...step,
      completed: false,
    }))
    this.loadProgress()
  }

  /**
   * Start tutorial
   */
  start(): void {
    if (!this.config.enabled) {
      return
    }

    // Check if should show tutorial
    if (this.config.showOnFirstPlay && this.hasSeenTutorial) {
      return
    }

    this.isActive = true
    this.currentStepIndex = 0
    this.notifyStepChange()
  }

  /**
   * Stop tutorial
   */
  stop(): void {
    this.isActive = false
    this.currentStepIndex = -1
    this.saveProgress()
  }

  /**
   * Pause tutorial
   */
  pause(): void {
    this.isPaused = true
  }

  /**
   * Resume tutorial
   */
  resume(): void {
    this.isPaused = false
  }

  /**
   * Complete current step
   */
  completeCurrentStep(): void {
    if (!this.isActive || this.currentStepIndex < 0) {
      return
    }

    const currentStep = this.steps[this.currentStepIndex]

    if (currentStep) {
      currentStep.completed = true
      this.nextStep()
    }
  }

  /**
   * Move to next step
   */
  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++
      this.notifyStepChange()
    } else {
      this.completeTutorial()
    }
  }

  /**
   * Move to previous step
   */
  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--
      this.notifyStepChange()
    }
  }

  /**
   * Go to specific step
   */
  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStepIndex = stepIndex
      this.notifyStepChange()
    }
  }

  /**
   * Skip tutorial
   */
  skip(): void {
    this.isActive = false
    this.hasSeenTutorial = true
    this.saveProgress()

    if (this.onSkip) {
      this.onSkip()
    }
  }

  /**
   * Complete tutorial
   */
  private completeTutorial(): void {
    this.isActive = false
    this.hasSeenTutorial = true
    this.saveProgress()

    if (this.onComplete) {
      this.onComplete()
    }
  }

  /**
   * Notify step change
   */
  private notifyStepChange(): void {
    const currentStep = this.getCurrentStep()

    if (currentStep && this.onStepChange) {
      this.onStepChange(currentStep)
    }
  }

  /**
   * Handle player action
   */
  handleAction(action: TutorialStep['action']): void {
    if (!this.isActive || this.isPaused) {
      return
    }

    const currentStep = this.getCurrentStep()

    if (currentStep && currentStep.action === action) {
      this.completeCurrentStep()
    }
  }

  /**
   * Update tutorial (for timed steps)
   */
  update(deltaTime: number): void {
    if (!this.isActive || this.isPaused) {
      return
    }

    const currentStep = this.getCurrentStep()

    if (currentStep && currentStep.action === 'wait' && currentStep.duration) {
      // Auto-complete after duration
      currentStep.duration -= deltaTime

      if (currentStep.duration <= 0) {
        this.completeCurrentStep()
      }
    }
  }

  /**
   * Render tutorial UI
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) {
      return
    }

    const currentStep = this.getCurrentStep()

    if (!currentStep) {
      return
    }

    ctx.save()

    // Darken background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Highlight target area
    if (currentStep.highlight) {
      const { x, y, width, height } = currentStep.highlight
      ctx.clearRect(x, y, width, height)
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, width, height)
    }

    // Draw tutorial box
    this.drawTutorialBox(ctx, currentStep)

    // Draw arrow indicator
    if (currentStep.arrow) {
      this.drawArrow(ctx, currentStep.arrow)
    }

    ctx.restore()
  }

  /**
   * Draw tutorial box
   */
  private drawTutorialBox(ctx: CanvasRenderingContext2D, step: TutorialStep): void {
    const boxWidth = 400
    const boxHeight = 150
    const boxX = (ctx.canvas.width - boxWidth) / 2
    const boxY = ctx.canvas.height - boxHeight - 50

    // Draw box background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight)

    // Draw box border
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 2
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

    // Draw title
    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText(step.title, boxX + 20, boxY + 35)

    // Draw description
    ctx.fillStyle = '#4B5563'
    ctx.font = '14px sans-serif'
    this.wrapText(ctx, step.description, boxX + 20, boxY + 60, boxWidth - 40, 20)

    // Draw progress
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '12px sans-serif'
    ctx.fillText(
      `Step ${this.currentStepIndex + 1} of ${this.steps.length}`,
      boxX + 20,
      boxY + boxHeight - 20
    )

    // Draw skip button if skippable
    if (step.skippable !== false) {
      const skipButtonX = boxX + boxWidth - 100
      const skipButtonY = boxY + boxHeight - 40

      ctx.fillStyle = '#6B7280'
      ctx.fillRect(skipButtonX, skipButtonY, 80, 30)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = '12px sans-serif'
      ctx.fillText('Skip', skipButtonX + 25, skipButtonY + 20)
    }
  }

  /**
   * Draw arrow indicator
   */
  private drawArrow(
    ctx: CanvasRenderingContext2D,
    arrow: NonNullable<TutorialStep['arrow']>
  ): void {
    ctx.strokeStyle = '#FFD700'
    ctx.fillStyle = '#FFD700'
    ctx.lineWidth = 3

    const arrowSize = 20

    ctx.beginPath()

    switch (arrow.direction) {
      case 'up':
        ctx.moveTo(arrow.x, arrow.y)
        ctx.lineTo(arrow.x - arrowSize / 2, arrow.y + arrowSize)
        ctx.lineTo(arrow.x + arrowSize / 2, arrow.y + arrowSize)
        break
      case 'down':
        ctx.moveTo(arrow.x, arrow.y)
        ctx.lineTo(arrow.x - arrowSize / 2, arrow.y - arrowSize)
        ctx.lineTo(arrow.x + arrowSize / 2, arrow.y - arrowSize)
        break
      case 'left':
        ctx.moveTo(arrow.x, arrow.y)
        ctx.lineTo(arrow.x + arrowSize, arrow.y - arrowSize / 2)
        ctx.lineTo(arrow.x + arrowSize, arrow.y + arrowSize / 2)
        break
      case 'right':
        ctx.moveTo(arrow.x, arrow.y)
        ctx.lineTo(arrow.x - arrowSize, arrow.y - arrowSize / 2)
        ctx.lineTo(arrow.x - arrowSize, arrow.y + arrowSize / 2)
        break
    }

    ctx.closePath()
    ctx.fill()
  }

  /**
   * Wrap text for rendering
   */
  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {
    const words = text.split(' ')
    let line = ''
    let currentY = y

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY)
        line = words[i] + ' '
        currentY += lineHeight
      } else {
        line = testLine
      }
    }

    ctx.fillText(line, x, currentY)
  }

  /**
   * Get current step
   */
  getCurrentStep(): TutorialStep | null {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
      return this.steps[this.currentStepIndex]
    }

    return null
  }

  /**
   * Get current step index
   */
  getCurrentStepIndex(): number {
    return this.currentStepIndex
  }

  /**
   * Check if tutorial is active
   */
  isActiveTutorial(): boolean {
    return this.isActive
  }

  /**
   * Check if tutorial is paused
   */
  isPausedState(): boolean {
    return this.isPaused
  }

  /**
   * Get progress
   */
  getProgress(): {
    current: number
    total: number
    percentage: number
  } {
    const completed = this.steps.filter((s) => s.completed).length

    return {
      current: completed,
      total: this.steps.length,
      percentage: (completed / this.steps.length) * 100,
    }
  }

  /**
   * Reset tutorial
   */
  reset(): void {
    this.steps.forEach((step) => {
      step.completed = false
    })

    this.currentStepIndex = -1
    this.isActive = false
    this.isPaused = false
    this.hasSeenTutorial = false
    this.saveProgress()
  }

  /**
   * Load progress from storage
   */
  private loadProgress(): void {
    try {
      const saved = localStorage.getItem('tutorial_progress')

      if (saved) {
        const data = JSON.parse(saved)
        this.hasSeenTutorial = data.hasSeenTutorial || false
      }
    } catch (error) {
      console.error('Failed to load tutorial progress:', error)
    }
  }

  /**
   * Save progress to storage
   */
  private saveProgress(): void {
    try {
      const data = {
        hasSeenTutorial: this.hasSeenTutorial,
      }

      localStorage.setItem('tutorial_progress', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save tutorial progress:', error)
    }
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks: {
    onComplete?: () => void
    onSkip?: () => void
    onStepChange?: (step: TutorialStep) => void
  }): void {
    this.onComplete = callbacks.onComplete
    this.onSkip = callbacks.onSkip
    this.onStepChange = callbacks.onStepChange
  }
}

export default TutorialManager

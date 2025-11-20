/**
 * Game state machine for flow control with advanced features
 */

export type GameState =
  | 'idle'
  | 'menu'
  | 'countdown'
  | 'playing'
  | 'paused'
  | 'game-over'
  | 'victory'
  | 'loading'
  | 'tutorial'

export interface StateTransition {
  from: GameState
  to: GameState
  timestamp: number
  reason?: string
  metadata?: Record<string, any>
}

export interface TransitionGuard {
  condition: () => boolean
  message?: string
}

export interface StateAction {
  onEnter?: () => void | Promise<void>
  onExit?: () => void | Promise<void>
  onUpdate?: (deltaTime: number) => void
}

export interface TimedTransition {
  state: GameState
  targetState: GameState
  delay: number
  timerId?: number
}

export interface StateMetrics {
  totalTime: number
  visitCount: number
  lastEnterTime: number
  lastExitTime: number
}

export class GameStateMachine {
  private currentState: GameState = 'idle'
  private previousState: GameState | null = null
  private stateStack: GameState[] = []
  private transitions: StateTransition[] = []
  private enterCallbacks: Map<GameState, Set<() => void>> = new Map()
  private exitCallbacks: Map<GameState, Set<() => void>> = new Map()
  private updateCallbacks: Map<GameState, Set<(deltaTime: number) => void>> = new Map()
  private guards: Map<string, TransitionGuard> = new Map()
  private actions: Map<GameState, StateAction> = new Map()
  private timedTransitions: TimedTransition[] = []
  private stateMetrics: Map<GameState, StateMetrics> = new Map()
  private stateEnterTime: number = Date.now()
  private maxTransitionHistory = 100

  private validTransitions: Record<GameState, GameState[]> = {
    idle: ['menu', 'loading'],
    loading: ['menu', 'idle'],
    menu: ['countdown', 'idle', 'tutorial'],
    tutorial: ['menu', 'countdown'],
    countdown: ['playing', 'menu'],
    playing: ['paused', 'game-over', 'victory'],
    paused: ['playing', 'menu', 'game-over'],
    'game-over': ['menu', 'countdown'],
    victory: ['menu', 'countdown'],
  }

  /**
   * Initialize state metrics for a state
   */
  private initializeMetrics(state: GameState): void {
    if (!this.stateMetrics.has(state)) {
      this.stateMetrics.set(state, {
        totalTime: 0,
        visitCount: 0,
        lastEnterTime: 0,
        lastExitTime: 0,
      })
    }
  }

  /**
   * Update state metrics
   */
  private updateMetrics(state: GameState, isEntering: boolean): void {
    this.initializeMetrics(state)
    const metrics = this.stateMetrics.get(state)!

    if (isEntering) {
      metrics.visitCount++
      metrics.lastEnterTime = Date.now()
    } else {
      const duration = Date.now() - metrics.lastEnterTime
      metrics.totalTime += duration
      metrics.lastExitTime = Date.now()
    }
  }

  /**
   * Check transition guards
   */
  private checkGuards(
    from: GameState,
    to: GameState
  ): {
    allowed: boolean
    message?: string
  } {
    const guardKey = `${from}:${to}`
    const guard = this.guards.get(guardKey)

    if (guard) {
      const allowed = guard.condition()
      return {
        allowed,
        message: allowed ? undefined : guard.message,
      }
    }

    return { allowed: true }
  }

  /**
   * Transition to a new state
   */
  async transition(
    to: GameState,
    reason?: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const validTargets = this.validTransitions[this.currentState]

    if (!validTargets?.includes(to)) {
      console.warn(`Invalid transition from ${this.currentState} to ${to}`)
      return false
    }

    // Check guards
    const guardResult = this.checkGuards(this.currentState, to)
    if (!guardResult.allowed) {
      console.warn(
        `Transition blocked by guard: ${guardResult.message || 'Guard condition failed'}`
      )
      return false
    }

    // Execute exit action
    const currentAction = this.actions.get(this.currentState)
    if (currentAction?.onExit) {
      await currentAction.onExit()
    }

    // Trigger exit callbacks
    this.triggerExitCallbacks(this.currentState)

    // Update metrics for exiting state
    this.updateMetrics(this.currentState, false)

    // Record transition
    const transition: StateTransition = {
      from: this.currentState,
      to,
      timestamp: Date.now(),
      reason,
      metadata,
    }
    this.transitions.push(transition)

    // Limit history size
    if (this.transitions.length > this.maxTransitionHistory) {
      this.transitions.shift()
    }

    // Update state
    this.previousState = this.currentState
    this.currentState = to
    this.stateEnterTime = Date.now()

    // Add to stack
    this.stateStack.push(to)
    if (this.stateStack.length > 10) {
      this.stateStack.shift()
    }

    // Update metrics for entering state
    this.updateMetrics(to, true)

    // Execute enter action
    const newAction = this.actions.get(to)
    if (newAction?.onEnter) {
      await newAction.onEnter()
    }

    // Trigger enter callbacks
    this.triggerEnterCallbacks(to)

    return true
  }

  /**
   * Get current state
   */
  getCurrentState(): GameState {
    return this.currentState
  }

  /**
   * Get previous state
   */
  getPreviousState(): GameState | null {
    return this.previousState
  }

  /**
   * Check if current state matches
   */
  is(state: GameState): boolean {
    return this.currentState === state
  }

  /**
   * Check if current state is any of the provided states
   */
  isAnyOf(...states: GameState[]): boolean {
    return states.includes(this.currentState)
  }

  /**
   * Get time in current state
   */
  getTimeInState(): number {
    return Date.now() - this.stateEnterTime
  }

  /**
   * Add enter callback
   */
  onEnter(state: GameState, callback: () => void): () => void {
    if (!this.enterCallbacks.has(state)) {
      this.enterCallbacks.set(state, new Set())
    }

    this.enterCallbacks.get(state)?.add(callback)

    return () => {
      this.enterCallbacks.get(state)?.delete(callback)
    }
  }

  /**
   * Add exit callback
   */
  onExit(state: GameState, callback: () => void): () => void {
    if (!this.exitCallbacks.has(state)) {
      this.exitCallbacks.set(state, new Set())
    }

    this.exitCallbacks.get(state)?.add(callback)

    return () => {
      this.exitCallbacks.get(state)?.delete(callback)
    }
  }

  /**
   * Add update callback
   */
  onUpdate(state: GameState, callback: (deltaTime: number) => void): () => void {
    if (!this.updateCallbacks.has(state)) {
      this.updateCallbacks.set(state, new Set())
    }

    this.updateCallbacks.get(state)?.add(callback)

    return () => {
      this.updateCallbacks.get(state)?.delete(callback)
    }
  }

  /**
   * Update state (called every frame)
   */
  update(deltaTime: number): void {
    const callbacks = this.updateCallbacks.get(this.currentState)
    if (callbacks) {
      callbacks.forEach((cb) => cb(deltaTime))
    }

    // Execute update action
    const action = this.actions.get(this.currentState)
    if (action?.onUpdate) {
      action.onUpdate(deltaTime)
    }
  }

  /**
   * Trigger enter callbacks
   */
  private triggerEnterCallbacks(state: GameState): void {
    const callbacks = this.enterCallbacks.get(state)
    if (callbacks) {
      callbacks.forEach((cb) => cb())
    }
  }

  /**
   * Trigger exit callbacks
   */
  private triggerExitCallbacks(state: GameState): void {
    const callbacks = this.exitCallbacks.get(state)
    if (callbacks) {
      callbacks.forEach((cb) => cb())
    }
  }

  /**
   * Add transition guard
   */
  addGuard(from: GameState, to: GameState, guard: TransitionGuard): void {
    const key = `${from}:${to}`
    this.guards.set(key, guard)
  }

  /**
   * Remove transition guard
   */
  removeGuard(from: GameState, to: GameState): void {
    const key = `${from}:${to}`
    this.guards.delete(key)
  }

  /**
   * Set state action
   */
  setAction(state: GameState, action: StateAction): void {
    this.actions.set(state, action)
  }

  /**
   * Schedule timed transition
   */
  scheduleTransition(targetState: GameState, delay: number): void {
    const timerId = window.setTimeout(() => {
      this.transition(targetState, 'Timed transition')
    }, delay)

    this.timedTransitions.push({
      state: this.currentState,
      targetState,
      delay,
      timerId,
    })
  }

  /**
   * Cancel all timed transitions
   */
  cancelTimedTransitions(): void {
    this.timedTransitions.forEach((transition) => {
      if (transition.timerId !== undefined) {
        window.clearTimeout(transition.timerId)
      }
    })
    this.timedTransitions = []
  }

  /**
   * Can transition to state
   */
  canTransitionTo(state: GameState): boolean {
    const validTargets = this.validTransitions[this.currentState]
    if (!validTargets?.includes(state)) {
      return false
    }

    const guardResult = this.checkGuards(this.currentState, state)
    return guardResult.allowed
  }

  /**
   * Get valid transitions from current state
   */
  getValidTransitions(): GameState[] {
    return this.validTransitions[this.currentState] || []
  }

  /**
   * Get transition history
   */
  getTransitionHistory(): StateTransition[] {
    return [...this.transitions]
  }

  /**
   * Get recent transitions
   */
  getRecentTransitions(count: number = 5): StateTransition[] {
    return this.transitions.slice(-count)
  }

  /**
   * Get state stack
   */
  getStateStack(): GameState[] {
    return [...this.stateStack]
  }

  /**
   * Get state metrics
   */
  getStateMetrics(state?: GameState): StateMetrics | Map<GameState, StateMetrics> {
    if (state) {
      this.initializeMetrics(state)
      return { ...this.stateMetrics.get(state)! }
    }
    return new Map(this.stateMetrics)
  }

  /**
   * Get total time in state
   */
  getTotalTimeInState(state: GameState): number {
    this.initializeMetrics(state)
    const metrics = this.stateMetrics.get(state)!
    return metrics.totalTime + (this.is(state) ? this.getTimeInState() : 0)
  }

  /**
   * Get visit count
   */
  getVisitCount(state: GameState): number {
    this.initializeMetrics(state)
    return this.stateMetrics.get(state)!.visitCount
  }

  /**
   * Reset state machine
   */
  reset(): void {
    this.cancelTimedTransitions()
    this.currentState = 'idle'
    this.previousState = null
    this.stateStack = []
    this.transitions = []
    this.stateEnterTime = Date.now()
  }

  /**
   * Clear all callbacks and guards
   */
  clearAll(): void {
    this.enterCallbacks.clear()
    this.exitCallbacks.clear()
    this.updateCallbacks.clear()
    this.guards.clear()
    this.actions.clear()
    this.reset()
  }

  /**
   * Get state machine statistics
   */
  getStatistics(): {
    currentState: GameState
    totalTransitions: number
    totalStates: number
    mostVisitedState: GameState | null
    longestStateTime: { state: GameState; time: number } | null
  } {
    const mostVisited = Array.from(this.stateMetrics.entries()).reduce(
      (max, [state, metrics]) => {
        return metrics.visitCount > (max.count || 0) ? { state, count: metrics.visitCount } : max
      },
      { state: null as GameState | null, count: 0 }
    )

    const longest = Array.from(this.stateMetrics.entries()).reduce(
      (max, [state, metrics]) => {
        const totalTime = this.getTotalTimeInState(state)
        return totalTime > (max.time || 0) ? { state, time: totalTime } : max
      },
      { state: null as GameState | null, time: 0 }
    )

    return {
      currentState: this.currentState,
      totalTransitions: this.transitions.length,
      totalStates: this.stateMetrics.size,
      mostVisitedState: mostVisited.state,
      longestStateTime: longest.state ? longest : null,
    }
  }
}

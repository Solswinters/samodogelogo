/**
 * Game state machine for flow control
 */

export type GameState =
  | 'idle'
  | 'menu'
  | 'countdown'
  | 'playing'
  | 'paused'
  | 'game-over'
  | 'victory'

export interface StateTransition {
  from: GameState
  to: GameState
  timestamp: number
}

export class GameStateMachine {
  private currentState: GameState = 'idle'
  private previousState: GameState | null = null
  private transitions: StateTransition[] = []
  private callbacks: Map<GameState, Set<() => void>> = new Map()

  private validTransitions: Record<GameState, GameState[]> = {
    idle: ['menu'],
    menu: ['countdown', 'idle'],
    countdown: ['playing', 'menu'],
    playing: ['paused', 'game-over', 'victory'],
    paused: ['playing', 'menu', 'game-over'],
    'game-over': ['menu', 'countdown'],
    victory: ['menu', 'countdown'],
  }

  transition(to: GameState): boolean {
    const validTargets = this.validTransitions[this.currentState]

    if (!validTargets?.includes(to)) {
      console.warn(`Invalid transition from ${this.currentState} to ${to}`)
      return false
    }

    this.transitions.push({
      from: this.currentState,
      to,
      timestamp: Date.now(),
    })

    this.previousState = this.currentState
    this.currentState = to

    this.triggerCallbacks(to)
    return true
  }

  getCurrentState(): GameState {
    return this.currentState
  }

  getPreviousState(): GameState | null {
    return this.previousState
  }

  is(state: GameState): boolean {
    return this.currentState === state
  }

  isAnyOf(...states: GameState[]): boolean {
    return states.includes(this.currentState)
  }

  onEnter(state: GameState, callback: () => void): () => void {
    if (!this.callbacks.has(state)) {
      this.callbacks.set(state, new Set())
    }

    this.callbacks.get(state)?.add(callback)

    return () => {
      this.callbacks.get(state)?.delete(callback)
    }
  }

  private triggerCallbacks(state: GameState): void {
    const callbacks = this.callbacks.get(state)
    if (callbacks) {
      callbacks.forEach(cb => cb())
    }
  }

  getTransitionHistory(): StateTransition[] {
    return [...this.transitions]
  }

  reset(): void {
    this.currentState = 'idle'
    this.previousState = null
    this.transitions = []
  }
}

/**
 * Simple state management utility
 */

type Listener<T> = (state: T) => void

export class StateManager<T> {
  private state: T
  private listeners: Set<Listener<T>> = new Set()

  constructor(initialState: T) {
    this.state = initialState
  }

  getState(): T {
    return this.state
  }

  setState(newState: Partial<T> | ((prev: T) => T)): void {
    if (typeof newState === 'function') {
      this.state = newState(this.state)
    } else {
      this.state = { ...this.state, ...newState }
    }
    this.notify()
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state))
  }

  reset(initialState: T): void {
    this.state = initialState
    this.notify()
  }
}

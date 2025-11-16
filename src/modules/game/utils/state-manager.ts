/**
 * Game state management
 */

import type { GameState } from '@/types/game'
import { logger } from '@/utils/logger'

type StateChangeListener = (oldState: GameState, newState: GameState) => void

class GameStateManager {
  private currentState: GameState = 'waiting'
  private previousState: GameState | null = null
  private listeners: Set<StateChangeListener> = new Set()
  private stateHistory: GameState[] = []
  private maxHistorySize: number = 10

  getCurrentState(): GameState {
    return this.currentState
  }

  getPreviousState(): GameState | null {
    return this.previousState
  }

  setState(newState: GameState): void {
    if (newState === this.currentState) {
      logger.warn(`Attempt to set state to current state: ${newState}`)
      return
    }

    const oldState = this.currentState
    this.previousState = oldState
    this.currentState = newState

    // Add to history
    this.stateHistory.push(newState)
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift()
    }

    logger.info(`Game state changed: ${oldState} -> ${newState}`)

    // Notify listeners
    this.notifyListeners(oldState, newState)
  }

  isState(state: GameState): boolean {
    return this.currentState === state
  }

  isPlaying(): boolean {
    return this.currentState === 'playing'
  }

  isPaused(): boolean {
    return this.currentState === 'paused'
  }

  isWaiting(): boolean {
    return this.currentState === 'waiting'
  }

  isEnded(): boolean {
    return this.currentState === 'ended'
  }

  canTransitionTo(newState: GameState): boolean {
    const validTransitions: Record<GameState, GameState[]> = {
      waiting: ['playing'],
      playing: ['paused', 'ended'],
      paused: ['playing', 'ended'],
      ended: ['waiting'],
    }

    return validTransitions[this.currentState].includes(newState)
  }

  transitionTo(newState: GameState): boolean {
    if (!this.canTransitionTo(newState)) {
      logger.warn(`Invalid state transition: ${this.currentState} -> ${newState}`)
      return false
    }

    this.setState(newState)
    return true
  }

  addListener(listener: StateChangeListener): void {
    this.listeners.add(listener)
  }

  removeListener(listener: StateChangeListener): void {
    this.listeners.delete(listener)
  }

  private notifyListeners(oldState: GameState, newState: GameState): void {
    this.listeners.forEach(listener => {
      try {
        listener(oldState, newState)
      } catch (error) {
        logger.error('Error in state change listener', error)
      }
    })
  }

  getStateHistory(): GameState[] {
    return [...this.stateHistory]
  }

  reset(): void {
    this.currentState = 'waiting'
    this.previousState = null
    this.stateHistory = []
    logger.info('Game state reset')
  }

  clearListeners(): void {
    this.listeners.clear()
  }
}

export const gameStateManager = new GameStateManager()

// Helper function to handle common state transitions
export function startGame(): boolean {
  return gameStateManager.transitionTo('playing')
}

export function pauseGame(): boolean {
  return gameStateManager.transitionTo('paused')
}

export function resumeGame(): boolean {
  if (gameStateManager.isPaused()) {
    return gameStateManager.transitionTo('playing')
  }
  return false
}

export function endGame(): boolean {
  return gameStateManager.transitionTo('ended')
}

export function resetGame(): void {
  gameStateManager.reset()
}

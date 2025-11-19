/**
 * Client-side prediction utilities
 */

export interface PlayerState {
  x: number
  y: number
  vx: number
  vy: number
  timestamp: number
}

export class ClientPrediction {
  private inputBuffer: Array<{ input: unknown; timestamp: number }> = []
  private stateHistory: PlayerState[] = []
  private maxHistorySize = 60

  addInput(input: unknown, timestamp: number): void {
    this.inputBuffer.push({ input, timestamp })
  }

  addState(state: PlayerState): void {
    this.stateHistory.push(state)
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift()
    }
  }

  predict(currentState: PlayerState, deltaTime: number): PlayerState {
    return {
      x: currentState.x + currentState.vx * deltaTime,
      y: currentState.y + currentState.vy * deltaTime,
      vx: currentState.vx,
      vy: currentState.vy,
      timestamp: currentState.timestamp + deltaTime,
    }
  }

  reconcile(serverState: PlayerState): PlayerState | null {
    const serverTimestamp = serverState.timestamp

    // Find the closest predicted state
    const closestStateIndex = this.stateHistory.findIndex(
      state => Math.abs(state.timestamp - serverTimestamp) < 50
    )

    if (closestStateIndex === -1) {
      return serverState
    }

    const predictedState = this.stateHistory[closestStateIndex]
    const error = Math.hypot(serverState.x - predictedState.x, serverState.y - predictedState.y)

    // If error is small, keep prediction
    if (error < 5) {
      return null
    }

    // Resimulate from server state
    let reconciledState = serverState
    for (let i = closestStateIndex + 1; i < this.stateHistory.length; i++) {
      const nextState = this.stateHistory[i]
      const dt = nextState.timestamp - reconciledState.timestamp
      reconciledState = this.predict(reconciledState, dt)
    }

    return reconciledState
  }

  clearOldInputs(timestamp: number): void {
    this.inputBuffer = this.inputBuffer.filter(item => item.timestamp >= timestamp)
  }

  clearOldStates(timestamp: number): void {
    this.stateHistory = this.stateHistory.filter(state => state.timestamp >= timestamp)
  }

  clear(): void {
    this.inputBuffer = []
    this.stateHistory = []
  }
}

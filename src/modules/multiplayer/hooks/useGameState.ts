/**
 * Game state hook
 */

'use client'

import { useState, useEffect } from 'react'
import { GameState, GamePhase } from '../state/GameState'

const gameState = new GameState()

export function useGameState() {
  const [phase, setPhase] = useState<GamePhase>(gameState.getPhase())
  const [state, setState] = useState(gameState.getState())

  useEffect(() => {
    const unsubscribe = gameState.subscribe(setState)
    return unsubscribe
  }, [])

  useEffect(() => {
    setPhase(state.phase)
  }, [state.phase])

  return {
    phase,
    state,
    isPlaying: gameState.isPlaying(),
    isPaused: gameState.isPaused(),
    isFinished: gameState.isFinished(),
    duration: gameState.getDuration(),
    scores: gameState.getScores(),
    rankings: gameState.getRankings(),
    winner: gameState.getWinner(),
  }
}

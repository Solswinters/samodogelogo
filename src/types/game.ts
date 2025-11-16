/**
 * Game-related type definitions
 */

import type { PlayerColor } from '@/constants/game'

export type GameMode = 'single' | 'multi'
export type GameState = 'waiting' | 'playing' | 'paused' | 'ended'

export interface Player {
  id: string
  x: number
  y: number
  velocityY: number
  isJumping: boolean
  isAlive: boolean
  score: number
  color: PlayerColor
}

export interface Obstacle {
  id: string
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export interface PlayerScore {
  playerId: string
  score: number
  timestamp: number
}

export interface GameSettings {
  soundEnabled: boolean
  musicVolume: number
  sfxVolume: number
  showFPS: boolean
  difficulty: 'easy' | 'normal' | 'hard'
}

export interface GameSession {
  id: string
  players: string[] // Player IDs
  hostId: string
  startTime: number
  endTime: number | null
  scores: PlayerScore[]
  status: GameState
  difficulty: number
}

export interface GameSessionLegacy {
  id: string
  mode: GameMode
  startTime: number
  endTime?: number
  score: number
  duration: number
  obstaclesCleared: number
}

export interface PowerUp {
  id: string
  type: 'shield' | 'speed' | 'double-jump' | 'magnet'
  x: number
  y: number
  active: boolean
  duration: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: number
  progress: number
  maxProgress: number
}

export interface GameStats {
  totalScore: number
  highScore: number
  gamesPlayed: number
  totalPlayTime: number
  obstaclesCleared: number
  achievements: Achievement[]
}

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

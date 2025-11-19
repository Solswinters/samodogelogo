/**
 * Centralized game types and interfaces
 */

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  vx: number
  vy: number
}

export interface Size {
  width: number
  height: number
}

export interface Bounds extends Position, Size {}

export interface GameObject extends Bounds {
  id: string
  active: boolean
  visible: boolean
}

export interface PhysicsObject extends GameObject, Velocity {
  mass: number
  friction: number
  restitution: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  jump: boolean
  action: boolean
}

export interface GameScore {
  current: number
  high: number
  multiplier: number
  combo: number
}

export interface GameStats {
  timeAlive: number
  distanceTraveled: number
  obstaclesAvoided: number
  powerupsCollected: number
  enemiesDefeated: number
}

export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'extreme'

export interface GameMetadata {
  version: string
  difficulty: GameDifficulty
  mode: string
  seed?: number
}

export interface Color {
  r: number
  g: number
  b: number
  a?: number
}

export type RenderLayer = 'background' | 'world' | 'entities' | 'effects' | 'ui'

export interface AnimationFrame {
  frameIndex: number
  duration: number
  offsetX?: number
  offsetY?: number
}

export interface SoundConfig {
  volume: number
  loop: boolean
  playbackRate: number
}

export type CollisionShape = 'circle' | 'rectangle' | 'polygon'

export interface CollisionInfo {
  collided: boolean
  normal?: { x: number; y: number }
  penetration?: number
  contactPoint?: Position
}

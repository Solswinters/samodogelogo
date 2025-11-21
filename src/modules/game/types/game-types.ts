/**
 * Game Types
 * Central type definitions for the game
 */

import type {
  GameState,
  ObstacleType,
  PowerUpType,
  CollectibleType,
  DifficultyLevel,
  AchievementCategory,
  AchievementRarity,
  ParticleType,
  SoundEffect,
  MusicTrack,
} from '../constants/game-constants'

// Core Game Types

export interface Position {
  x: number
  y: number
}

export interface Velocity {
  x: number
  y: number
}

export interface Dimensions {
  width: number
  height: number
}

export interface BoundingBox extends Position, Dimensions {}

export interface Color {
  r: number
  g: number
  b: number
  a?: number
}

// Player Types

export interface Player {
  id: string
  position: Position
  velocity: Velocity
  dimensions: Dimensions
  health: number
  maxHealth: number
  score: number
  coins: number
  isJumping: boolean
  isGrounded: boolean
  jumpCount: number
  maxJumps: number
  isInvincible: boolean
  invincibilityEndTime: number
  activePowerUps: ActivePowerUp[]
  facingDirection: 'left' | 'right'
  animationState: AnimationState
  lastCoyoteTime: number
  jumpBufferTime: number
}

export interface PlayerControls {
  left: boolean
  right: boolean
  jump: boolean
  pause: boolean
  interact: boolean
}

// Game Object Types

export interface GameObject extends Position, Dimensions {
  id: string
  type: string
  active: boolean
  visible: boolean
}

export interface Obstacle extends GameObject {
  type: ObstacleType
  damage: number
  speed?: number
  direction?: 'horizontal' | 'vertical'
  pattern?: MovementPattern
}

export interface PowerUp extends GameObject {
  type: PowerUpType
  duration: number
  effect: PowerUpEffect
  collected: boolean
}

export interface Collectible extends GameObject {
  type: CollectibleType
  value: number
  collected: boolean
  animationOffset: number
}

// Active Effects

export interface ActivePowerUp {
  type: PowerUpType
  startTime: number
  endTime: number
  effect: PowerUpEffect
}

export interface PowerUpEffect {
  speedMultiplier?: number
  jumpMultiplier?: number
  scoreMultiplier?: number
  invincibility?: boolean
  shield?: boolean
  magnetRadius?: number
  timeScale?: number
}

// Animation Types

export interface AnimationState {
  current: 'idle' | 'running' | 'jumping' | 'falling' | 'landing' | 'hurt'
  frameIndex: number
  frameTime: number
  loop: boolean
}

export interface AnimationFrame {
  spriteX: number
  spriteY: number
  width: number
  height: number
  duration: number
}

export interface Animation {
  name: string
  frames: AnimationFrame[]
  loop: boolean
  speed: number
}

// Movement Patterns

export interface MovementPattern {
  type: 'linear' | 'sine' | 'bounce' | 'circular' | 'bezier'
  speed: number
  amplitude?: number
  frequency?: number
  controlPoints?: Position[]
}

// Particle System Types

export interface Particle {
  id: string
  type: ParticleType
  position: Position
  velocity: Velocity
  size: number
  color: Color
  lifetime: number
  age: number
  alpha: number
  rotation: number
  rotationSpeed: number
  active: boolean
}

export interface ParticleEmitter {
  position: Position
  type: ParticleType
  emissionRate: number
  particleLifetime: number
  particleSize: number
  particleColor: Color
  velocityRange: { min: Velocity; max: Velocity }
  active: boolean
}

// Score & Combo Types

export interface ScoreEvent {
  type: 'distance' | 'obstacle' | 'coin' | 'combo' | 'milestone' | 'achievement'
  points: number
  timestamp: number
  position?: Position
}

export interface Combo {
  count: number
  multiplier: number
  lastCollectionTime: number
  active: boolean
}

export interface Milestone {
  score: number
  reached: boolean
  bonusPoints: number
  timestamp?: number
}

// Achievement Types

export interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  rarity: AchievementRarity
  unlocked: boolean
  progress: number
  requirement: number
  rewardPoints: number
  nftTokenId?: string
  unlockedAt?: Date
  icon: string
}

export interface AchievementProgress {
  achievementId: string
  currentValue: number
  targetValue: number
  percentage: number
}

// Game State Types

export interface GameStateData {
  state: GameState
  player: Player
  obstacles: Obstacle[]
  powerUps: PowerUp[]
  collectibles: Collectible[]
  particles: Particle[]
  score: number
  highScore: number
  combo: Combo
  difficulty: DifficultyData
  camera: Camera
  isPaused: boolean
  gameTime: number
  deltaTime: number
}

export interface DifficultyData {
  level: DifficultyLevel
  multiplier: number
  obstacleSpawnRate: number
  obstacleSpeed: number
}

// Camera Types

export interface Camera {
  position: Position
  target: Position
  offset: Position
  zoom: number
  shake: CameraShake | null
  deadzone: BoundingBox
}

export interface CameraShake {
  intensity: number
  duration: number
  startTime: number
}

// Leaderboard Types

export interface LeaderboardEntry {
  rank: number
  playerAddress: string
  playerName?: string
  score: number
  timestamp: Date
  distance: number
  coins: number
  achievements: string[]
}

export interface LeaderboardFilter {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'allTime'
  limit: number
  offset: number
}

// Multiplayer Types

export interface MultiplayerRoom {
  id: string
  name: string
  players: MultiplayerPlayer[]
  maxPlayers: number
  gameState: 'waiting' | 'starting' | 'playing' | 'finished'
  hostId: string
  settings: RoomSettings
}

export interface MultiplayerPlayer {
  id: string
  walletAddress: string
  username: string
  position: Position
  score: number
  isReady: boolean
  ping: number
}

export interface RoomSettings {
  gameMode: 'race' | 'survival' | 'competitive'
  duration: number
  difficulty: DifficultyLevel
  private: boolean
}

export interface NetworkMessage {
  type: 'playerMove' | 'playerJump' | 'gameUpdate' | 'playerJoin' | 'playerLeave' | 'chat'
  playerId: string
  timestamp: number
  data: any
}

// Blockchain Types

export interface WalletConnection {
  address: string
  chainId: number
  connected: boolean
  balance: string
  provider: any
}

export interface TokenReward {
  amount: string
  tokenAddress: string
  txHash?: string
  claimable: boolean
  claimed: boolean
  claimDeadline?: Date
}

export interface NFTMetadata {
  tokenId: string
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
  achievementId: string
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: string
}

export interface GaslessTransaction {
  to: string
  data: string
  signature: string
  deadline: number
}

// Settings Types

export interface GameSettings {
  audio: AudioSettings
  graphics: GraphicsSettings
  controls: ControlSettings
  gameplay: GameplaySettings
}

export interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  muted: boolean
}

export interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high'
  particles: boolean
  shadows: boolean
  antialiasing: boolean
  screenShake: boolean
  fullscreen: boolean
}

export interface ControlSettings {
  moveLeft: string[]
  moveRight: string[]
  jump: string[]
  pause: string[]
  interact: string[]
  touchControls: boolean
  invertControls: boolean
}

export interface GameplaySettings {
  difficulty: DifficultyLevel
  showHints: boolean
  autoSave: boolean
  showFPS: boolean
  debugMode: boolean
}

// Statistics Types

export interface PlayerStatistics {
  totalGamesPlayed: number
  totalScore: number
  highScore: number
  totalDistance: number
  totalCoins: number
  totalAchievements: number
  totalPlayTime: number // milliseconds
  averageScore: number
  gamesWon: number
  gamesLost: number
  longestCombo: number
  mostCoinsInGame: number
  favoriteMode: string
  lastPlayed: Date
}

export interface GameSessionData {
  startTime: Date
  endTime?: Date
  duration: number
  score: number
  distance: number
  coins: number
  obstaclesAvoided: number
  powerUpsCollected: number
  maxCombo: number
  achievementsUnlocked: string[]
  difficultyLevel: DifficultyLevel
  finalState: 'completed' | 'gameOver' | 'quit'
}

// Input Types

export interface InputState {
  keyboard: KeyboardState
  mouse: MouseState
  touch: TouchState
  gamepad: GamepadState | null
}

export interface KeyboardState {
  pressed: Set<string>
  justPressed: Set<string>
  justReleased: Set<string>
}

export interface MouseState {
  position: Position
  buttons: Set<number>
  justPressed: Set<number>
  justReleased: Set<number>
  wheel: number
}

export interface TouchState {
  touches: Touch[]
  justStarted: Touch[]
  justEnded: Touch[]
}

export interface Touch {
  id: number
  position: Position
  startPosition: Position
  force: number
}

export interface GamepadState {
  index: number
  buttons: boolean[]
  axes: number[]
  connected: boolean
}

// Asset Types

export interface Asset {
  id: string
  type: 'image' | 'audio' | 'font'
  url: string
  loaded: boolean
  data?: any
}

export interface AssetManifest {
  images: AssetDefinition[]
  audio: AssetDefinition[]
  fonts: AssetDefinition[]
}

export interface AssetDefinition {
  id: string
  path: string
  preload: boolean
}

// UI Types

export interface UIElement {
  id: string
  type: 'button' | 'text' | 'image' | 'panel' | 'slider'
  position: Position
  dimensions: Dimensions
  visible: boolean
  enabled: boolean
  zIndex: number
  children: UIElement[]
}

export interface Button extends UIElement {
  text: string
  onClick: () => void
  onHover?: () => void
  hovered: boolean
  pressed: boolean
}

export interface TextElement extends UIElement {
  text: string
  fontSize: number
  fontFamily: string
  color: Color
  align: 'left' | 'center' | 'right'
}

export interface Panel extends UIElement {
  backgroundColor: Color
  borderColor?: Color
  borderWidth?: number
  padding: number
}

// Tutorial Types

export interface TutorialStep {
  id: string
  title: string
  description: string
  duration: number
  position?: Position
  targetElement?: string
  completed: boolean
}

export interface TutorialState {
  active: boolean
  currentStep: number
  steps: TutorialStep[]
  completed: boolean
  skipped: boolean
}

// Event Types

export type GameEvent =
  | { type: 'playerJump'; position: Position }
  | { type: 'playerLand'; position: Position }
  | { type: 'playerHit'; obstacle: Obstacle; damage: number }
  | { type: 'coinCollect'; collectible: Collectible; value: number }
  | { type: 'powerUpCollect'; powerUp: PowerUp }
  | { type: 'powerUpExpire'; type: PowerUpType }
  | { type: 'achievementUnlock'; achievement: Achievement }
  | { type: 'milestoneReach'; milestone: Milestone }
  | { type: 'comboBreak'; combo: Combo }
  | { type: 'gameOver'; finalScore: number; reason: string }
  | { type: 'levelUp'; newLevel: DifficultyLevel }
  | { type: 'scoreUpdate'; newScore: number; delta: number }

export type GameEventHandler = (event: GameEvent) => void

// Save Data Types

export interface SaveData {
  version: string
  lastSaved: Date
  player: {
    highScore: number
    totalCoins: number
    unlockedAchievements: string[]
    statistics: PlayerStatistics
  }
  settings: GameSettings
  tutorialCompleted: boolean
  walletAddress?: string
}

// Utility Types

export type Vector2 = Position
export type Point = Position
export type Size = Dimensions
export type Rectangle = BoundingBox

export type Optional<T> = T | undefined
export type Nullable<T> = T | null

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type ReadOnly<T> = {
  readonly [P in keyof T]: T[P]
}

// Type Guards

export function isPlayer(obj: any): obj is Player {
  return obj && typeof obj.id === 'string' && 'health' in obj && 'score' in obj
}

export function isObstacle(obj: GameObject): obj is Obstacle {
  return obj.type in ['spike', 'block', 'movingPlatform', 'fallingRock', 'sawblade', 'laser', 'gap']
}

export function isPowerUp(obj: GameObject): obj is PowerUp {
  return (
    obj.type in
    [
      'speedBoost',
      'shield',
      'jumpBoost',
      'invincibility',
      'scoreMultiplier',
      'magnet',
      'slowTime',
      'extraLife',
    ]
  )
}

export function isCollectible(obj: GameObject): obj is Collectible {
  return obj.type in ['coin', 'gem', 'star', 'bonus']
}

export interface Player {
  id: string
  x: number
  y: number
  velocityY: number
  isJumping: boolean
  isGrounded: boolean
  score: number
  isAlive: boolean
  color: string
}

export interface Obstacle {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface GameState {
  players: Map<string, Player>
  obstacles: Obstacle[]
  gameSpeed: number
  gameTime: number
  difficulty: number
  isMultiplayer: boolean
  roomId?: string
}


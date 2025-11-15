import type { Player, Obstacle } from '@/modules/game/domain/engine'

export const mockPlayer: Player = {
  id: 'test-player',
  x: 100,
  y: 260,
  velocityY: 0,
  isJumping: false,
  isGrounded: true,
  score: 0,
  isAlive: true,
  color: '#3B82F6',
}

export const mockObstacle: Obstacle = {
  id: 'test-obstacle',
  x: 800,
  y: 280,
  width: 30,
  height: 60,
}

export const mockGameState = {
  players: new Map([['test-player', mockPlayer]]),
  obstacles: [mockObstacle],
  gameSpeed: 5,
  gameTime: 0,
  difficulty: 1,
  isMultiplayer: false,
}

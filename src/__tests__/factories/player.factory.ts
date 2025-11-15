import { Player } from '@/lib/game-logic'

let playerIdCounter = 0

export const createMockPlayer = (overrides?: Partial<Player>): Player => {
  playerIdCounter++
  
  return {
    id: `player-${playerIdCounter}`,
    x: 100,
    y: 260,
    velocityY: 0,
    isJumping: false,
    isGrounded: true,
    score: 0,
    isAlive: true,
    color: '#3B82F6',
    ...overrides,
  }
}

export const createMockPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockPlayer({
      id: `player-${i + 1}`,
      color: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'][i % 4],
    })
  )
}

export const resetPlayerIdCounter = () => {
  playerIdCounter = 0
}


import { Obstacle } from '@/lib/game-logic'

let obstacleIdCounter = 0

export const createMockObstacle = (overrides?: Partial<Obstacle>): Obstacle => {
  obstacleIdCounter++
  
  return {
    id: `obstacle-${obstacleIdCounter}`,
    x: 800,
    y: 280,
    width: 30,
    height: 60,
    ...overrides,
  }
}

export const createMockObstacles = (count: number, spacing: number = 200): Obstacle[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockObstacle({
      id: `obstacle-${i + 1}`,
      x: 800 + (i * spacing),
      height: 40 + Math.random() * 40,
    })
  )
}

export const resetObstacleIdCounter = () => {
  obstacleIdCounter = 0
}


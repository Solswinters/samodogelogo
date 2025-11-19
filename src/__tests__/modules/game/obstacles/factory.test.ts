import { ObstacleFactory } from '@/modules/game/obstacles/factory'

describe('ObstacleFactory', () => {
  let factory: ObstacleFactory

  beforeEach(() => {
    factory = new ObstacleFactory()
  })

  it('should create spike obstacle', () => {
    const obstacle = factory.create('spike', 100, 10)
    expect(obstacle.type).toBe('spike')
    expect(obstacle.x).toBe(100)
    expect(obstacle.y).toBe(10)
  })

  it('should create moving obstacle', () => {
    const obstacle = factory.create('moving-platform', 200, 20)
    expect(obstacle.type).toBe('moving-platform')
  })

  it('should create random obstacle', () => {
    const obstacle = factory.createRandom(100, 10)
    expect(obstacle.x).toBe(100)
    expect(obstacle.y).toBe(10)
  })

  it('should return all obstacle types', () => {
    const types = factory.getAvailableTypes()
    expect(types.length).toBeGreaterThan(0)
    expect(types).toContain('spike')
  })
})

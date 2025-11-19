import { DifficultyManager } from '@/modules/game/difficulty/DifficultyManager'

describe('DifficultyManager', () => {
  let manager: DifficultyManager

  beforeEach(() => {
    manager = new DifficultyManager()
  })

  it('should start at easy difficulty', () => {
    expect(manager.getCurrentDifficulty()).toBe('easy')
  })

  it('should increase difficulty over time', () => {
    manager.update(10000) // 10 seconds
    expect(manager.getDifficultyMultiplier()).toBeGreaterThan(1)
  })

  it('should cap difficulty', () => {
    manager.update(1000000) // Very long time
    expect(manager.getDifficultyMultiplier()).toBeLessThanOrEqual(5)
  })

  it('should reset difficulty', () => {
    manager.update(10000)
    manager.reset()
    expect(manager.getCurrentDifficulty()).toBe('easy')
  })
})

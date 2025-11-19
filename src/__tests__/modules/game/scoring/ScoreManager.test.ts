import { ScoreManager } from '@/modules/game/scoring/ScoreManager'

describe('ScoreManager', () => {
  let manager: ScoreManager

  beforeEach(() => {
    manager = new ScoreManager()
  })

  it('should start with zero score', () => {
    expect(manager.getScore()).toBe(0)
  })

  it('should add points', () => {
    manager.addPoints(100)
    expect(manager.getScore()).toBe(100)

    manager.addPoints(50)
    expect(manager.getScore()).toBe(150)
  })

  it('should track combo', () => {
    manager.incrementCombo()
    expect(manager.getCombo()).toBe(1)

    manager.incrementCombo()
    expect(manager.getCombo()).toBe(2)
  })

  it('should reset combo', () => {
    manager.incrementCombo()
    manager.incrementCombo()
    manager.resetCombo()
    expect(manager.getCombo()).toBe(0)
  })

  it('should apply combo multiplier', () => {
    manager.incrementCombo()
    manager.incrementCombo()
    manager.addPoints(100)
    expect(manager.getScore()).toBeGreaterThan(100)
  })

  it('should reset score', () => {
    manager.addPoints(500)
    manager.reset()
    expect(manager.getScore()).toBe(0)
  })
})

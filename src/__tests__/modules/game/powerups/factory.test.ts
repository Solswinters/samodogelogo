import { PowerUpFactory } from '@/modules/game/powerups/factory'

describe('PowerUpFactory', () => {
  let factory: PowerUpFactory

  beforeEach(() => {
    factory = new PowerUpFactory()
  })

  it('should create speed powerup', () => {
    const powerup = factory.create('speed', 150, 20)
    expect(powerup.type).toBe('speed')
    expect(powerup.x).toBe(150)
  })

  it('should create shield powerup', () => {
    const powerup = factory.create('shield', 200, 30)
    expect(powerup.type).toBe('shield')
  })

  it('should create invincibility powerup', () => {
    const powerup = factory.create('invincibility', 250, 40)
    expect(powerup.type).toBe('invincibility')
  })

  it('should apply powerup effects', () => {
    const powerup = factory.create('speed', 100, 10)
    expect(powerup.duration).toBeGreaterThan(0)
  })
})

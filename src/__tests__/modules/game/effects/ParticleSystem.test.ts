import { ParticleSystem } from '@/modules/game/effects/ParticleSystem'

describe('ParticleSystem', () => {
  let particleSystem: ParticleSystem

  beforeEach(() => {
    particleSystem = new ParticleSystem({
      maxParticles: 100,
      particleLife: 1000,
    })
  })

  it('should initialize with default config', () => {
    const system = new ParticleSystem()
    expect(system.getParticleCount()).toBe(0)
  })

  it('should emit particles', () => {
    particleSystem.emit(100, 100, 10)
    expect(particleSystem.getParticleCount()).toBe(10)
  })

  it('should not exceed max particles', () => {
    particleSystem.emit(100, 100, 150)
    expect(particleSystem.getParticleCount()).toBe(100)
  })

  it('should update particles', () => {
    particleSystem.emit(100, 100, 5)
    const initialCount = particleSystem.getParticleCount()

    particleSystem.update(16)

    expect(particleSystem.getParticleCount()).toBe(initialCount)
  })

  it('should remove dead particles', () => {
    particleSystem.emit(100, 100, 5)

    // Update multiple times to kill particles
    for (let i = 0; i < 100; i++) {
      particleSystem.update(16)
    }

    expect(particleSystem.getParticleCount()).toBe(0)
  })

  it('should clear all particles', () => {
    particleSystem.emit(100, 100, 10)
    expect(particleSystem.getParticleCount()).toBe(10)

    particleSystem.clear()
    expect(particleSystem.getParticleCount()).toBe(0)
  })

  it('should render particles', () => {
    const mockCtx = {
      save: jest.fn(),
      restore: jest.fn(),
      fillRect: jest.fn(),
      globalAlpha: 1,
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D

    particleSystem.emit(100, 100, 5)
    particleSystem.render(mockCtx)

    expect(mockCtx.save).toHaveBeenCalledTimes(5)
    expect(mockCtx.restore).toHaveBeenCalledTimes(5)
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(5)
  })
})

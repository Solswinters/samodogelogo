/**
 * Power-up factory
 */

import type { PowerUp } from './types'
import { randomInt } from '@/shared/math'
import { CANVAS } from '../constants'

function generateId(): string {
  return `powerup-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export class PowerUpFactory {
  private static instance: PowerUpFactory

  static getInstance(): PowerUpFactory {
    if (!PowerUpFactory.instance) {
      PowerUpFactory.instance = new PowerUpFactory()
    }
    return PowerUpFactory.instance
  }

  create(x: number, type: PowerUp['type']): PowerUp {
    const baseY = randomInt(CANVAS.GROUND_Y - 200, CANVAS.GROUND_Y - 100)

    const base = {
      id: generateId(),
      x,
      y: baseY,
      width: 30,
      height: 30,
      collected: false,
    }

    switch (type) {
      case 'double-jump':
        return {
          ...base,
          type: 'double-jump',
          duration: 10000,
        }
      case 'invincibility':
        return {
          ...base,
          type: 'invincibility',
          duration: 5000,
        }
      case 'speed-boost':
        return {
          ...base,
          type: 'speed-boost',
          multiplier: 1.5,
          duration: 7000,
        }
      case 'slow-motion':
        return {
          ...base,
          type: 'slow-motion',
          factor: 0.5,
          duration: 5000,
        }
      case 'score-multiplier':
        return {
          ...base,
          type: 'score-multiplier',
          multiplier: 2,
          duration: 10000,
        }
    }
  }

  createRandom(x: number): PowerUp {
    const types: PowerUp['type'][] = [
      'double-jump',
      'invincibility',
      'speed-boost',
      'slow-motion',
      'score-multiplier',
    ]
    const type = types[randomInt(0, types.length - 1)] as PowerUp['type']
    return this.create(x, type)
  }
}

/**
 * powerUpFactory utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of powerUpFactory.
 */
export const powerUpFactory = PowerUpFactory.getInstance()

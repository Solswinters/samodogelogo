/**
 * Power-up type definitions
 */

export interface BasePowerUp {
  id: string
  x: number
  y: number
  width: number
  height: number
  collected: boolean
}

export interface DoubleJumpPowerUp extends BasePowerUp {
  type: 'double-jump'
  duration: number
}

export interface InvincibilityPowerUp extends BasePowerUp {
  type: 'invincibility'
  duration: number
}

export interface SpeedBoostPowerUp extends BasePowerUp {
  type: 'speed-boost'
  multiplier: number
  duration: number
}

export interface SlowMotionPowerUp extends BasePowerUp {
  type: 'slow-motion'
  factor: number
  duration: number
}

export interface ScoreMultiplierPowerUp extends BasePowerUp {
  type: 'score-multiplier'
  multiplier: number
  duration: number
}

export type PowerUp =
  | DoubleJumpPowerUp
  | InvincibilityPowerUp
  | SpeedBoostPowerUp
  | SlowMotionPowerUp
  | ScoreMultiplierPowerUp

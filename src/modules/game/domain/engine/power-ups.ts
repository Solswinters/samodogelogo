/**
 * Power-up system with domain logic
 */

import { PowerUp } from "../models";

export type PowerUpType = "shield" | "double-points" | "slow-motion" | "invincibility";

export interface ActivePowerUp {
  type: PowerUpType;
  startTime: number;
  duration: number;
  remaining: number;
}

export class PowerUpManager {
  private activePowerUps: Map<PowerUpType, ActivePowerUp> = new Map();
  private nextId = 0;

  /**
   * Create a power-up at position
   */
  createPowerUp(x: number, y: number, type?: PowerUpType): PowerUp {
    const powerUpType = type ?? this.getRandomType();
    return {
      id: `powerup-${this.nextId++}`,
      type: powerUpType,
      x,
      y,
      width: 30,
      height: 30,
      duration: this.getDuration(powerUpType),
      active: false,
    };
  }

  /**
   * Activate a power-up
   */
  activatePowerUp(powerUp: PowerUp): void {
    this.activePowerUps.set(powerUp.type, {
      type: powerUp.type,
      startTime: Date.now(),
      duration: powerUp.duration,
      remaining: powerUp.duration,
    });
  }

  /**
   * Update active power-ups
   */
  update(deltaTime: number): void {
    this.activePowerUps.forEach((powerUp, type) => {
      powerUp.remaining -= deltaTime;
      if (powerUp.remaining <= 0) {
        this.activePowerUps.delete(type);
      }
    });
  }

  /**
   * Check if power-up is active
   */
  isActive(type: PowerUpType): boolean {
    return this.activePowerUps.has(type);
  }

  /**
   * Get active power-up
   */
  getActivePowerUp(type: PowerUpType): ActivePowerUp | undefined {
    return this.activePowerUps.get(type);
  }

  /**
   * Get all active power-ups
   */
  getAllActive(): ActivePowerUp[] {
    return Array.from(this.activePowerUps.values());
  }

  /**
   * Clear all power-ups
   */
  clear(): void {
    this.activePowerUps.clear();
  }

  /**
   * Get power-up duration
   */
  private getDuration(type: PowerUpType): number {
    const durations: Record<PowerUpType, number> = {
      shield: 5000,
      "double-points": 10000,
      "slow-motion": 7000,
      invincibility: 5000,
    };
    return durations[type];
  }

  /**
   * Get random power-up type
   */
  private getRandomType(): PowerUpType {
    const types: PowerUpType[] = ["shield", "double-points", "slow-motion", "invincibility"];
    return types[Math.floor(Math.random() * types.length)]!;
  }

  /**
   * Get power-up color
   */
  static getColor(type: PowerUpType): string {
    const colors: Record<PowerUpType, string> = {
      shield: "#2196F3",
      "double-points": "#FFD700",
      "slow-motion": "#9C27B0",
      invincibility: "#4CAF50",
    };
    return colors[type];
  }
}


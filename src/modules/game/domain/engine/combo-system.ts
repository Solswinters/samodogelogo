/**
 * Combo scoring system
 */

export interface ComboState {
  count: number;
  multiplier: number;
  lastHitTime: number;
  isActive: boolean;
  maxCombo: number;
}

export class ComboSystem {
  private state: ComboState = {
    count: 0,
    multiplier: 1,
    lastHitTime: 0,
    isActive: false,
    maxCombo: 0,
  };

  private comboTimeout = 2000; // 2 seconds
  private maxMultiplier = 5;
  private multiplierStep = 0.25;

  /**
   * Register a successful hit (obstacle cleared)
   */
  registerHit(): { combo: number; multiplier: number; isNew: boolean } {
    const now = Date.now();
    const timeSinceLastHit = now - this.state.lastHitTime;

    let isNewCombo = false;

    if (timeSinceLastHit > this.comboTimeout) {
      // Combo broke, reset
      this.state.count = 1;
      this.state.multiplier = 1;
      isNewCombo = true;
    } else {
      // Continue combo
      this.state.count++;
      this.state.multiplier = Math.min(
        1 + Math.floor(this.state.count / 5) * this.multiplierStep,
        this.maxMultiplier
      );
    }

    this.state.lastHitTime = now;
    this.state.isActive = true;

    if (this.state.count > this.state.maxCombo) {
      this.state.maxCombo = this.state.count;
    }

    return {
      combo: this.state.count,
      multiplier: this.state.multiplier,
      isNew: isNewCombo,
    };
  }

  /**
   * Break combo (player died or missed)
   */
  breakCombo(): void {
    this.state.count = 0;
    this.state.multiplier = 1;
    this.state.isActive = false;
  }

  /**
   * Update combo state (check timeout)
   */
  update(): void {
    if (this.state.isActive) {
      const now = Date.now();
      const timeSinceLastHit = now - this.state.lastHitTime;

      if (timeSinceLastHit > this.comboTimeout) {
        this.breakCombo();
      }
    }
  }

  /**
   * Get current combo state
   */
  getState(): ComboState {
    return { ...this.state };
  }

  /**
   * Get combo multiplier
   */
  getMultiplier(): number {
    return this.state.multiplier;
  }

  /**
   * Get combo count
   */
  getCombo(): number {
    return this.state.count;
  }

  /**
   * Is combo active
   */
  isActive(): boolean {
    return this.state.isActive && this.state.count > 1;
  }

  /**
   * Get max combo achieved
   */
  getMaxCombo(): number {
    return this.state.maxCombo;
  }

  /**
   * Reset combo system
   */
  reset(): void {
    const maxCombo = this.state.maxCombo;
    this.state = {
      count: 0,
      multiplier: 1,
      lastHitTime: 0,
      isActive: false,
      maxCombo,
    };
  }

  /**
   * Get combo tier (for visual effects)
   */
  getComboTier(): "none" | "bronze" | "silver" | "gold" | "platinum" {
    if (this.state.count < 5) return "none";
    if (this.state.count < 10) return "bronze";
    if (this.state.count < 20) return "silver";
    if (this.state.count < 50) return "gold";
    return "platinum";
  }

  /**
   * Calculate points with combo multiplier
   */
  calculatePoints(basePoints: number): number {
    return Math.floor(basePoints * this.state.multiplier);
  }
}


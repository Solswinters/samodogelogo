/**
 * Feature flags management
 */

type FeatureFlag = string

class FeatureFlagManager {
  private flags: Map<FeatureFlag, boolean> = new Map()
  private defaultFlags: Map<FeatureFlag, boolean> = new Map()

  constructor(defaults?: Record<string, boolean>) {
    if (defaults) {
      Object.entries(defaults).forEach(([key, value]) => {
        this.defaultFlags.set(key, value)
        this.flags.set(key, value)
      })
    }
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.flags.get(flag) ?? this.defaultFlags.get(flag) ?? false
  }

  enable(flag: FeatureFlag): void {
    this.flags.set(flag, true)
  }

  disable(flag: FeatureFlag): void {
    this.flags.set(flag, false)
  }

  toggle(flag: FeatureFlag): void {
    this.flags.set(flag, !this.isEnabled(flag))
  }

  reset(flag?: FeatureFlag): void {
    if (flag) {
      const defaultValue = this.defaultFlags.get(flag) ?? false
      this.flags.set(flag, defaultValue)
    } else {
      this.flags.clear()
      this.defaultFlags.forEach((value, key) => {
        this.flags.set(key, value)
      })
    }
  }

  getAll(): Record<string, boolean> {
    const result: Record<string, boolean> = {}
    this.flags.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
}

/**
 * featureFlags utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of featureFlags.
 */
export const featureFlags = new FeatureFlagManager({
  enableMultiplayer: true,
  enableRewards: true,
  enableLeaderboard: true,
  enableAnalytics: false,
})

/**
 * isFeatureEnabled utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isFeatureEnabled.
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags.isEnabled(flag)
}

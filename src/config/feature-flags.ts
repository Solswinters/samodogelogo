// Feature flags system for controlling feature availability

export interface FeatureFlags {
  // Game features
  multiplayer: boolean
  singlePlayer: boolean
  leaderboard: boolean
  rewards: boolean
  achievements: boolean

  // UI features
  darkMode: boolean
  animations: boolean
  soundEffects: boolean
  music: boolean
  particleEffects: boolean

  // Advanced features
  replayRecording: boolean
  spectatorMode: boolean
  customSkins: boolean
  powerUps: boolean
  tournament: boolean

  // Development features
  devTools: boolean
  debugMode: boolean
  performanceMonitor: boolean
  errorBoundary: boolean
}

// Default feature flags
const defaultFlags: FeatureFlags = {
  // Game features
  multiplayer: true,
  singlePlayer: true,
  leaderboard: true,
  rewards: true,
  achievements: false,

  // UI features
  darkMode: true,
  animations: true,
  soundEffects: false,
  music: false,
  particleEffects: true,

  // Advanced features
  replayRecording: false,
  spectatorMode: false,
  customSkins: false,
  powerUps: false,
  tournament: false,

  // Development features
  devTools: process.env.NODE_ENV === 'development',
  debugMode: process.env.NODE_ENV === 'development',
  performanceMonitor: process.env.NODE_ENV === 'development',
  errorBoundary: true,
}

// Feature flag manager
class FeatureFlagManager {
  private flags: FeatureFlags

  constructor(initialFlags: FeatureFlags = defaultFlags) {
    this.flags = { ...initialFlags }
    this.loadFromEnvironment()
  }

  // Load flags from environment variables
  private loadFromEnvironment(): void {
    if (typeof window === 'undefined') {
      return // Server-side, skip
    }

    // Load from localStorage if available
    try {
      const stored = localStorage.getItem('feature-flags')
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<FeatureFlags>
        this.flags = { ...this.flags, ...parsed }
      }
    } catch (error) {
      console.error('Failed to load feature flags from storage:', error)
    }
  }

  // Save flags to localStorage
  private saveToStorage(): void {
    if (typeof window === 'undefined') {
      return // Server-side, skip
    }

    try {
      localStorage.setItem('feature-flags', JSON.stringify(this.flags))
    } catch (error) {
      console.error('Failed to save feature flags to storage:', error)
    }
  }

  // Check if a feature is enabled
  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature] ?? false
  }

  // Enable a feature
  enable(feature: keyof FeatureFlags): void {
    this.flags[feature] = true
    this.saveToStorage()
  }

  // Disable a feature
  disable(feature: keyof FeatureFlags): void {
    this.flags[feature] = false
    this.saveToStorage()
  }

  // Toggle a feature
  toggle(feature: keyof FeatureFlags): void {
    this.flags[feature] = !this.flags[feature]
    this.saveToStorage()
  }

  // Get all flags
  getAll(): FeatureFlags {
    return { ...this.flags }
  }

  // Set multiple flags at once
  setFlags(flags: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...flags }
    this.saveToStorage()
  }

  // Reset to default flags
  reset(): void {
    this.flags = { ...defaultFlags }
    this.saveToStorage()
  }

  // Check if any development feature is enabled
  isDevelopment(): boolean {
    return this.flags.devTools || this.flags.debugMode || this.flags.performanceMonitor
  }
}

// Export singleton instance
export const featureFlags = new FeatureFlagManager()

// Export default flags
export { defaultFlags as defaultFeatureFlags }

// Helper hook-style function for React components
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  return featureFlags.isEnabled(feature)
}

// Environment-based feature availability
export const FEATURE_AVAILABILITY = {
  development: {
    multiplayer: true,
    singlePlayer: true,
    leaderboard: true,
    rewards: true,
    achievements: true,
    replayRecording: true,
    spectatorMode: true,
    customSkins: true,
    powerUps: true,
    tournament: true,
  },
  production: {
    multiplayer: true,
    singlePlayer: true,
    leaderboard: true,
    rewards: true,
    achievements: false,
    replayRecording: false,
    spectatorMode: false,
    customSkins: false,
    powerUps: false,
    tournament: false,
  },
  test: {
    multiplayer: true,
    singlePlayer: true,
    leaderboard: false,
    rewards: false,
    achievements: false,
    replayRecording: false,
    spectatorMode: false,
    customSkins: false,
    powerUps: false,
    tournament: false,
  },
} as const


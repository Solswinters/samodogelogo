/**
 * Feature flags configuration
 */

export interface FeatureFlags {
  enableMultiplayer: boolean
  enableRewards: boolean
  enableLeaderboards: boolean
  enableAchievements: boolean
  enableTournaments: boolean
  enableNFTs: boolean
  enableStaking: boolean
  enableDailyChallenge: boolean
  enableReplayMode: boolean
  enableSpectatorMode: boolean
  enableVoiceChat: boolean
  experimentalPhysics: boolean
  experimentalUI: boolean
}

const defaultFeatures: FeatureFlags = {
  enableMultiplayer: true,
  enableRewards: true,
  enableLeaderboards: true,
  enableAchievements: true,
  enableTournaments: false,
  enableNFTs: false,
  enableStaking: false,
  enableDailyChallenge: true,
  enableReplayMode: true,
  enableSpectatorMode: true,
  enableVoiceChat: false,
  experimentalPhysics: false,
  experimentalUI: false,
}

class FeatureManager {
  private features: FeatureFlags

  constructor() {
    this.features = this.loadFeatures()
  }

  private loadFeatures(): FeatureFlags {
    if (typeof window === 'undefined') {
      return defaultFeatures
    }

    try {
      const stored = localStorage.getItem('feature_flags')
      if (stored) {
        return { ...defaultFeatures, ...JSON.parse(stored) }
      }
    } catch {
      // Ignore errors
    }

    return defaultFeatures
  }

  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.features[feature]
  }

  enable(feature: keyof FeatureFlags) {
    this.features[feature] = true
    this.saveFeatures()
  }

  disable(feature: keyof FeatureFlags) {
    this.features[feature] = false
    this.saveFeatures()
  }

  private saveFeatures() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('feature_flags', JSON.stringify(this.features))
      } catch {
        // Ignore errors
      }
    }
  }

  getAllFeatures(): FeatureFlags {
    return { ...this.features }
  }
}

export const featureManager = new FeatureManager()

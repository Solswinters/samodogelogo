/**
 * Daily Rewards - Daily login reward system
 */

export interface DailyReward {
  day: number
  coins: number
  tokens: number
  bonus?: string
}

export class DailyRewards {
  private lastClaimDate: Date | null = null
  private currentStreak: number = 0
  private rewards: DailyReward[] = [
    { day: 1, coins: 100, tokens: 1 },
    { day: 2, coins: 150, tokens: 1 },
    { day: 3, coins: 200, tokens: 2 },
    { day: 4, coins: 250, tokens: 2 },
    { day: 5, coins: 300, tokens: 3 },
    { day: 6, coins: 400, tokens: 4 },
    { day: 7, coins: 500, tokens: 5, bonus: 'premium_skin' },
  ]

  canClaim(): boolean {
    if (!this.lastClaimDate) return true
    const now = new Date()
    const lastClaim = new Date(this.lastClaimDate)
    const diffDays = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays >= 1
  }

  claimReward(): DailyReward | null {
    if (!this.canClaim()) return null

    const rewardIndex = this.currentStreak % this.rewards.length
    const reward = this.rewards[rewardIndex]

    this.lastClaimDate = new Date()
    this.currentStreak++

    return reward
  }

  getStreak(): number {
    return this.currentStreak
  }

  getNextReward(): DailyReward {
    const nextIndex = this.currentStreak % this.rewards.length
    return this.rewards[nextIndex]
  }

  reset(): void {
    this.lastClaimDate = null
    this.currentStreak = 0
  }

  loadFromStorage(): void {
    const data = localStorage.getItem('daily-rewards')
    if (data) {
      const parsed = JSON.parse(data)
      this.lastClaimDate = parsed.lastClaimDate ? new Date(parsed.lastClaimDate) : null
      this.currentStreak = parsed.currentStreak || 0
    }
  }

  saveToStorage(): void {
    localStorage.setItem(
      'daily-rewards',
      JSON.stringify({
        lastClaimDate: this.lastClaimDate,
        currentStreak: this.currentStreak,
      })
    )
  }
}

export default DailyRewards

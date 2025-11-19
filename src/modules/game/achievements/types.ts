/**
 * Achievement system types
 */

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
  progress: number
  target: number
  category: 'score' | 'time' | 'combo' | 'obstacles' | 'special'
}

export type AchievementTrigger =
  | { type: 'score'; value: number }
  | { type: 'time'; value: number }
  | { type: 'combo'; value: number }
  | { type: 'obstacles'; value: number }
  | { type: 'special'; id: string }

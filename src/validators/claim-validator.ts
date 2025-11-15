/**
 * Claim validation schemas and functions
 */

import { z } from 'zod'

export const ClaimRequestSchema = z.object({
  playerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  score: z.number().int().min(0).max(1000000),
  isWinner: z.boolean(),
  nonce: z.number().int().min(0),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature'),
})

export type ClaimRequest = z.infer<typeof ClaimRequestSchema>

export const ScoreSubmissionSchema = z.object({
  score: z.number().int().min(0).max(1000000),
  gameTime: z.number().min(0),
  obstaclesCleared: z.number().int().min(0),
  difficulty: z.number().int().min(1).max(10),
  timestamp: z.number().int(),
})

export type ScoreSubmission = z.infer<typeof ScoreSubmissionSchema>

export function validateClaim(data: unknown): {
  success: boolean
  data?: ClaimRequest
  errors?: string[]
} {
  const result = ClaimRequestSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.issues.map(issue => {
    return `${issue.path.join('.')}: ${issue.message}`
  })

  return {
    success: false,
    errors,
  }
}

export function validateScore(data: unknown): {
  success: boolean
  data?: ScoreSubmission
  errors?: string[]
} {
  const result = ScoreSubmissionSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors = result.error.issues.map(issue => {
    return `${issue.path.join('.')}: ${issue.message}`
  })

  return {
    success: false,
    errors,
  }
}

export function isValidClaimTiming(lastClaimTime: number, cooldownPeriod: number): boolean {
  return Date.now() - lastClaimTime >= cooldownPeriod * 1000
}

export function calculateMaxPossibleScore(gameTime: number): number {
  // Maximum theoretical score based on perfect play
  const seconds = Math.floor(gameTime / 1000)
  const maxTimeScore = seconds * 10
  const maxObstacleScore = seconds * 5 // Assume 1 obstacle per second max
  const maxBonuses = (maxTimeScore + maxObstacleScore) * 0.5
  return Math.floor(maxTimeScore + maxObstacleScore + maxBonuses)
}

export function isScoreRealistic(score: number, gameTime: number): boolean {
  const maxPossible = calculateMaxPossibleScore(gameTime)
  return score <= maxPossible
}

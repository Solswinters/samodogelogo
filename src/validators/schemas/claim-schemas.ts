/**
 * Claim validation schemas
 */

import { z } from 'zod'
import { addressSchema } from './wallet-schemas'

export const claimRequestSchema = z.object({
  address: addressSchema,
  score: z.number().int().min(0).max(1000000),
  sessionId: z.string().uuid(),
  timestamp: z.number().int().positive(),
})

export const claimResponseSchema = z.object({
  success: z.boolean(),
  amount: z.string(),
  txHash: z.string().optional(),
  error: z.string().optional(),
})

export const rewardEstimateSchema = z.object({
  address: addressSchema,
  score: z.number().int().min(0),
  isWinner: z.boolean().default(false),
})

export const rewardEstimateResponseSchema = z.object({
  baseReward: z.string(),
  scoreBonus: z.string(),
  totalReward: z.string(),
  multiplier: z.number().positive(),
})

export type ClaimRequest = z.infer<typeof claimRequestSchema>
export type ClaimResponse = z.infer<typeof claimResponseSchema>
export type RewardEstimate = z.infer<typeof rewardEstimateSchema>
export type RewardEstimateResponse = z.infer<typeof rewardEstimateResponseSchema>

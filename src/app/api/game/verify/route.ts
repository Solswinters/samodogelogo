/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { ethers } from 'ethers'
import { successResponse, badRequestResponse } from '@/middleware/response'
import { HTTP_STATUS } from '@/constants/api'

// Score verification schema
const VerifyScoreSchema = z.object({
  address: z.string().refine(ethers.isAddress, 'Invalid wallet address'),
  score: z.number().int().min(0).max(50000),
  gameData: z.object({
    duration: z.number().min(0),
    obstacles: z.number().int().min(0),
    timestamp: z.number().int(),
  }),
})

// Anti-cheat validation rules
const ANTI_CHEAT_RULES = {
  MAX_SCORE_PER_SECOND: 50, // Maximum score achievable per second
  MIN_GAME_DURATION: 5000, // Minimum game duration in ms
  MAX_OBSTACLES_PER_SECOND: 5, // Maximum obstacles that can be passed per second
}

// Verify game score for anti-cheat
function verifyGameScore(data: { score: number; duration: number; obstacles: number }): {
  valid: boolean
  reason?: string
} {
  const { score, duration, obstacles } = data

  // Check minimum duration
  if (duration < ANTI_CHEAT_RULES.MIN_GAME_DURATION) {
    return {
      valid: false,
      reason: `Game duration too short (${duration}ms)`,
    }
  }

  // Check score vs duration ratio
  const scorePerSecond = (score / duration) * 1000
  if (scorePerSecond > ANTI_CHEAT_RULES.MAX_SCORE_PER_SECOND) {
    return {
      valid: false,
      reason: `Score per second too high (${scorePerSecond.toFixed(2)})`,
    }
  }

  // Check obstacles vs duration ratio
  const obstaclesPerSecond = (obstacles / duration) * 1000
  if (obstaclesPerSecond > ANTI_CHEAT_RULES.MAX_OBSTACLES_PER_SECOND) {
    return {
      valid: false,
      reason: `Obstacles per second too high (${obstaclesPerSecond.toFixed(2)})`,
    }
  }

  // Check if game timestamp is reasonable (within last hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  if (data.duration < oneHourAgo) {
    return {
      valid: false,
      reason: 'Game timestamp too old',
    }
  }

  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const validation = VerifyScoreSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return badRequestResponse(firstError?.message ?? 'Invalid verification data')
    }

    const { address, score, gameData } = validation.data

    // Perform anti-cheat verification
    const verificationResult = verifyGameScore({
      score,
      duration: gameData.duration,
      obstacles: gameData.obstacles,
    })

    if (!verificationResult.valid) {
      return successResponse(
        {
          valid: false,
          reason: verificationResult.reason,
          address,
          score,
        },
        'Score verification failed',
        undefined,
        HTTP_STATUS.OK
      )
    }

    // Score is valid
    return successResponse(
      {
        valid: true,
        address,
        score,
        gameData,
        verifiedAt: new Date().toISOString(),
      },
      'Score verified successfully'
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Verification failed'
    return badRequestResponse(errorMessage)
  }
}

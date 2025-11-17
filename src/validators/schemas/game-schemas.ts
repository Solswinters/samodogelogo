/**
 * Game validation schemas
 */

import { z } from 'zod'

export const gameScoreSchema = z.object({
  score: z.number().int().min(0).max(1000000),
  timestamp: z.number().int().positive(),
  sessionId: z.string().uuid(),
})

export const gameSessionSchema = z.object({
  id: z.string().uuid(),
  mode: z.enum(['single', 'multi']),
  difficulty: z.number().int().min(1).max(10),
  playerId: z.string(),
})

export const obstacleSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  speed: z.number().positive(),
})

export const playerPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  velocityY: z.number(),
  isJumping: z.boolean(),
  isAlive: z.boolean(),
})

export type GameScore = z.infer<typeof gameScoreSchema>
export type GameSession = z.infer<typeof gameSessionSchema>
export type Obstacle = z.infer<typeof obstacleSchema>
export type PlayerPosition = z.infer<typeof playerPositionSchema>

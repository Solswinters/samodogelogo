import { z } from 'zod'
import { ethers } from 'ethers'

// Common field validators
export const addressValidator = z.string().refine(ethers.isAddress, {
  message: 'Invalid Ethereum address format',
})

export const scoreValidator = z.number().int().min(0).max(50000)

export const timestampValidator = z.number().int().positive()

// Game-specific schemas
export const GameScoreSchema = z.object({
  score: scoreValidator,
  obstacles: z.number().int().min(0),
  duration: z.number().min(0),
  timestamp: timestampValidator,
})

export const GameSessionSchema = z.object({
  address: addressValidator,
  sessionId: z.string().uuid(),
  startedAt: timestampValidator,
  gameMode: z.enum(['single', 'multiplayer']),
})

export const GameResultSchema = z.object({
  address: addressValidator,
  score: scoreValidator,
  isWinner: z.boolean(),
  gameData: GameScoreSchema,
  signature: z.string().optional(),
})

// Multiplayer schemas
export const CreateRoomSchema = z.object({
  address: addressValidator,
  roomName: z.string().min(3).max(50),
  maxPlayers: z.number().int().min(2).max(8).default(4),
  isPrivate: z.boolean().default(false),
})

export const JoinRoomSchema = z.object({
  address: addressValidator,
  roomId: z.string().uuid(),
  password: z.string().optional(),
})

// Contract interaction schemas
export const TransactionSchema = z.object({
  hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  from: addressValidator,
  to: addressValidator,
  value: z.string(),
  gasUsed: z.string().optional(),
  blockNumber: z.number().int().positive().optional(),
})

export const SignatureSchema = z.object({
  message: z.string().min(1),
  signature: z.string().regex(/^0x[a-fA-F0-9]{130}$/, 'Invalid signature format'),
  address: addressValidator,
})

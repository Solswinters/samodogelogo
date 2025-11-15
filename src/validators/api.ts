import { z } from 'zod'
import { addressValidator, scoreValidator } from './game'

// API request schemas
export const ClaimRequestSchema = z.object({
  address: addressValidator,
  score: scoreValidator,
  isWinner: z.boolean(),
})

export const LeaderboardQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  period: z.enum(['daily', 'weekly', 'monthly', 'all-time']).default('all-time'),
})

export const StatsQuerySchema = z.object({
  address: addressValidator.optional(),
  period: z.enum(['24h', '7d', '30d', 'all']).default('all'),
})

export const VerifyScoreSchema = z.object({
  address: addressValidator,
  score: scoreValidator,
  gameData: z.object({
    duration: z.number().min(0),
    obstacles: z.number().int().min(0),
    timestamp: z.number().int(),
  }),
})

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
})

// Sort schema
export const SortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Filter schema
export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains']),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.unknown())]),
})

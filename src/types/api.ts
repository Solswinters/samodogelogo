/**
 * API-related type definitions
 */

import type { Address } from 'viem'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp?: number
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface HealthCheckResponse {
  status: 'ok' | 'error' | 'degraded'
  timestamp: number
  version?: string
  uptime?: number
  message?: string
}

export interface StatsResponse {
  totalPlayers: number
  activeGames: number
  totalGamesPlayed: number
  totalRewardsClaimed: string
  averageScore: number
  highScore: number
  timestamp: number
}

export interface PlayerStatsResponse {
  playerAddress: Address
  totalClaimed: string
  gamesPlayed: number
  highestScore: number
  averageScore: number
  timeUntilNextClaim: number
  rank?: number
}

export interface LeaderboardEntry {
  playerAddress: Address
  score: number
  timestamp: number
  rank: number
  isWinner: boolean
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  totalPlayers: number
  playerRank?: number
  playerHighestScore?: number
  updatedAt: number
}

export interface ClaimRewardRequest {
  playerAddress: Address
  score: number
  isWinner: boolean
  nonce: number
  signature: `0x${string}`
}

export interface ClaimRewardResponse {
  transactionHash: `0x${string}`
  rewardAmount: string
  newTotalClaimed: string
  nextClaimAvailable: number
}

export interface SubmitScoreRequest {
  playerAddress: Address
  score: number
  timestamp: number
  sessionId?: string
}

export interface SubmitScoreResponse {
  success: boolean
  message: string
  newHighScore?: boolean
  rank?: number
}

export interface GameSessionRequest {
  playerAddress: Address
  mode: 'single' | 'multi'
}

export interface GameSessionResponse {
  sessionId: string
  startTime: number
  expiresAt: number
}

export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers: Record<string, string>
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number
}

export interface WebSocketMessage<T = unknown> {
  type: string
  payload: T
  timestamp: number
  id?: string
}

export interface ApiCache<T> {
  data: T
  timestamp: number
  expiresAt: number
}

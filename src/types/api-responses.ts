// API Response type definitions

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, any>
    timestamp: string
    path: string
  }
}

export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
  timestamp: string
}

export interface FailureResponse {
  success: false
  error: string
  code?: string
  timestamp: string
}

export type ApiResponse<T = any> = SuccessResponse<T> | FailureResponse

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded'
  uptime: number
  timestamp: string
  services: {
    database?: 'up' | 'down'
    blockchain?: 'up' | 'down'
    socket?: 'up' | 'down'
  }
}

export interface LeaderboardEntry {
  rank: number
  address: string
  username?: string
  score: number
  gamesPlayed: number
  winRate: number
  totalRewards: string
  lastActive: string
}

export interface StatsResponse {
  totalPlayers: number
  totalGames: number
  totalRewardsDistributed: string
  averageScore: number
  highestScore: number
  activePlayersToday: number
  gamesPlayedToday: number
}


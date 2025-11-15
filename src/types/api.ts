export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface ClaimRequest {
  address: string
  score: number
  isWinner: boolean
}

export interface ClaimResponse {
  nonce: number
  signature: `0x${string}`
  message: string
}

export interface EstimateRequest {
  score: number
  isWinner: boolean
}

export interface EstimateResponse {
  estimatedReward: string
  cooldownRemaining: number
  canClaim: boolean
}

export interface ApiError {
  error: string
  statusCode: number
  timestamp: string
}


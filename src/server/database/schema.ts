// Database schema definitions
// NOTE: This is a placeholder for future database implementation
// Currently using in-memory storage

export interface UserRecord {
  id: string
  address: string
  username?: string
  createdAt: Date
  lastLoginAt: Date
}

export interface GameSessionRecord {
  id: string
  userId: string
  score: number
  duration: number
  obstacles: number
  isWinner: boolean
  timestamp: Date
  gameMode: 'single' | 'multiplayer'
}

export interface LeaderboardRecord {
  userId: string
  address: string
  username?: string
  highestScore: number
  totalGames: number
  totalWins: number
  averageScore: number
  lastPlayed: Date
}

export interface RoomRecord {
  id: string
  name: string
  hostId: string
  maxPlayers: number
  isPrivate: boolean
  status: 'waiting' | 'playing' | 'finished'
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
}

export interface TransactionRecord {
  id: string
  userId: string
  type: 'claim' | 'stake' | 'unstake' | 'reward'
  amount: string
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: Date
  confirmations: number
}

// TODO: Implement actual database operations with Prisma or similar
export const db = {
  users: {
    findById: async (id: string): Promise<UserRecord | null> => {
      // Placeholder
      return null
    },
    findByAddress: async (address: string): Promise<UserRecord | null> => {
      // Placeholder
      return null
    },
    create: async (
      data: Omit<UserRecord, 'id' | 'createdAt' | 'lastLoginAt'>
    ): Promise<UserRecord> => {
      // Placeholder
      throw new Error('Not implemented')
    },
    update: async (id: string, data: Partial<UserRecord>): Promise<UserRecord> => {
      // Placeholder
      throw new Error('Not implemented')
    },
  },
  gameSessions: {
    create: async (
      data: Omit<GameSessionRecord, 'id' | 'timestamp'>
    ): Promise<GameSessionRecord> => {
      // Placeholder
      throw new Error('Not implemented')
    },
    findByUserId: async (userId: string, limit?: number): Promise<GameSessionRecord[]> => {
      // Placeholder
      return []
    },
    getStats: async (
      userId: string
    ): Promise<{
      totalGames: number
      totalScore: number
      highestScore: number
      averageScore: number
      wins: number
    }> => {
      // Placeholder
      return {
        totalGames: 0,
        totalScore: 0,
        highestScore: 0,
        averageScore: 0,
        wins: 0,
      }
    },
  },
  leaderboard: {
    getTop: async (limit: number = 100): Promise<LeaderboardRecord[]> => {
      // Placeholder
      return []
    },
    getRank: async (userId: string): Promise<number | null> => {
      // Placeholder
      return null
    },
  },
  transactions: {
    create: async (
      data: Omit<TransactionRecord, 'id' | 'timestamp'>
    ): Promise<TransactionRecord> => {
      // Placeholder
      throw new Error('Not implemented')
    },
    findByUserId: async (userId: string, limit?: number): Promise<TransactionRecord[]> => {
      // Placeholder
      return []
    },
    updateStatus: async (
      id: string,
      status: TransactionRecord['status']
    ): Promise<TransactionRecord> => {
      // Placeholder
      throw new Error('Not implemented')
    },
  },
}

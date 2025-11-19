/**
 * Mock Service Worker handlers for API mocking
 */

import { http, HttpResponse } from 'msw'

export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  }),

  // Stats
  http.get('/api/stats', () => {
    return HttpResponse.json({
      totalPlayers: 1250,
      activeGames: 47,
      totalRewards: '15,000',
      averageScore: 4523,
    })
  }),

  // Leaderboard
  http.get('/api/leaderboard', () => {
    return HttpResponse.json([
      { rank: 1, address: '0x1234...5678', score: 15420, username: 'Player1' },
      { rank: 2, address: '0xabcd...efgh', score: 14230, username: 'Player2' },
    ])
  }),
]

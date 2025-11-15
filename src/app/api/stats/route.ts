/**
 * Game statistics endpoint
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement actual stats fetching from database
  const stats = {
    totalPlayers: 0,
    totalGamesPlayed: 0,
    totalRewardsClaimed: 0,
    averageScore: 0,
    highestScore: 0,
  }

  return NextResponse.json({
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
  })
}

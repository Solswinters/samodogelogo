/**
 * Matchmaking utilities
 */

export interface MatchmakingPlayer {
  id: string
  rating: number
  region: string
  waitTime: number
}

export function calculateMatchQuality(players: MatchmakingPlayer[]): number {
  if (players.length < 2) return 0

  const ratings = players.map(p => p.rating)
  const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length
  const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / ratings.length

  // Lower variance = higher quality match
  const maxVariance = 1000000 // Assuming max rating difference of 1000
  return Math.max(0, 1 - variance / maxVariance)
}

export function findBestMatch(
  player: MatchmakingPlayer,
  candidates: MatchmakingPlayer[],
  maxRatingDiff = 200
): MatchmakingPlayer | null {
  const eligible = candidates.filter(
    c =>
      c.id !== player.id &&
      c.region === player.region &&
      Math.abs(c.rating - player.rating) <= maxRatingDiff
  )

  if (eligible.length === 0) return null

  // Find closest rating
  return eligible.reduce((best, current) =>
    Math.abs(current.rating - player.rating) < Math.abs(best.rating - player.rating)
      ? current
      : best
  )
}

export function expandSearchCriteria(
  maxRatingDiff: number,
  waitTime: number,
  baseRatingDiff = 100,
  expansionRate = 50
): number {
  const expansions = Math.floor(waitTime / 10000) // Expand every 10 seconds
  return Math.min(maxRatingDiff, baseRatingDiff + expansions * expansionRate)
}

export function shouldAcceptMatch(
  quality: number,
  waitTime: number,
  minQuality = 0.7,
  maxWaitTime = 60000
): boolean {
  if (quality >= minQuality) return true
  if (waitTime >= maxWaitTime) return quality >= minQuality * 0.5
  return false
}

export function prioritizePlayers(players: MatchmakingPlayer[]): MatchmakingPlayer[] {
  return [...players].sort((a, b) => {
    // Priority: wait time descending, then rating ascending
    if (b.waitTime !== a.waitTime) {
      return b.waitTime - a.waitTime
    }
    return a.rating - b.rating
  })
}

export function createBalancedTeams(
  players: MatchmakingPlayer[],
  teamSize: number
): MatchmakingPlayer[][] {
  const sorted = [...players].sort((a, b) => b.rating - a.rating)
  const teams: MatchmakingPlayer[][] = [[], []]

  // Alternate assignment to balance teams
  sorted.forEach((player, index) => {
    teams[index % 2].push(player)
  })

  return teams
}

export function estimateWaitTime(
  playersInQueue: number,
  avgMatchTime: number,
  teamSize: number
): number {
  if (playersInQueue < teamSize * 2) {
    return avgMatchTime * 2 // Need more players
  }

  const matchesPerCycle = Math.floor(playersInQueue / (teamSize * 2))
  return avgMatchTime / Math.max(1, matchesPerCycle)
}

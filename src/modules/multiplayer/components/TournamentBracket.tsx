/**
 * Tournament bracket component
 */

'use client'

import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'

interface Match {
  id: string
  player1: { id: string; name: string; score?: number }
  player2: { id: string; name: string; score?: number }
  winner?: string
  round: number
}

interface TournamentBracketProps {
  matches: Match[]
  currentRound: number
}

export function TournamentBracket({ matches, currentRound }: TournamentBracketProps) {
  const rounds = Math.max(...matches.map(m => m.round)) + 1

  const getMatchesForRound = (round: number) => {
    return matches.filter(m => m.round === round)
  }

  const getRoundName = (round: number) => {
    const matchesInRound = matches.filter(m => m.round === round).length
    if (matchesInRound === 1) return 'Finals'
    if (matchesInRound === 2) return 'Semi-Finals'
    if (matchesInRound === 4) return 'Quarter-Finals'
    return `Round ${round + 1}`
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-8">
        {Array.from({ length: rounds }).map((_, round) => (
          <div key={round} className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{getRoundName(round)}</h3>
              {round === currentRound && <Badge variant="default">Live</Badge>}
            </div>

            <div className="space-y-4">
              {getMatchesForRound(round).map(match => (
                <Card key={match.id} className="p-3">
                  <div className="space-y-2">
                    <div
                      className={`flex items-center justify-between rounded p-2 ${
                        match.winner === match.player1.id ? 'bg-green-500/20' : 'bg-gray-700/50'
                      }`}
                    >
                      <span className="font-medium text-white">{match.player1.name}</span>
                      {match.player1.score !== undefined && (
                        <span className="text-gray-400">{match.player1.score}</span>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between rounded p-2 ${
                        match.winner === match.player2.id ? 'bg-green-500/20' : 'bg-gray-700/50'
                      }`}
                    >
                      <span className="font-medium text-white">{match.player2.name}</span>
                      {match.player2.score !== undefined && (
                        <span className="text-gray-400">{match.player2.score}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

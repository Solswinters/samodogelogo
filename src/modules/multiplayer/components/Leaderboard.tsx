'use client'

import React from 'react'
import type { Player } from '@/modules/game/domain/engine'

interface LeaderboardProps {
  players: Map<string, Player>
  currentPlayerId?: string
}

export default function Leaderboard({ players, currentPlayerId }: LeaderboardProps) {
  const sortedPlayers = Array.from(players.entries())
    .map(([id, player]) => ({ id, ...player }))
    .sort((a, b) => b.score - a.score)

  if (sortedPlayers.length === 0) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 w-64 shadow-xl">
      <h3 className="text-lg font-bold mb-3 text-center border-b border-gray-700 pb-2">
        🏆 Leaderboard
      </h3>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId
          const isAlive = player.isAlive

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                isCurrentPlayer ? 'bg-blue-600/30 border border-blue-500' : 'bg-gray-800/50'
              } ${!isAlive ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: player.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {isCurrentPlayer ? 'You' : `Player ${index + 1}`}
                  </div>
                  {!isAlive && <div className="text-xs text-red-400">💀 Dead</div>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-yellow-400">{player.score}</div>
              </div>
            </div>
          )
        })}
      </div>
      {sortedPlayers.some(p => !p.isAlive) && sortedPlayers.some(p => p.isAlive) && (
        <div className="mt-3 pt-3 border-t border-gray-700 text-center text-xs text-gray-400">
          Game continues until all players die
        </div>
      )}
    </div>
  )
}

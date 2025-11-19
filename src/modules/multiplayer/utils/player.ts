/**
 * Player utilities for multiplayer
 */

export interface Player {
  id: string
  name: string
  score: number
  isAlive: boolean
  isReady: boolean
}

export function createPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    score: 0,
    isAlive: true,
    isReady: false,
  }
}

export function getPlayerRank(player: Player, players: Player[]): number {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  return sortedPlayers.findIndex(p => p.id === player.id) + 1
}

export function getTopPlayer(players: Player[]): Player | null {
  if (players.length === 0) {
    return null
  }

  return players.reduce((top, current) => (current.score > top.score ? current : top))
}

export function getAlivePlayers(players: Player[]): Player[] {
  return players.filter(p => p.isAlive)
}

export function areAllPlayersReady(players: Player[]): boolean {
  return players.length > 0 && players.every(p => p.isReady)
}

export function formatPlayerName(name: string, maxLength: number = 12): string {
  if (name.length <= maxLength) {
    return name
  }

  return `${name.slice(0, maxLength - 3)}...`
}

export function getPlayerInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1 && words[0]) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return words
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

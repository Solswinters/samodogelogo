/**
 * Hook for team management
 */

import { useState, useCallback, useEffect } from 'react'
import { TeamService } from '../services/TeamService'
import { useWebSocket } from './useWebSocket'
import type { TeamInfo, PlayerInfo } from '../types'

// Singleton service
const teamService = new TeamService()

export function useTeam() {
  const { send, on } = useWebSocket()
  const [teams, setTeams] = useState<TeamInfo[]>([])
  const [myTeam, setMyTeam] = useState<TeamInfo | null>(null)

  // Listen for team updates
  useEffect(() => {
    const unsubscribe = on('team_update', event => {
      const updatedTeams = event.data as TeamInfo[]
      setTeams(updatedTeams)
    })

    return unsubscribe
  }, [on])

  const createTeam = useCallback(
    (name: string, color: string) => {
      const team = teamService.createTeam(name, color)
      send('create_team', team)
      return team
    },
    [send]
  )

  const joinTeam = useCallback(
    (teamId: string, player: PlayerInfo) => {
      const success = teamService.addPlayer(teamId, player)
      if (success) {
        send('join_team', { teamId, player })
        setMyTeam(teamService.getTeam(teamId) ?? null)
      }
      return success
    },
    [send]
  )

  const leaveTeam = useCallback(
    (teamId: string, playerId: string) => {
      teamService.removePlayer(teamId, playerId)
      send('leave_team', { teamId, playerId })
      setMyTeam(null)
    },
    [send]
  )

  return {
    teams,
    myTeam,
    createTeam,
    joinTeam,
    leaveTeam,
  }
}

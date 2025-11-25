/**
 * Hook for WalletConnect operations
 */

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import {
  WalletConnectService,
  type WalletConnectSession,
  type WalletConnectProposal,
} from '../services/WalletConnectService'

// Singleton service instance
const walletConnectService = new WalletConnectService()

/**
 * useWalletConnect utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useWalletConnect.
 */
export function useWalletConnect() {
  const { address } = useAccount()
  const [sessions, setSessions] = useState<WalletConnectSession[]>([])
  const [proposals, setProposals] = useState<WalletConnectProposal[]>([])

  const refreshSessions = useCallback(() => {
    walletConnectService.clearExpiredSessions()
    setSessions(walletConnectService.getSessions())
  }, [])

  const refreshProposals = useCallback(() => {
    setProposals(walletConnectService.getProposals())
  }, [])

  useEffect(() => {
    refreshSessions()
    refreshProposals()

    // Refresh every minute
    const interval = setInterval(() => {
      refreshSessions()
    }, 60000)

    return () => clearInterval(interval)
  }, [refreshSessions, refreshProposals])

  const approveProposal = useCallback(
    async (proposalId: string, chainId: number): Promise<boolean> => {
      if (!address) return false

      const session = await walletConnectService.approveProposal(proposalId, address, chainId)

      if (session) {
        refreshSessions()
        refreshProposals()
        return true
      }

      return false
    },
    [address, refreshSessions, refreshProposals]
  )

  const rejectProposal = useCallback(
    async (proposalId: string): Promise<void> => {
      await walletConnectService.rejectProposal(proposalId)
      refreshProposals()
    },
    [refreshProposals]
  )

  const disconnectSession = useCallback(
    async (topic: string): Promise<void> => {
      await walletConnectService.disconnectSession(topic)
      refreshSessions()
    },
    [refreshSessions]
  )

  return {
    sessions,
    proposals,
    approveProposal,
    rejectProposal,
    disconnectSession,
    hasSessions: sessions.length > 0,
    hasProposals: proposals.length > 0,
  }
}

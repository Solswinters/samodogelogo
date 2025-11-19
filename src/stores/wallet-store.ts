import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type ChainId = number
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface PlayerStats {
  gamesPlayed: number
  totalWins: number
  highestScore: number
  totalClaimed: string
  lastClaimTime: number
}

interface Transaction {
  hash: string
  type: 'claim' | 'stake' | 'unstake' | 'approve'
  status: 'pending' | 'success' | 'failed'
  timestamp: number
  amount?: string
}

interface WalletStoreState {
  // Connection Status
  address: string | null
  chainId: ChainId | null
  status: ConnectionStatus
  isConnecting: boolean
  error: string | null

  // Balances
  tokenBalance: string
  nativeBalance: string
  stakedBalance: string

  // Player Data
  playerStats: PlayerStats | null
  canClaim: boolean
  nextClaimTime: number
  pendingRewards: string

  // Transactions
  transactions: Transaction[]
  pendingTxCount: number

  // Actions
  setAddress: (address: string | null) => void
  setChainId: (chainId: ChainId | null) => void
  setStatus: (status: ConnectionStatus) => void
  setError: (error: string | null) => void
  setTokenBalance: (balance: string) => void
  setNativeBalance: (balance: string) => void
  setStakedBalance: (balance: string) => void
  setPlayerStats: (stats: PlayerStats | null) => void
  setCanClaim: (canClaim: boolean) => void
  setNextClaimTime: (time: number) => void
  setPendingRewards: (rewards: string) => void
  addTransaction: (tx: Transaction) => void
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void
  clearTransactions: () => void
  disconnect: () => void
  reset: () => void
}

const initialState = {
  address: null,
  chainId: null,
  status: 'disconnected' as ConnectionStatus,
  isConnecting: false,
  error: null,
  tokenBalance: '0',
  nativeBalance: '0',
  stakedBalance: '0',
  playerStats: null,
  canClaim: false,
  nextClaimTime: 0,
  pendingRewards: '0',
  transactions: [],
  pendingTxCount: 0,
}

export const useWalletStore = create<WalletStoreState>()(
  devtools(
    immer(set => ({
      ...initialState,

      setAddress: address =>
        set(state => {
          state.address = address
          state.status = address ? 'connected' : 'disconnected'
        }),

      setChainId: chainId => set({ chainId }),

      setStatus: status =>
        set(state => {
          state.status = status
          state.isConnecting = status === 'connecting'
        }),

      setError: error =>
        set(state => {
          state.error = error
          if (error) {state.status = 'error'}
        }),

      setTokenBalance: balance => set({ tokenBalance: balance }),

      setNativeBalance: balance => set({ nativeBalance: balance }),

      setStakedBalance: balance => set({ stakedBalance: balance }),

      setPlayerStats: stats => set({ playerStats: stats }),

      setCanClaim: canClaim => set({ canClaim }),

      setNextClaimTime: time => set({ nextClaimTime: time }),

      setPendingRewards: rewards => set({ pendingRewards: rewards }),

      addTransaction: tx =>
        set(state => {
          state.transactions.unshift(tx)
          if (tx.status === 'pending') {
            state.pendingTxCount += 1
          }
          // Keep only last 50 transactions
          if (state.transactions.length > 50) {
            state.transactions = state.transactions.slice(0, 50)
          }
        }),

      updateTransaction: (hash, updates) =>
        set(state => {
          const tx = state.transactions.find(t => t.hash === hash)
          if (tx) {
            if (tx.status === 'pending' && updates.status !== 'pending') {
              state.pendingTxCount -= 1
            }
            Object.assign(tx, updates)
          }
        }),

      clearTransactions: () =>
        set(state => {
          state.transactions = []
          state.pendingTxCount = 0
        }),

      disconnect: () =>
        set(state => {
          state.address = null
          state.status = 'disconnected'
          state.error = null
          state.tokenBalance = '0'
          state.nativeBalance = '0'
          state.stakedBalance = '0'
          state.playerStats = null
          state.canClaim = false
          state.nextClaimTime = 0
          state.pendingRewards = '0'
        }),

      reset: () => set(initialState),
    })),
    { name: 'WalletStore' }
  )
)

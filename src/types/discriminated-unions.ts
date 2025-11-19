/**
 * Discriminated unions for state machines and complex states
 */

// Game State Machine
export type GameStateMachine =
  | { status: 'idle'; data?: never }
  | { status: 'loading'; progress: number }
  | { status: 'ready'; mode: string }
  | { status: 'playing'; startTime: number; score: number }
  | { status: 'paused'; resumeTime: number }
  | { status: 'ended'; finalScore: number; winner: boolean }
  | { status: 'error'; error: Error }

// Connection State
export type ConnectionState =
  | { status: 'disconnected' }
  | { status: 'connecting'; attempt: number }
  | { status: 'connected'; address: string; chainId: number }
  | { status: 'reconnecting'; attempt: number; lastAddress: string }
  | { status: 'error'; error: string; canRetry: boolean }

// Transaction State
export type TransactionState =
  | { status: 'idle' }
  | { status: 'preparing'; message: string }
  | { status: 'awaiting-signature' }
  | { status: 'pending'; hash: string; confirmations: number }
  | { status: 'success'; hash: string; receipt: unknown }
  | { status: 'failed'; hash?: string; error: Error }

// API Request State
export type ApiRequestState<T> =
  | { status: 'idle'; data?: never; error?: never }
  | { status: 'loading'; data?: never; error?: never }
  | { status: 'success'; data: T; error?: never }
  | { status: 'error'; data?: never; error: Error }

// Multiplayer Room State
export type RoomState =
  | { status: 'browsing'; rooms: Array<{ id: string; name: string; players: number }> }
  | { status: 'joining'; roomId: string }
  | { status: 'in-lobby'; roomId: string; players: string[]; isHost: boolean }
  | { status: 'starting'; roomId: string; countdown: number }
  | { status: 'in-game'; roomId: string; startTime: number }
  | { status: 'ended'; roomId: string; winner: string | null }
  | { status: 'left' }

// Wallet State
export type WalletState =
  | { status: 'uninitialized' }
  | { status: 'initializing' }
  | { status: 'disconnected'; lastAddress?: string }
  | { status: 'connecting'; provider: string }
  | {
      status: 'connected'
      address: string
      chainId: number
      balance: string
      ensName?: string
    }
  | { status: 'switching-chain'; targetChainId: number }
  | { status: 'error'; error: string; recoverable: boolean }

// Claim State
export type ClaimState =
  | { status: 'idle'; canClaim: boolean; nextClaimTime: number }
  | { status: 'checking-eligibility' }
  | { status: 'eligible'; amount: string; score: number }
  | { status: 'ineligible'; reason: string; retryAfter: number }
  | { status: 'claiming'; transactionHash?: string }
  | { status: 'claimed'; amount: string; transactionHash: string }
  | { status: 'failed'; error: string; canRetry: boolean }

// Loading State with Progress
export type LoadingState =
  | { type: 'idle' }
  | { type: 'loading'; message: string; progress?: number }
  | { type: 'success'; message?: string }
  | { type: 'error'; error: Error; retry?: () => void }

// Modal State
export type ModalState =
  | { isOpen: false; type?: never; props?: never }
  | { isOpen: true; type: 'game-over'; props: { score: number; winner: boolean } }
  | { isOpen: true; type: 'settings'; props?: { tab?: string } }
  | { isOpen: true; type: 'leaderboard'; props?: { mode?: string } }
  | { isOpen: true; type: 'wallet'; props?: Record<string, never> }
  | { isOpen: true; type: 'confirm'; props: { message: string; onConfirm: () => void } }

// Type guards for discriminated unions
export const isGamePlaying = (
  state: GameStateMachine
): state is { status: 'playing'; startTime: number; score: number } => state.status === 'playing'

export const isGameEnded = (
  state: GameStateMachine
): state is { status: 'ended'; finalScore: number; winner: boolean } => state.status === 'ended'

export const isConnected = (
  state: ConnectionState
): state is { status: 'connected'; address: string; chainId: number } =>
  state.status === 'connected'

export const isTransactionPending = (
  state: TransactionState
): state is { status: 'pending'; hash: string; confirmations: number } => state.status === 'pending'

export const isApiSuccess = <T>(
  state: ApiRequestState<T>
): state is { status: 'success'; data: T } => state.status === 'success'

export const isApiError = <T>(
  state: ApiRequestState<T>
): state is { status: 'error'; error: Error } => state.status === 'error'

export const isInRoom = (
  state: RoomState
): state is { status: 'in-lobby'; roomId: string; players: string[]; isHost: boolean } =>
  state.status === 'in-lobby'

export const isWalletConnected = (
  state: WalletState
): state is {
  status: 'connected'
  address: string
  chainId: number
  balance: string
  ensName?: string
} => state.status === 'connected'

export const isClaimEligible = (
  state: ClaimState
): state is { status: 'eligible'; amount: string; score: number } => state.status === 'eligible'

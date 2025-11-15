/**
 * Error message constants
 */

export const ERROR_MESSAGES = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  WRONG_NETWORK: 'Please switch to the correct network',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  TRANSACTION_REJECTED: 'Transaction was rejected by user',
  TRANSACTION_FAILED: 'Transaction failed. Please try again',

  // Game errors
  GAME_NOT_FOUND: 'Game session not found',
  INVALID_SCORE: 'Invalid score submitted',
  GAME_ALREADY_STARTED: 'Game has already started',
  PLAYER_NOT_FOUND: 'Player not found',

  // Claim errors
  CLAIM_COOLDOWN: 'Please wait before claiming again',
  INVALID_SIGNATURE: 'Invalid signature for claim',
  CLAIM_FAILED: 'Failed to claim rewards. Please try again',
  ALREADY_CLAIMED: 'Rewards already claimed for this game',

  // Multiplayer errors
  ROOM_FULL: 'Room is full',
  ROOM_NOT_FOUND: 'Room not found',
  CONNECTION_FAILED: 'Failed to connect to multiplayer server',
  DISCONNECTED: 'Disconnected from server',

  // API errors
  API_ERROR: 'An error occurred while contacting the server',
  NETWORK_ERROR: 'Network error. Please check your connection',
  TIMEOUT_ERROR: 'Request timed out. Please try again',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please slow down',

  // Validation errors
  INVALID_ADDRESS: 'Invalid Ethereum address',
  INVALID_INPUT: 'Invalid input provided',
  REQUIRED_FIELD: 'This field is required',

  // General errors
  UNKNOWN_ERROR: 'An unknown error occurred',
  NOT_IMPLEMENTED: 'This feature is not yet implemented',
} as const

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES]

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ?? ERROR_MESSAGES.UNKNOWN_ERROR
}

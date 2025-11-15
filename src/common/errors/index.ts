/**
 * Error code registry for consistent error handling
 */

export const ERROR_CODES = {
  // General errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Authentication errors
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_INVALID: "AUTH_INVALID",
  AUTH_EXPIRED: "AUTH_EXPIRED",

  // Wallet errors
  WALLET_NOT_CONNECTED: "WALLET_NOT_CONNECTED",
  WALLET_WRONG_NETWORK: "WALLET_WRONG_NETWORK",
  WALLET_INSUFFICIENT_FUNDS: "WALLET_INSUFFICIENT_FUNDS",
  WALLET_USER_REJECTED: "WALLET_USER_REJECTED",

  // Contract errors
  CONTRACT_CALL_FAILED: "CONTRACT_CALL_FAILED",
  CONTRACT_REVERT: "CONTRACT_REVERT",
  CONTRACT_NOT_DEPLOYED: "CONTRACT_NOT_DEPLOYED",

  // Transaction errors
  TX_FAILED: "TX_FAILED",
  TX_REVERTED: "TX_REVERTED",
  TX_TIMEOUT: "TX_TIMEOUT",
  TX_UNDERPRICED: "TX_UNDERPRICED",

  // Game errors
  GAME_NOT_STARTED: "GAME_NOT_STARTED",
  GAME_ALREADY_STARTED: "GAME_ALREADY_STARTED",
  GAME_ENDED: "GAME_ENDED",
  INVALID_SCORE: "INVALID_SCORE",

  // Claim errors
  CLAIM_COOLDOWN_ACTIVE: "CLAIM_COOLDOWN_ACTIVE",
  CLAIM_INVALID_SIGNATURE: "CLAIM_INVALID_SIGNATURE",
  CLAIM_ALREADY_CLAIMED: "CLAIM_ALREADY_CLAIMED",
  CLAIM_INSUFFICIENT_BALANCE: "CLAIM_INSUFFICIENT_BALANCE",

  // Multiplayer errors
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  ROOM_FULL: "ROOM_FULL",
  ROOM_ALREADY_STARTED: "ROOM_ALREADY_STARTED",
  PLAYER_NOT_FOUND: "PLAYER_NOT_FOUND",
  NOT_HOST: "NOT_HOST",

  // API errors
  API_ERROR: "API_ERROR",
  API_RATE_LIMIT: "API_RATE_LIMIT",
  API_BAD_REQUEST: "API_BAD_REQUEST",
  API_NOT_FOUND: "API_NOT_FOUND",
  API_SERVER_ERROR: "API_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

